import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import config from '../config'
import SignUpForm from '../component/form/SignUpForm'
import { signin } from '../action/AppAction'
import ActionType   from '../constant/ActionType'

class SignUp extends React.Component {
  constructor(props){
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (data) {
    const props    = this.props
    const dispatch = props.dispatch
    
    dispatch({
      type: ActionType.App.SIGNIN_REQUEST
    })

    const action   = signin(data)
    props.dispatch(action)
    
    props.dispatch({
      type: ActionType.App.SIGNIN_SUCCESS
    })
  }

  render(){
    const props = this.props
    const { from } = { from: { pathname: config.routes.base } }
    return props.user !== null ?
      (<Redirect
         to={from} 
        />)
      :
      (
        <div className="jumbotron no-margin vertical-center">
          <div className="container-fluid">
            <div className="panel panel-default no-margin no-background no-border no-shadow">
              <div className="panel-body">
                <img className="img-responsive center-block" src={`${config.routes.images}/logo-w-title.png`} style={{
                    maxHeight: '256px'
                  }}/>
              </div>
            </div>
            <div className="panel panel-default no-margin no-background no-border no-shadow">
              <div className="panel-body">
                <SignUpForm onSubmit={this.onSubmit} />
              </div>
            </div>
          </div>
        </div>
      )
  }
}

SignUp.propTypes      = 
{
  user: PropTypes.object
}
SignUp.defaultProps   = 
{
  user: null
}

const mapStateToProps = (state, props) => {
  const app           = state.app

  return {
    user: app.user
  }
}  

export default connect(mapStateToProps)(SignUp)
