import ActionType from '../constant/ActionType'

const initial = 
{
	resource: null
}
const data    = (state = initial, action) => {
	switch (action.type) {
    case ActionType.Asynchronous.WRITE_REQUEST:
    case ActionType.Asynchronous.GET_RESOURCE_REQUEST:
    	nprogress.set(0.0)

    	break
	
	case ActionType.Asynchronous.DELETE_SUCCESS:
	case ActionType.Asynchronous.DELETE_ERROR:
    case ActionType.Asynchronous.WRITE_SUCCESS:
    case ActionType.Asynchronous.WRITE_ERROR:
    	nprogress.set(1.0)

    	break

    case ActionType.Asynchronous.GET_RESOURCE_SUCCESS:
    	nprogress.set(1.0)

		return { ...state, resource: action.payload.data }

	}

	return state
}     

export default data
