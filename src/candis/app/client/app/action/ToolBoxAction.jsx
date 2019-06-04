import ActionType from '../constant/ActionType'

const insertTool  = (tool) => {
  const action    = {
       type: ActionType.INSERT_TOOL,
    payload: tool
  }

  return action
}

const onHoverTool = (tool) => {
  const action    = {
       type: ActionType.ON_HOVER_TOOL,
    payload: tool
  }

  return action
}

export { insertTool, onHoverTool }
