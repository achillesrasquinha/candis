import React       from 'react'
import PropTypes   from 'prop-types'
import { connect } from 'react-redux'
import classNames  from 'classnames'
import shortid     from 'shortid'

import Media       from '../Media'

import { onHoverTool } from '../../../action/ToolBoxAction'

class Compartment extends React.Component {
  constructor (props) {
    super (props)

    this.ID    = props.ID ? props.ID : shortid.generate()
    this.state = Compartment.defaultStates
  }

  render ( ) {
    const tooltip = this.props.tooltip
    const ttattrs = tooltip ?
      {
           "data-toggle": "tooltip",
        "data-placement": "top",
                   title: tooltip
      } : { }
    const tools   = this.props.tools.filter((tool) => {
      return tool.compartmentID == this.ID
    })

    return (
      <div className="panel panel-default" {...ttattrs}>
        <div className="panel-heading">
          <a data-toggle="collapse" data-parent={`#${this.props.parent}`}
            href={`#compartment-${this.ID}`} onClick={() => {
              this.setState({
                active: this.state.active ? false : true
              })
            }}>
            <div className="row">
              <div className="col-xs-8">
                <Media title={this.props.name} icon={this.props.icon}/>
              </div>
              <div className="col-xs-4">
                <div className="text-right">
                  {
                    this.state.active ?
                      <i className="fa fa-fw fa-chevron-up" data-toggle="tooltip" title="Close"/>
                      :
                      <i className="fa fa-fw fa-chevron-down" data-toggle="tooltip" title="Open"/>
                  }
                </div>
              </div>
            </div>
          </a>
        </div>
        <div className="collapse panel-collapse" id={`compartment-${this.ID}`}>
          {
            tools.length ?
              <ul className="list-group"
                style={{
                  maxHeight: '150px',
                  overflowY: 'scroll'
                }}>
                {
                  tools.map((tool, index) => {
                    const tooltip = tool.tooltip
                    const ttattrs = tooltip ?
                      {
                           "data-toggle": "tooltip",
                        "data-placement": "top",
                                   title: tooltip
                      } : { }

                    return (
                      <li key={index} className="list-group-item"
                        onMouseOver={() => { this.props.dispatch(onHoverTool(tool)) }}
                        onMouseOut ={() => { this.props.dispatch(onHoverTool(null)) }}>
                        <a href="javascript:void(0);" onClick={() => {
                          this.props.dispatch(tool.onClick)
                        }} {...ttattrs}>
                          <Media
                            title={tool.name}
                             body={tool.tooltip}
                             icon={tool.icon}/>
                        </a>
                      </li>
                    )
                  })
                }
              </ul>
              :
              <div className="panel-body">
                No tools found.
              </div>
          }
        </div>
      </div>
    )
  }
}

Compartment.PropTypes     =
{
  name: PropTypes.string.isRequired
}
Compartment.defaultStates = { active: false }

const mapStateToProps     = (state) => {
  const toolBox           = state.toolBox
  const tools             = toolBox.tools

  return {
    tools: tools
  }
}

export default connect(mapStateToProps)(Compartment)
