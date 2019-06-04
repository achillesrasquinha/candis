import React        from 'react'
import PropTypes    from 'prop-types'
import axios from 'axios'
import { Redirect, Link } from 'react-router-dom'
import { connect }  from 'react-redux'

import jsonwebtoken from 'jsonwebtoken'

import config       from '../config'

import ResetPasswordForm from '../component/form/ResetPasswordForm'
import ActionType   from '../constant/ActionType'
import { signin }   from '../action/AppAction'

class ResetPassword extends React.Component {
  constructor (props) {
    super (props)
    
    this.state = {
      resetToken: null
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount () {
    const props = this.props
    const reset_token = props.location.search.match(/reset_token=(.*)/)[1]
    const output = { reset_token }
    axios.post(config.routes.API.user.resetPassword, output).then(({ data }) => {
      this.setState({
        resetToken: reset_token
      })
    }).catch(({response}) => {
      toastr.error("Invalid Reset Token!")
      this.setState({
        resetToken: null
      })
    })
  }

  onSubmit (data) {
    const reset_token = this.state.resetToken
    const output = { reset_token, new_password: data }
    return axios.post(config.routes.API.user.resetPassword, output).then(({ data }) => {
      toastr.success("Password updated successfully! Login with your new password.")
    }).catch(({response}) => {
      this.setState({
        resetToken: null
      })
      toastr.error("Reset Token might have expired. Generate again!")
    })
  }

  render () {
    const props = this.props
    
    return this.state.resetToken !== null ?
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
            <ResetPasswordForm onSubmit={this.onSubmit}/>
            <Link to={config.routes.signin} className="link">Go to SignIn Page</Link>
          </div>
        </div>
      </div>
    </div>
    )
    :
    (
      <Link to={config.routes.base} className="link">Home</Link>
    )
  }
}

export default ResetPassword
