import React      from 'react'
import PropTypes  from 'prop-types'
import classNames from 'classnames'

import { getBSTTProps } from '../../util'

class ToolBar extends React.Component {
  render ( ) {
    const props = this.props

    return props.tools.length ?
      (
        <ul className={classNames("list-inline", props.classNames.root)}>
          {
            props.tools.map((tool, index) => {
              const ttattrs = getBSTTProps(tool.tooltip)
              var   holder  = null

              if ( tool.icon ) {
                holder = (<img src={tool.icon} width={`${props.size}`}/>)
              } else 
              if ( tool.faicon ) {
                holder = (<i className={`fa fa-fw fa-${tool.faicon}`}/>)
              } else {
                holder = tool.name
              }

              return (
                <li key={index} {...ttattrs}>
                  <a style={{ padding: '5px' }} href="javascript:void(0);" onClick={() => {
                    props.onClick(tool)
                  }}>
                    {holder}
                  </a>
                </li>
              )
            })
          }
        </ul>
      ) : null
  }
}

ToolBar.propTypes    = 
{
       tools: PropTypes.array,
  classNames: PropTypes.object,
        size: PropTypes.number,
     onClick: PropTypes.func.isRequired
}
ToolBar.defaultProps = 
{
       tools: [ ],
  classNames: { },
        size: 20
}

export default ToolBar
