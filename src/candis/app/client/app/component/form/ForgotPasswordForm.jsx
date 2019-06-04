import React from "react"
import axios from 'axios'
import PropTypes from "prop-types"
import classNames from "classnames"
import { connect } from 'react-redux'
import { withFormik, Form, Field } from "formik"
import * as Yup from "yup"

import config from '../../config'

const ForgotPasswordBasic = props => (
  <Form className="form-inline">
    
    <div className="form-group">
      <Field type="email" name="email" className="form-control" placeholder="email"/>
      <small className="help-block">
        {props.touched.email && props.errors.email}
      </small>
    </div>
    
    <button className="btn btn-block btn-brand-primary" disabled={props.isSubmitting}>
      <div className="text-center">
        <div className="text-uppercase font-bold">
        {props.isSubmitting ? <i className="fa fa-spinner fa-pulse"></i> : <i className="fa fa-send-o"></i>}
        {" "}Send Email!
        </div>
      </div>
    </button>

  </Form>
)

const ForgotPasswordEnhanced = withFormik({
  mapPropsToValues: (props) => ({email: props.email || ""}),
  validationSchema: Yup.object().shape({
    email: Yup.string().email("Email is not valid").required("This field is required")
  }),
  handleSubmit: (values, { props, setSubmitting, resetForm }) => {
    props.onSubmit(values.email).then(() => {
      setSubmitting(false)
    }).catch(() => {
      resetForm()
    })
  }
})(ForgotPasswordBasic)

export default ForgotPasswordEnhanced
