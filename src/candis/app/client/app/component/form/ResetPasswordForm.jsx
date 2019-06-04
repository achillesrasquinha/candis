import React from "react"
import axios from 'axios'
import PropTypes from "prop-types"
import classNames from "classnames"
import { connect } from 'react-redux'
import { withFormik, Form, Field } from "formik"
import * as Yup from "yup"

import config from '../../config'

const ResetPasswordBasic = props => (
  <Form>
    <div className="form-group">
      <Field type="password" name="password" className="form-control" placeholder="New Password"/>
      <small className="help-block">
        {props.touched.password && props.errors.password}
      </small>
    </div>  

    <div className="form-group">
      <Field type="password" name="confirmPassword" className="form-control" placeholder="Confirm Password"/>
      <small className="help-block">
        {props.touched.confirmPassword && props.errors.confirmPassword}
      </small>
    </div>
    
    <button className="btn btn-block btn-brand-primary" disabled={props.isSubmitting}>
    <div className="text-center">
      <div className="text-uppercase font-bold">
      {props.isSubmitting ? <i className="fa fa-spinner fa-pulse"></i> : <i className="fa fa-edit"></i>}
      {" "}Reset Password
      </div>
    </div>
    </button>
  </Form>
)

const ResetPasswordEnhanced = withFormik({
  mapPropsToValues: (props) => ({
    password: props.password || "",
    confirmPassword: props.confirmPassword || ""
  }),

  validationSchema: Yup.object().shape({
    password: Yup.string().min(8).required("Enter new password!"),
    confirmPassword: Yup.string().oneOf([Yup.ref("password"), null], "Passwords don't match!").required("This field is required.")
  }),

  handleSubmit: (values, {props, setSubmitting, resetForm}) => {
    props.onSubmit(values.password).then(() => {
      setSubmitting(false)
      resetForm()
    }).catch(() => {
      resetForm()
    })
  }
})(ResetPasswordBasic)

export default ResetPasswordEnhanced

