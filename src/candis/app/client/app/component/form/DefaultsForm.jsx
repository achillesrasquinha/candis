import React from "react"
import { connect } from 'react-redux'
import axios from 'axios'
import PropTypes from "prop-types"
import ReactDataGrid  from 'react-data-grid'
import classNames from "classnames"
import { withFormik, Form, Field } from "formik"
import * as Yup from "yup"

import config from '../../config'
import defaults from '../../action/DefaultsAction'

const DefaultsBasic = props => {
  return(
    <div className="container-fluid">
      <Form>

        <div className="form-group">
          <label className="control-label col-sm-4">Training data Percentage: </label>
          <div className="col-sm-8">
            <Field
              type="number"
              name={"trainPercent"}
              className="form-control"
              min="1"
              max="100" 
              value={props.values.trainPercent}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-sm-4">Download Path: </label>
          <div className="col-sm-8">
            <Field
              type="text"
              name={"downloadPath"}
              className="form-control"
              value={props.values.downloadPath}
            />
          </div>          
        </div>
        
        <div className="form-group">
          <div className="col-sm-offset-4 col-sm-8">
            <button type="submit" className="btn btn-block btn-primary">
              <div className="text-uppercase font-bold">Update</div>
            </button>
          </div>
        </div>

      </Form>
    </div>
  )
}

const DefaultsEnhanced = withFormik({
  mapPropsToValues: (props) => ({
    trainPercent: props.trainPercent || props.defaults.trainPercent,
    downloadPath: props.downloadPath || props.defaults.downloadPath
  }),
  handleSubmit(values, { props }){
    const action = defaults.update(values)
    props.dispatch(action)
    toastr.success("Defaults updated successfully!")
  }
})(DefaultsBasic)

const mapStateToProps = (state, props) => {
  const defaults = state.defaults
  return {
    defaults: defaults
  }
}

export default connect(mapStateToProps)(DefaultsEnhanced)
