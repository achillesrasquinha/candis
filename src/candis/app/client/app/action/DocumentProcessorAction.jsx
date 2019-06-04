import axios      from 'axios'
import shortid    from 'shortid'

import ActionType from '../constant/ActionType'
import Pipeline   from '../constant/Pipeline'
import store      from '../Store'

import { write }  from './AsynchronousAction'

const setActiveDocument = (dokument) => {
  const action          = {
       type: ActionType.DocumentProcessor.SET_ACTIVE_DOCUMENT,
    payload: dokument
  }

  return action
}

const stage = 
{
  set: (stage) =>
  {
    const dispatch = (dispatch) =>
    {
      const dokument      = store.getState().documentProcessor.active

      if ( dokument !== null ) 
      {
        var buffer        = dokument.data.map((node) => {
          const step      = 
          {
                ID: node.ID,
              code: node.code,
              name: node.name,
             value: node.value,
             label: node.label,
            status: node.status
          }

          return step
        })

        buffer.push({
              ID: stage.ID     || shortid.generate(),
            code: stage.code,
            name: stage.name,
           label: stage.label,
           value: stage.value,
          status: stage.status || Pipeline.Status.PENDING
        })

        var action        = 
        {
             type: ActionType.DocumentProcessor.SET_STAGE,
          payload: stage
        }

        dispatch(action)

        action            = write(dokument.output, buffer)

        dispatch(action)
      }
    }

    return dispatch
  },
  update: (ID, update) => 
  {
    const dispatch = (dispatch) =>
    {
      const dokument      = store.getState().documentProcessor.active

      if ( dokument !== null ) 
      {
        var copy          = null
        var buffer        = dokument.data.map((node) => {
          var   step      = 
          {
                ID: node.ID,
              code: node.code,
              name: node.name,
             value: node.value,
             label: node.label,
            status: node.status
          }

          if ( node.ID == ID )
          {
            step = {...step, ...update}
            copy = {...node, ...update}
          }

          return step
        })

        var action        = 
        {
             type: ActionType.DocumentProcessor.SET_STAGE,
          payload: copy
        }

        dispatch(action)

        action            = write(dokument.output, buffer)

        dispatch(action)
      }
    }

    return dispatch
  },
  delete: (ID) => {
    const dispatch = (dispatch) => {
      const dokument = store.getState().documentProcessor.active
      
      var action = {
        payload: {
          ID: ID,
          data: dokument.data
        },
        type: ActionType.Pipeline.REMOVE_STAGE
      }
      dispatch(action)

      if( dokument !== null ){
        var buffer = dokument.data.filter((node) => {
          if( node.ID == ID ){
            return false
          }
          return true
        })
        action = write(dokument.output, buffer)
        dispatch(action)
      }
    }
    return dispatch
  }
}
export { setActiveDocument, stage }
