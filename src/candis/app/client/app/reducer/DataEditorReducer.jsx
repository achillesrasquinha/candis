import React         from 'react'
import { Editors }   from 'react-data-grid-addons'

import shortid       from 'shortid'

import ActionType    from '../constant/ActionType'
import AttributeType from '../constant/AttributeType'
import FileFormat    from '../constant/FileFormat'

import { getFiles }  from '../util'

const initial      = 
{
     rows: [ ],
  columns: [
    {
          key: 'File',
         name: 'File',
         type: AttributeType.FILE,
      allowed: [FileFormat.CEL]
    },
    {
           key: 'Label',
          name: 'Label',
          type: AttributeType.CLASS,
      editable: true
    }
  ]
}

const dataEditor   = (state = initial, action) => {
  switch (action.type) {
    case ActionType.DataEditor.INSERT_ROW: 
    {
      const payload  = action.payload
      var   rows     = state.rows.slice()

      // rows.slice(payload.position, 0, payload.row)
      rows.push(payload.row)

      return {...state, rows: rows }
    }

    case ActionType.DataEditor.INSERT_COLUMN: 
    {
      const payload  = action.payload
      var   cols     =  state.columns.slice()

      // cols.slice(payload.position, 0, payload.column)
      cols.push(payload.column)

      return {...state, columns: cols }
    }

    case ActionType.DataEditor.SELECT_ROW: 
    {
      const payload = action.payload
      var   rows    =  state.rows.slice()

      rows[payload.index].selected = true

      return {...state, rows: rows }
    }

    case ActionType.DataEditor.DESELECT_ROW: 
    {
      const payload = action.payload
      var   rows    =  state.rows.slice()

      rows[payload.index].selected = false

      return {...state, rows: rows }
    }

    case ActionType.DataEditor.DELETE_ROW: 
    {
      const payload =  action.payload
      var   rows    =   state.rows.slice()
      var   index   = payload.index

      rows.splice(index, 1)

      return {...state, rows: rows }
    }

    case ActionType.DataEditor.DELETE_COLUMN:
    {
      const key      = action.payload
      const columns  = state.columns.filter((column) => {
        return column.key !== key
      })
      const rows     = state.columns.filter((row) => {
        return    row.key !== key
      })

      return {...state, rows: rows, columns: columns }
    }

    case ActionType.DataEditor.UPDATE_ROW: {
      var { from, to, update } = action.payload
      var rows                 =  state.rows.slice()

      for (var i = from ; i <= to ; ++i)
        rows[i]  = {...rows[i], ...update }

      return {...state, rows: rows }
    }

    case ActionType.Asynchronous.GET_RESOURCE_SUCCESS: {
      const resource = action.payload.data
      const columns  =  state.columns.filter((column) => {
        if ( column.type == AttributeType.FILE ) 
        {
          const files    = getFiles(resource, column.allowed)
          const options  = files.map((file, index) => 
          {
            const option = { id: shortid.generate(), value: file.name,
              title: shortid.generate(), text: file.name }

            return option
          })

          column.editor  = <Editors.DropDownEditor options={options}/>
        }

        return column
      })

      return {...state, columns: columns }
    }
  }

  return state
}

export default dataEditor
