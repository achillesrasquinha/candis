import React from "react"
import axios from 'axios'
import PropTypes from "prop-types"
import classNames from "classnames"
import { connect } from 'react-redux'
import { withFormik, Form, Field } from "formik"
import * as Yup from "yup"

import config from '../../config'
import { signin }   from '../../action/AppAction'

const SignInBasic = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
}) => (
  <form onSubmit={handleSubmit}>
    <div className="form-group">
      <input
        className="form-control"
        type="text"
        name="username"
        placeholder="username"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.username}
        autoFocus
      />
      <small className="help-block">{touched.username && errors.username}</small>
    </div>
    <div className="form-group">
      <input
        className="form-control"
        type="password"
        name="password"
        placeholder="password"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.password}
      />
      <small className="help-block">{touched.password && errors.password}</small>
    </div>
    <button className="btn btn-block btn-brand-primary">
      <div className="text-center">
        <div className="text-uppercase font-bold">
          Sign In
        </div>
      </div>
    </button>
  </form>
)

const SignInEnhanced = withFormik({
  mapPropsToValues: props => ({username: '', password: ''}),

  validationSchema: Yup.object().shape({
    username: Yup.string().min(4).required("This field is required"),
    password: Yup.string().required("This field is required to login")
  }),

  handleSubmit: (
    values,
    {
      props,
      resetForm,
      setSubmitting,
      setStatus,
      setErrors
    }
  ) => {
    axios.post(config.routes.API.user.login, values).then(({data}) => {
      toastr.success("Successfully logged in")
      const payload = {
        token: data.data.token,
        user: {
          username: values.username,
          email: values.email
        }
      }
      setSubmitting(false)
      props.onSubmit(payload)
    }, ({response}) => {
      setSubmitting(false)
      toastr.error(response.data.error.errors[0].message)
    })
  },
})(SignInBasic)

SignInEnhanced.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

SignInEnhanced.defaultProps = {
  onSubmit: (payload) => (undefined)
}

export default SignInEnhanced
