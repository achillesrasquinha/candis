import React         from 'react'
import PropTypes     from 'prop-types'
import classNames    from 'classnames'

import DataEditor    from '../widget/DataEditor'
import XEditable     from '../widget/XEditable'

class FileEditor extends React.Component {
  constructor (props) {
    super (props)

    this.state        = FileEditor.defaultStates
  }

  render ( ) {
    const props = this.props

    return (
      <div className={classNames("panel panel-default", props.classNames.root)}>
        <div className="panel-body">
          <div className="form-group">
            <label>Name</label>
            <div>
              <XEditable
                   value={this.state.name}
                   empty="Untitled"
                onChange={(value) => {
                  this.setState({ name: value })

                  props.onChange.name(value)
                }}/>
            </div>
          </div>
          <DataEditor
            onChange={(data) => 
            {
              const attributes = data.columns.map((column) => {
                return { name: column.name, type: column.type }
              })
              const rows       = data.rows.map((row) => {
                var meta       = { }
                
                data.columns.forEach((column) => {
                  meta[column.name] = row[column.name]
                })

                return meta
              })

              props.onChange.data({ attributes: attributes, data: rows })
            }}/>
        </div>
      </div>
    )
  }
}

FileEditor.propTypes     =
{
  classNames: PropTypes.object
}
FileEditor.defaultProps  =
{
  classNames: { }
}

FileEditor.defaultStates =
{
  name: ""
}

export default FileEditor
