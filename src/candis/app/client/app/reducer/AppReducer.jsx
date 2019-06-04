import ActionType from '../constant/ActionType'

const initial       = 
{
  user: null
}
const app           = (state = initial, action) => {
  switch (action.type) {
    case ActionType.App.SIGNIN_REQUEST:
    case ActionType.App.SIGNOUT_REQUEST:
      nprogress.set(0.0)

      break

    case ActionType.App.SIGNIN_SUCCESS:
    case ActionType.App.SIGNIN_ERROR:
    case ActionType.App.SIGNOUT_SUCCESS:
    case ActionType.App.SIGNOUT_ERROR:
    case ActionType.Asynchronous.WRITE_SUCCESS:
    case ActionType.Asynchronous.WRITE_ERROR:
    case ActionType.Asynchronous.GET_RESOURCE_SUCCESS:
    case ActionType.Asynchronous.GET_RESOURCE_ERROR:
      nprogress.set(1.0)

      break

    case ActionType.App.SET_USER:
      return { ...state, user: action.payload }
      
  }

  return state
}

export default app
