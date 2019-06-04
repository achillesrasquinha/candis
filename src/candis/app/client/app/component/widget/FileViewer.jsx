import React           from 'react'
import PropTypes       from 'prop-types'
import { connect }     from 'react-redux'

import Select          from 'react-select'
import ReactDataGrid   from 'react-data-grid'
import classNames      from 'classnames'

import axios           from 'axios'

import config          from '../../config'

import FileFormat      from '../../constant/FileFormat'
import { getFiles }    from '../../util'
import { getResource } from '../../action/AsynchronousAction'

class FileViewer extends React.Component {
  constructor (props) {
    super (props)

    this.onChange = this.onChange.bind(this)

    this.state    = FileViewer.defaultStates
  }

  onChange (value) {
    this.setState({
      output: value
    })

    const parameters  = JSON.parse(value.value)

    axios.post(config.routes.API.data.read, parameters).then(({ data }) => {
      const response  = data

       if ( response.status == "success" ) {
        const dataset = response.data
        const columns = dataset.attrs.map((attr, index) => {
          return { key: attr.name, name: attr.name }
        })
        const data    = dataset.data

        this.setState({
          data: { columns: columns, rows: data }
        })

        this.props.onSelect(parameters)
      }
    })
  }

  render ( ) {
    const props  = this.props
    const state  = this.state
    const data   = state.data

    return (
      <div className={classNames("panel panel-default", props.classNames.root)}>
        <div className="panel-body">
          <div className="form-group">
            <Select
                options={props.options}
                   name="output"
                  value={state.output}
               onChange={this.onChange}
              clearable={false}/>
          </div>
          <div>
            <ReactDataGrid
                  columns={data.columns}
                rowGetter={(index) => {
                  return data.rows[index]
                }}
                rowsCount={data.rows.length}/>
          </div>
        </div>
      </div>
    )
  }
}

FileViewer.propTypes     = 
{
  classNames: PropTypes.object
}
FileViewer.defaultProps  =
{
  classNames: { }
}

FileViewer.defaultStates =
{
  output: { },
    data: { columns: [ ], rows: [ ] }
}

const mapStateToProps   = (state) => {
  const data            = state.data
  const files           = getFiles(data.resource, FileFormat.CDATA)

  const options         = files.map((file) => {
    return {
      value: `{"path": "${file.path}", "name": "${file.name}", "format": "${file.format}"}`,
      label: file.name
    }
  })

  return {
    options: options
  }
}

export default connect(mapStateToProps)(FileViewer)
