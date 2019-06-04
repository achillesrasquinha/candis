import React from "react"
import { connect } from 'react-redux'
import axios from 'axios'
import PropTypes from "prop-types"
import ReactDataGrid  from 'react-data-grid'
import classNames from "classnames"
import { withFormik, Form, Field } from "formik"
import * as Yup from "yup"

import io from 'socket.io-client'

import config from '../../config'
import SelectTags from "../widget/SelectTags"
import entrez from '../../action/EntrezAction'

const EntrezBasic = props => {
  const flag = props.search_results.length == 0
  return (
    <div className="container-fluid">
      <Form>

        <div className="form-group">
          <label>Email</label>
          <Field type="email" name="email" className="form-control" placeholder={props.email}/>
          <small className="help-block">
            {props.touched.email && props.errors.email}
          </small>
        </div>
        
        <div className="form-group">
          <label>Tool Name</label>
          <Field type="text" name="toolName" className="form-control" placeholder={props.toolName}/>
          <small className="help-block">
            {props.touched.toolName && props.errors.toolName}
          </small>          
        </div>
          
        <div className="form-group">
          <label>API KEY</label>
          <Field type="text" name="api_key" className="form-control" autoFocus />
        </div>

        <div className="form-group">
          <label>Database (Select 1)</label> 
          <SelectTags
            className="form-control"
            name={"database"}
            multi={false}
            onChange={props.setFieldValue}
            options={props.options}
            onBlur={props.setFieldTouched}
            value={props.values.database}
            error={props.errors.database}
            touched={props.touched.database}
          />
        </div>

        <div className="form-group">
          <label>Terms (Enter Atleast 1)</label>
          <SelectTags
            className="form-control"
            name={"term"}
            multi={true}
            onChange={props.setFieldValue}
            onBlur={props.setFieldTouched}
            value={props.values.term}
            error={props.errors.term}
            touched={props.touched.term}
          />
        </div>
        
        <div className="row">
          <div className="col-xs-4">
            <button
              onClick={() => props.onSwitch('search')}
              className={`btn btn-block btn-${flag ? 'primary': 'success'}`}
              disabled={flag}>
              <div className="text-uppercase font-bold">
                Next{" "}
                <i className="fa fa-chevron-right"></i>
              </div>
            </button>            
          </div>
          <div className="col-xs-4"></div>
          <div className="col-xs-4">
            <button type="submit" disabled={props.isSubmitting} className="btn btn-block btn-primary">
              <div className="text-uppercase font-bold">
              {props.isSubmitting ? <i className="fa fa-spinner fa-pulse"></i> : <i className="fa fa-search"></i>}
                {" "}Search
              </div>
            </button>
          </div>
        </div>

      </Form>
    </div>
  )
}

const EntrezEnhanced = withFormik({
  mapPropsToValues: (props) => ({
    email: props.user.email || "",
    toolName: props.user.username || "",
    api_key: props.api_key || ""
  }),
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email("Email is not valid")
      .required("This field is required!"),
    api_key: Yup.string(),
    toolName: Yup.string().required("This field is required!"),
    database: Yup.string().required("This field is required!"),
    term: Yup.string().required("This field is required!")
  }),
  handleSubmit(values, { props, setSubmitting }) {
    const payload = {
      ...values,
      database: values.database.value,
      term: values.term.map(t => t.value)
    }

    const action = entrez.search(payload)
    props.dispatch(action).then(() => {
      setSubmitting(false)
    })

  },
  displayName: "Entrez Form"
})(EntrezBasic)

class EntrezDataGrid extends React.Component {
  constructor(props){
    super(props)

    this.socket = io.connect(`http://${config.host}:${config.port}`)
    this.state = EntrezDataGrid.defaultStates
    
    this.rowGetter = this.rowGetter.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.onClick = this.onClick.bind(this)
  }

