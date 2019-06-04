import React        from 'react'
import PropTypes    from 'prop-types'
import axios from 'axios'
import { Redirect, Link } from 'react-router-dom'
import { connect }  from 'react-redux'

import jsonwebtoken from 'jsonwebtoken'

import config       from '../config'

import ForgotPasswordForm   from '../component/form/ForgotPasswordForm'
import ResetPasswordForm from '../component/form/ResetPasswordForm'
import ActionType   from '../constant/ActionType'
import { signin }   from '../action/AppAction'

class ResetPassword extends React.Component {
  constructor (props) {
    super (props)
    
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (data, setSubmitting) {
    const output = { 'email': data }
    return axios.post(config.routes.API.user.forgotPassword, output).then(({data}) => {
      toastr.success("Check your inbox!")
      // setSubmitting(false)
    }).catch(({response}) => {
      const error = response.data.error
      toastr.error(error)
    })
  }

  render () {
    return (
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
            <ForgotPasswordForm onSubmit={this.onSubmit}/>
          </div>
        </div>
      </div>
    </div>
    )
  }
}

export default ResetPassword
