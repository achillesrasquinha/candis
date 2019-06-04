import ActionType from '../constant/ActionType'

const modal = 
{
  show: (modal) => 
  {
    const action = 
    {
         type: ActionType.Modal.SHOW,
      payload: modal
    }

    return action
  },
  hide: ( ) =>
  {
    const action =
    {
      type: ActionType.Modal.HIDE
    }

    return action
  }
}

export default modal
