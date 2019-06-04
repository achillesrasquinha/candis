import React         from 'react'
import PropTypes     from 'prop-types'
import { connect }   from 'react-redux'
import classNames    from 'classnames'

import io            from 'socket.io-client'

import ToolBar       from '../ToolBar'
import Media         from '../Media'
import DocumentPanel from './DocumentPanel'

import config        from '../../../config'
import { setActiveDocument } from '../../../action/DocumentProcessorAction'
import pipeline      from '../../../action/PipelineAction'
import Pipeline      from '../../../constant/Pipeline'

class DocumentProcessor extends React.Component
{
  constructor (props)
  {
    super (props)

    this.socket = io.connect(`http://${config.host}:${config.port}`)
    this.state  = DocumentProcessor.defaultStates
  }

  componentDidUpdate ( )
  {
    const props = this.props

    if ( props.running )
    {
      this.socket.on('status', (status) => {
        this.setState({
          status: status
        })
      })
    }
  }

  render ( ) {
    const props  = this.props
    const status = this.state.status
    const tools  =
    [
      {
           name: 'Run',
         faicon: 'play',
        tooltip: 'Run the currently active pipeline',
        onClick: ( ) => {
          if ( props.active )
          {
            const output = props.active.output
            const action = pipeline.run(output)

            props.dispatch(action)
          } else
          {
            toastr.error('No active Pipeline', 'Error')
          }
        }
      },
      {
        name: 'Delete',
        icon: `${config.routes.icons}/delete.png`,
      tooltip: 'delete the currently active pipeline',
      onClick: ( ) => {
        if ( props.active )
        {
          const activePipe = props.active.output.name
          bootbox.confirm({
            title: "Delete Pipeline?",
            message: `Do you want to delete ${activePipe}? This pipeline will no longer be accessible.`,
            buttons:
              {
                cancel: { label: "Cancel", className: "btn-sm btn-primary" },
               confirm: { label: "Confirm", className: "btn-sm btn-success" }
             },
            callback: (result) => {
              if (result) {
                const action = pipeline.delete(activePipe)
                props.dispatch(action)
              }
            }
        })

        } else
        {
          toastr.error('No active Pipeline', 'Error')
        }
      }
    }

  ]

    props.errors.forEach((err) => {
      toastr.clear()
      toastr.error(err.message, 'Error')
    })

    if ( status.logs.length )
    {
      var log = status.logs.pop()
      toastr.clear()
      
      toastr.options = { extendedTimeOut: 0 }
      toastr.info(log, 'Status')
    }

    return (
      <div>
        <div className="panel panel-default no-shadow">
          <div className="panel-heading">
            <div className="text-center">
              {
                props.running && status.logs.length ?
                  null
                  :
                  <ToolBar
                         tools={tools}
                    classNames={{ root: "no-margin" }}
                       onClick={(tool) => {
                          tool.onClick()
                       }}/>
              }
            </div>
          </div>
        </div>
        {
          props.running && status.stages.length ?
            <ul className="list-group">
              {
                status.stages.map((stage, index) =>
                {
                  return (
                    <li key={index} className={classNames("list-group-item",
                        { "list-group-item-warning": stage.status == Pipeline.Status.READY },
                        { "list-group-item-success": stage.status == Pipeline.Status.COMPLETE }
                      )}>
                      <p>
                        <Media
                          title={stage.name}
                           body={stage.label}/>
                      </p>
                      {
                        stage.status == Pipeline.Status.RUNNING ?
                          <div className="progress progress-striped active no-margin">
                            <div className="progress-bar" style={{ width: "100%" }}/>
                          </div>
                          : null
                      }
                    </li>
                  )
                })
              }
            </ul>
            :
            <DocumentPanel
              documents={props.documents}
                 active={props.active}
               onActive={(dokument) => {
                  props.dispatch(setActiveDocument(dokument))
               }}/>
        }
      </div>
    )
  }
}

DocumentProcessor.propTypes     = { documents: PropTypes.array }
DocumentProcessor.defaultProps  = { documents: [ ] }

DocumentProcessor.defaultStates = { status: { logs: [ ], stages: [ ] } }

const mapStateToProps           = (state, props) => {
  const documentProcessor       = state.documentProcessor
  const documents               = documentProcessor.documents
  const active                  = documentProcessor.active
  const errors                  = documentProcessor.errors
  const running                 = documentProcessor.running

  return { documents: documents, active: active, errors: errors, running: running }
}

export default connect(mapStateToProps)(DocumentProcessor)
