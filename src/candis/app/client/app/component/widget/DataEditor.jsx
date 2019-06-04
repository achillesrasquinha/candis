import React          from 'react'
import { connect }    from 'react-redux'
import ReactDataGrid  from 'react-data-grid'

import config         from '../../config'

import ToolBar        from './ToolBar'

import { row, column } from '../../action/DataEditorAction'
import { getResource } from '../../action/AsynchronousAction'
import { getFiles }    from '../../util'

class DataEditor extends React.Component {
  constructor (props) {
    super (props)

    this.tools =
    [
      {
           icon: `${config.routes.icons}/insert-row.png`,
        tooltip: 'Insert Row',
        onClick: (props) => {
          const meta     = { }
          const position = props.rows.length

          props.columns.forEach((column) => { meta[column.key] = "" })

          const action = row.insert(position, meta)

          props.dispatch(action)
        }
      },
      {
           icon: `${config.routes.icons}/insert-column.png`,
        tooltip: 'Insert Column',
        onClick: (props) => {
          bootbox.prompt({
                title: '<span class="font-bold">Column Name</span>',
            inputType: 'text',
              buttons:
              {
                cancel:  { label: "Cancel", className: "btn-sm btn-primary" },
                confirm: { label: "Create", className: "btn-sm btn-success" }
              },
                size: "small",
              animate: false,
            callback: (name) => {
              const meta     = { key: name, name: name, editable: true }
              const position = props.columns.length - 1
              const action   = column.insert(position, meta)
              
              props.dispatch(action)
            }
          })
          
        }
      },
      {
           icon: `${config.routes.icons}/delete-row.png`,
        tooltip: 'Delete Row',
        onClick: (props) => {
          props.rows.forEach((meta, index) => {
            if ( meta.selected ) {
              const action = row.delete(index, meta)

              props.dispatch(action)
            }
          })
        }
      },
      {
           icon: `${config.routes.icons}/delete-column.png`,
        tooltip: 'Delete Column',
        onClick: (props)  => {
          const options   = props.columns.map(({ key, name }) => {
            return { text: name, value: key }
          })

          bootbox.prompt({
                   title: '<span class="font-bold">Column Name</span>',
               inputType: 'select',
            inputOptions: options,
                 buttons:
                  {
                    cancel:  { label: "Cancel", className: "btn-sm btn-primary" },
                    confirm: { label: "Delete", className: "btn-sm btn-danger" }
                  },
                    size: "small",
                animate: false,
                callback: (key) => {
                  if ( key  !== null ) {
                    const action = column.delete(key)

                    props.dispatch(action)
                  }
                }
          })
        }
      },
      {
           icon: `${config.routes.icons}/reload.png`,
        tooltip: 'Refresh',
        onClick: (props) => {
          const action = getResource()

          props.dispatch(action)
        }
      },
      {
            icon: `${config.routes.icons}/load-rows.png`,
        tooltip: 'Load All',
        onClick: (props) => {
          toastr.warning('To be implemented.')
        }
      }
    ]
  }

  render ( ) {
    const props  = this.props

    return (
      <div>
        <div className="panel panel-default no-background no-border no-shadow">
          <div className="panel-body">
            <div className="text-right">
              <ToolBar tools={this.tools} onClick={(tool) => {
                tool.onClick(props)
              }}/>
            </div>
          </div>
        </div>
        <div>
          <ReactDataGrid
             enableCellSelect={true}
                      columns={props.columns}
                    rowGetter={(index) => { return props.rows[index] }}
                    rowsCount={props.rows.length}
                 rowSelection={{
                        showCheckbox: true,
                   enableShiftSelect: true,
                      onRowsSelected: (rows) => {
                        rows.forEach((meta)  => {
                          const action = row.select(meta.rowIdx, meta.row)

                          props.dispatch(action)
                        })
                      },
                    onRowsDeselected: (rows) => {
                      rows.forEach((meta)  => {
                        const action = row.deselect(meta.rowIdx, meta.row)

                        props.dispatch(action)
                      })
                    },
                            selectBy: { isSelectedKey: 'selected' }
                 }}
            onGridRowsUpdated={({ fromRow, toRow, updated }) => {
              const action = row.update(fromRow, toRow, updated)

              props.dispatch(action)

              props.onChange({ columns: props.columns, rows: props.rows })
            }}/>
          </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const dataEditor    = state.dataEditor

  return {
       rows: dataEditor.rows,
    columns: dataEditor.columns
  }
}

export default connect(mapStateToProps)(DataEditor)
