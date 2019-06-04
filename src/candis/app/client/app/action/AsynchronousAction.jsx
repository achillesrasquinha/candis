import axios      from 'axios'

import config     from '../config'
import modal        from './ModalAction'
import ActionType from '../constant/ActionType'
import Component    from '../constant/Component'
import Pipeline     from '../constant/Pipeline'
import { stage }    from './DocumentProcessorAction'
import nodes from '../meta/nodes'
import FileFormat from '../constant/FileFormat'

const write              = (output, buffer = null) => {
  const dispatch         = (dispatch) => {
    const action         = requestWrite(output, buffer)
    const parameters     = { output: output, buffer: buffer }

    dispatch(action)

    axios.post(config.routes.API.data.write, parameters).then(({ data }) => {
      data               = data.data
      const action       = successWrite(output, buffer, data)

      dispatch(action)
    }).catch(({response}) => {
      const error        = response.data.error
      const action       = errorWrite(output, buffer, error)

      dispatch(action)
    })
  }

  return dispatch
}

const requestWrite       = (output, buffer) => {
  const file             = { output: output, buffer: buffer }
  const action           = {
       type: ActionType.Asynchronous.WRITE_REQUEST,
    payload: file
  }

  return action
}

const successWrite       = (output, buffer, data) => {
  const file             = { output: output, buffer: buffer }
  const payload          = { file: file, data: data }

  const action           = {
       type: ActionType.Asynchronous.WRITE_SUCCESS,
    payload: payload
  }

  return action
}

const errorWrite         = (output, buffer, error) => {
  const file             = { output: output, buffer: buffer }
  const payload          = { file: file, error: error }

  const action           = {
       type: ActionType.Asynchronous.WRITE_ERROR,
    payload: payload
  }

  return action
}

const getResource        = (path = null) => {
  const dispatch         = (dispatch) => {
    const action         = getResourceRequest(path)
    const parameters     = { path: path }

    dispatch(action)

    return axios.post(config.routes.API.data.resource, parameters).then(({ data }) => {
      data               = data.data
      const action       = getResourceSuccess(path, data)

      dispatch(action)

      return data
    }).catch(({ response }) => {
      const error        = response.data.error
      const action       = getResourceError(path, error)

      dispatch(action)
    })
  }

  return dispatch
}

const getResourceRequest = (path) => {
  const payload          = { path: path }
  const action           = {
       type: ActionType.Asynchronous.GET_RESOURCE_REQUEST,
    payload: payload
  }

  return action
}

const getResourceSuccess = (path, data) => {
  const payload          = { path: path, data: data }
  const action           = {
       type: ActionType.Asynchronous.GET_RESOURCE_SUCCESS,
    payload: payload
  }

  return action
}

const getResourceError   = (path, error) => {
  const payload          = { path: path, error: error }
  const action           = {
       type: ActionType.Asynchronous.GET_RESOURCE_ERROR,
    payload: payload
  }

  return action
}

const read               = (output) => {
  const dispatch         = (dispatch) => {
    const action         = requestRead(output)

    dispatch(action)

    return axios.post(config.routes.API.data.read, output).then(({ data }) => {
      data               = data.data
      
      if ( output.format === FileFormat.PIPELINE ) {
        updateNodeProperties(data).then((data) => {

          const action       = successRead(output, data)
    
          dispatch(action)
    
          data = data
        })
      }

      return data
    }).catch(({response}) => {
      const error        = response.data.error
      const action       = errorRead(output, error)

      dispatch(action)
    })
  }

  return dispatch
}

const updateNodeProperties = (output) => {
  
  return axios.get(config.routes.API.preprocess.methods).then(({ data }) => {
    const response = data
    
    if(response.status == "success"){
      const data = response.data
      output = output.map(node => {
        let nodeUpdate = undefined

        if(nodes[node.code]){
          nodeUpdate = {
            ...nodes[node.code](node.ID)
          }
        } else {
          data.forEach((method) => {
            if (method.code == node.code) {

              const ID = node.ID

              const options = method.methods.map((option) =>
              {
                return { label: option.name, value: JSON.stringify(option) }
              })

              const onClick = (dispatch) => {
    
                var   option = null
                const dialog =
                {
                  component: Component.SelectViewer,
                      title: method.name,
                    buttons:
                    [
                      {
                            label: "Select",
                        className: "btn-primary",
                          onClick: ( ) =>
                          {
                                method = JSON.parse(option.value)
                            var update =
                            {
                              label: method.name,
                              value: method.value,
                              status: Pipeline.Status.READY
                            }
    
                            var action = stage.update(ID, update)
    
                            dispatch(action)
    
                            action     = modal.hide()
    
                            dispatch(action)
                          }
                      },
                      {
                            label: "Cancel",
                          onClick: ( ) =>
                          {
                            var action = modal.hide()
    
                            dispatch(action)
                          }
                      }
                    ],
                      props:
                      {
                        classNames: { root: ['no-background', 'no-border', 'no-shadow', 'no-margin'] },
                          options: options,
                          onChange: (changed) => { option = changed }
                      }
                }
                const action = modal.show(dialog)
    
                dispatch(action)              
              }

            const icon = method.icon
              
            nodeUpdate = {
                onClick: node.onClick || onClick,
                icon: node.icon || icon
              }
            }
          })
        }

        if (nodeUpdate) {
          return {
            ...node,
            ...nodeUpdate
          }
        } else {
          return node
        }
      })
      return output
    }
  })
}

const requestRead        = (output) => {
  const action           = {
       type: ActionType.Asynchronous.READ_REQUEST,
    payload: output
  }

  return action
}

const successRead        = (output, data) => {
  const payload          = { output: output, data: data }

  const action           = {
       type: ActionType.Asynchronous.READ_SUCCESS,
    payload: payload
  }

  return action
}

const errorRead          = (output, error) => {
  const payload          = { output: output, error: error }

  const action           = {
       type: ActionType.Asynchronous.READ_ERROR,
    payload: payload
  }

  return action
}

export { read, write, getResource }
