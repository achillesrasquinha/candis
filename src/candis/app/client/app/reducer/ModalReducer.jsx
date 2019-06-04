import ActionType from '../constant/ActionType'

const initial        = { display: false, modal: { } }
const modal          = (state = initial, action) => {
  switch (action.type) {
    case ActionType.Modal.SHOW:
      return {...state, modal: action.payload, display: true }

    case ActionType.Modal.HIDE:
      return initial
  }

  return state
}

export default modal