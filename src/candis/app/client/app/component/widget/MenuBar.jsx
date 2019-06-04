import React       from 'react'
import PropTypes   from 'prop-types'
import storage      from 'store'

import shortid     from 'shortid'
import classNames  from 'classnames'

import Media       from './Media'
import { getBSTTProps } from '../../util'

class MenuBar extends React.Component {
  render ( ) {
    const props = this.props
    
    const titles = ['My Profile']
    const leftMenus = props.menus.filter((menu) => {
      return !titles.some((title) => {return title == menu.title})
    })
    const rightMenus = props.menus.filter((menu) => {
      return titles.some((title) => {return title == menu.title})
    })
    
    return (
      <div
               id={`menubar-${props.ID}`}
        className={classNames("navbar navbar-default", props.classNames.root)}>
        <div className={props.fluid ? "container-fluid" : "container"}>
          {
            props.menus.length ?
              <span>
                <div className="navbar-header">
                  <button
                      className="collpased navbar-toggle"
                    data-toggle="collapse"
                    data-target={`#menubar-${props.ID}-collapse`}>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
                </div>
                <div id={`menubar-${props.ID}-collapse`} className="collapse navbar-collapse">
                  <ul className="nav navbar-nav">
                    {
                      leftMenus.map((menu, index) => {
                        return (
                          <MenuBar.Menu
                                key={index} {...menu}
                            onClick={(action) => {
                              props.onClick(action, menu)
                            }}/>
                        )
                      })
                    }
                  </ul>
                  <ul className="nav navbar-nav navbar-right">
                    {
                      rightMenus.map((menu, index) => {
                        return (
                          <MenuBar.Menu
                                key={index} {...menu}
                                user={props.user}
                            onClick={(action) => {
                              props.onClick(action, menu)
                            }}/>
                        )
                      })                      
                    }
                  </ul>
                </div>
              </span> : false
          }
        </div>
      </div>
    )
  }
}

MenuBar.Menu    = class extends React.Component {
  render ( ) {
    const props = this.props

    return (
      <li className="dropdown">
        <a href="javascript:void(0);" className="dropdown-toggle"
          data-toggle="dropdown">
          {props.user && props.title === 'My Profile' ? props.user.username : props.title}
        </a>
        <ul className="dropdown-menu">
          {
            props.actions.map((action, index) => {
              const ttprops = getBSTTProps(action.tooltip)

              return (
                <li key={index} {...ttprops}>
                  <a href="javascript:void(0);" onClick={() => {
                      props.onClick(action)
                    }}>
                    <Media title={action.text} icon={action.icon}/>
                  </a>
                </li>
              )
            })
          }
        </ul>
      </li>
    )
  }
}

MenuBar.Menu.propTypes    =
{
    title: PropTypes.string.isRequired,
  actions: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
}

MenuBar.propTypes         =
{
          ID: PropTypes.string,
  classNames: PropTypes.object,
       menus: PropTypes.array,
       fluid: PropTypes.bool,
     onClick: PropTypes.func.isRequired,
}
MenuBar.defaultProps      =
{
          ID: shortid.generate(),
  classNames: { },
       menus: [ ],
       fluid: false
}

export default MenuBar
