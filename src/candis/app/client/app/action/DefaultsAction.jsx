import ActionType from '../constant/ActionType'

const defaults = {
  update: (updates) => {
    const action = {
      type: ActionType.Defaults.UPDATE,
      payload: updates
    }
    
    return action
  },
  restore: () => {
    const action = {
      type: ActionType.Defaults.RESTORE
    }

    return action
  }
}

export default defaults
