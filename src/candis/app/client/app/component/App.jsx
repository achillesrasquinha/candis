import React             from 'react'
import PropTypes         from 'prop-types'
import { connect }       from 'react-redux'

import config            from '../config'

import AppBar            from './AppBar'
import MenuBar           from './widget/MenuBar'
import ToolBox           from './widget/toolbox/ToolBox'
import DocumentProcessor from './widget/document/DocumentProcessor'
import Modal             from './widget/Modal'

import menus             from '../meta/Menus'
import compartments      from '../meta/Compartments'

import { getResource }   from '../action/AsynchronousAction'

class App extends React.Component {
  componentWillMount ( ) {
    const props  = this.props
    const action = getResource()

    props.dispatch(action)
  }

  render ( ) {
    const props  = this.props

    return (
      <div>
        <AppBar
               image={`${config.routes.images}/logo.png`}
          classNames={{ root: ["no-border-bottom", "no-margin"] }}/>
        <MenuBar
            menus={menus}
            user={props.user}
          onClick={(action) => {
            props.dispatch(action.onClick)
          }}/>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-3">
              <ToolBox title="Tool Box" compartments={compartments}/>
            </div>
            <div className="col-sm-9">
              <DocumentProcessor/>
            </div>
          </div>
        </div>
        <Modal/>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  const app           = state.app

  return {
    user: app.user
  }
}

export default connect(mapStateToProps)(App)
