import React       from 'react'
import PropTypes   from 'prop-types'
import shortid     from 'shortid'
import classNames  from 'classnames'

import Media       from './Media'
import { getBSTTProps } from '../../util'

class TabBar extends React.Component {
  render ( ) {
    const props = this.props

    return props.tabs.length ? 
      (
        <ul className="nav nav-pills">
          {
            props.tabs.map((tab, index) => {
              return (
                <TabBar.Tab key={index} {...tab} onClick={() => {
                  props.onClick(tab)
                }}/>
              )
            })
          }
        </ul>
      ) : false
  }
}

TabBar.Tab          = class extends React.Component {
  render ( ) {
    const props     = this.props

    return (
      <li id={`tab-${props.ID}`} className={props.active ? "active" : null}>
        <a href="javascript:void(0);" onClick={() => {
          props.onClick()
        }}>
          {props.title}
        </a>
      </li>
    )
  }
}

TabBar.Tab.propTypes    = 
{  
       ID: PropTypes.string,
    title: PropTypes.string.isRequired,
  onClick: PropTypes.func
}
TabBar.Tab.defaultProps = 
{
       ID: shortid.generate(),
  onClick: () => { }
}

TabBar.propTypes        =
{
     tabs: PropTypes.array,
     menu: PropTypes.array,
  onClick: PropTypes.func
}
TabBar.defaultProps     =
{
     tabs: [ ],
     menu: [ ],
  onClick: () => { }
}

export default TabBar
