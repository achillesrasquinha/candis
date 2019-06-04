import React       from 'react'
import PropTypes   from 'prop-types'
import { connect } from 'react-redux'
import shortid     from 'shortid'

import TypeAhead   from '../TypeAhead'
import Compartment from './Compartment'
import TipView     from './TipView'

import { insertTool, onHoverTool } from '../../../action/ToolBoxAction'

class ToolBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = ToolBox.defaultStates
  }
  componentWillMount ( ) {
    this.props.compartments.forEach((_, index) => {
      let compartment  = this.props.compartments[index]
      compartment.ID   = `compartment-${shortid.generate()}`

      if ( compartment.tools ) {
        compartment.tools.forEach((object) => {
          const tool   = {...object, compartmentID: compartment.ID,
            compartmentName: compartment.name }
          const action = insertTool(tool)

          this.props.dispatch(action)
        })
      }

      if ( compartment.fetcher ) {
        compartment.fetcher().then((tools) => {
          tools.forEach((object) => {
            const tool   = {...object, compartmentID: compartment.ID,
              compartmentName: compartment.name }
            const action = insertTool(tool)

            this.props.dispatch(action)
          })
        })
      }
    })
  }

  render ( ) {
    const props  = this.props

    const active = props.active
    const tools  = props.tools

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <div className="row">
            <div className="col-xs-8">
              <div className="panel-title font-bold">
                {props.title}
              </div>
            </div>
            <div className="col-xs-4">
              <div className="text-right">
                <a href={`#toolbox-${props.ID}-collapse`} 
                  data-toggle="collapse" onClick={() => {
                    this.setState({
                      active: this.state.active ? false: true
                    })
                  }}>
                  {
                    this.state.active ?
                      <span className="fa fa-fw fa-minus" data-toggle="tooltip" title="Minimize"/>
                      :
                      <span className="fa fa-fw fa-chevron-down" data-toggle="tooltip" title="Maximize"/>
                  }
                </a>
              </div>
            </div>
          </div>
        </div>
        <div id={`toolbox-${props.ID}-collapse`} className="collapse panel-collapse in">
          <div className="panel-body">
            <TypeAhead
                  placeholder="Search tool"
                         data={props.tools}
                         keys={["name", "tooltip", "description", "compartmentName"]}
                      maximum={4}
                  onMouseOver={(tool) => {
                    props.dispatch(onHoverTool(tool))
                  }}
                  onMouseOut ={(tool) => {
                    props.dispatch(onHoverTool(null))
                  }}

                     onSelect={(tool) => {
                       props.dispatch(tool.onClick)
                     }}
                          map={{
                            title: "name",
                             body: "compartmentName",
                             icon: "icon"
                          }}/>
            <div className="panel-group no-margin" id={`toolbox-${props.ID}`}>
              {
                props.compartments.map((compartment, index) => {
                  return (
                    <Compartment
                          key={index}
                           ID={compartment.ID}
                         name={compartment.name}
                         icon={compartment.icon}
                      tooltip={compartment.tooltip}
                       parent={`toolbox-${this.props.ID}`}/>
                  )
                })
              }
            </div>
          </div>
          <div className="panel panel-default no-margin no-shadow no-border-left no-border-right no-border-bottom">
            <div id={`toolbox-${props.ID}-tipview-collapse`} className="collapse panel-collapse in">
              <div className="panel-body">
                {
                  active ?
                    <TipView
                        title={active.name}
                      content={active.description ?
                                active.description : active.tooltip
                              }/> : false
                }
              </div>
            </div>
          </div>

          <div className="panel-footer">
            {/* Quick Tools ToolBar */}
            <div className="btn-group btn-group-sm">
              <div data-toggle="tooltip" data-placement="top" title="Toggle Help">
                <button className="btn btn-sm btn-primary" data-toggle="collapse"
                  data-target={`#toolbox-${props.ID}-tipview-collapse`}>
                  <i className="fa fa-fw fa-question-circle-o"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ToolBox.propTypes         =
{
            ID: PropTypes.string,
         title: PropTypes.string,
  compartments: PropTypes.array
}
ToolBox.defaultProps      =
{
            ID: shortid.generate(),
         title: "",
  compartments: [ ]
}
ToolBox.defaultStates = { active: true }

const mapStateToProps     = (state) => {
  const toolBox           = state.toolBox

  return {
         tools: toolBox.tools,
    active: toolBox.active
  }
}

export default connect(mapStateToProps)(ToolBox)