  componentDidUpdate ( )
  {
    if ( this.state.downloading )
    {
      this.socket.on('status', (status) => {
        this.setState({
          status: status
        })
      })
    }
  }  

  onClick () {
    let payload = this.state.payload
    payload = {...payload, path: this.props.downloadPath}
    
    this.setState({ downloading: true })
    
    const action = entrez.download(payload)
    this.props.dispatch(action).then(() => {
      this.setState({ downloading: false })
      toastr.success("Downloaded successfully!")
    }).catch(() => {
      this.setState({ downloading: false })
      toastr.error("Could not download the selected file.")
    })
  }

  rowGetter(i) {
    return this.props.search_results[i]
  }  

  onSelect(row) {
    const payload = {
      accession: row[0].accession,
      toolName: this.props.toolName,
      database: this.props.database,
      email: this.props.email
    }
    this.setState({
      ...this.state,
      payload
    })
  }

  render() {
  // cols 'key' parameter is dependent on api/data/search API endpoint
    const cols = [
      {
        key: 'accession',
        name: 'accession number',
        resizable: true,
        width: 200
      },
      {
        key: 'title',
        name: 'title',
        resizable: true,
        width: 1000

      },
      {
        key: 'taxon',
        name: 'taxon',
        resizable: true,
        width: 200
      }
    ]

    const status = this.state.status
    const len = status.logs.length
    if ( len ) {
      let log = status.logs[len - 1]
      toastr.clear()
      
      toastr.options = { extendedTimeOut: 0 }
      toastr.info(log, 'Status')
    }

    const props = this.props
    return (
      <div>
        <ReactDataGrid
          rowKey="accession"
          columns={cols}
          rowGetter={this.rowGetter}
          rowsCount={props.search_results.length}
          enableCellSelect={true}
          enableRowSelect="single"
          onRowSelect={this.onSelect}
          minHeight={500}
        />
        <div className="row">
          <div className="col-xs-4">
            <button onClick={() => props.onSwitch('download')} className="btn btn-block btn-primary" >
              <div className="text-uppercase font-bold">
                <i className="fa fa-chevron-left"></i>  
                {" "}Previous
              </div>
            </button>
          </div>
          <div className="col-xs-4"></div>
          <div className="col-xs-4">
            <button onClick={this.onClick} disabled={!this.state.payload || this.state.downloading} className="btn btn-block btn-primary">
              <div className="text-uppercase font-bold">
              {this.state.downloading ? <i className="fa fa-spinner fa-pulse"></i> : <i className="fa fa-download"></i>}
                {" "}Download
              </div>
            </button>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  const entrez = state.entrez
  const user = state.app.user
  const defaults = state.defaults
  return {
    search_results: entrez.search_results,
    toolName: entrez.toolName,
    database: entrez.database,
    api_key: entrez.api_key,
    email: entrez.email,
    user: user,
    downloadPath: defaults.downloadPath
  }
}

const ConnectedEntrezEnhanced = connect(mapStateToProps)(EntrezEnhanced)
const ConnectedEntrezDataGrid = connect(mapStateToProps)(EntrezDataGrid)

class Entrez extends React.Component {
  constructor(props){
    super(props)

    this.state = Entrez.defaultStates
    
    this.onSwitch = this.onSwitch.bind(this)
  }

  onSwitch (val) {

    let form = 'search'
    if(val == 'search'){
      form = 'download'
    }
    this.setState({ activeForm: form })
  }

  render () {
    const props = this.props
    return (
      <div>
        { (this.state.activeForm === 'search')
          ?
          <ConnectedEntrezEnhanced onSwitch={this.onSwitch}/>
          :
          <ConnectedEntrezDataGrid onSwitch={this.onSwitch}/>
        }
      </div>
    )    
  }

}

EntrezDataGrid.defaultStates = { payload: undefined, downloading: false , status: { logs: [ ] } }
Entrez.defaultStates = { activeForm: 'search' }

export default connect(mapStateToProps)(Entrez)

