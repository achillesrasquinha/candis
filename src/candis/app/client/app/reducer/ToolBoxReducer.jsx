import ActionType   from '../constant/ActionType'

const initialState = { tools: [ ] }

const toolBox      = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.INSERT_TOOL: {
      const tool   = action.payload
      let   tools  =  state.tools.slice()

      tools.push(tool)

      return {...state, tools: tools}
    }

    case ActionType.ON_HOVER_TOOL: {
      const tool   = action.payload

      return {...state, active: tool}
    }
  }

  return state
}

export default toolBox
