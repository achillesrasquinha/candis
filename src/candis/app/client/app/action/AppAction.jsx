import axios from 'axios'
import storage      from 'store'
import jwt from 'jsonwebtoken'


import ActionType   from '../constant/ActionType'
import setAuthorizationToken from '../util/auth'
import config     from '../config'

const setUser      = (user) =>
{
	const action     = 
	{
		   type: ActionType.App.SET_USER,
		payload: user
	}

	return action
}

const signin = (payload) => {
  const dispatcher = (dispatch) => {
	
	storage.set('JWT_TOKEN', payload.token)	
	storage.set('ACTIVE_USER', payload.user)
	
	setAuthorizationToken(payload.token)
	
	const action = setUser(jwt.decode(payload.token))
	dispatch(action)
  }
  return dispatcher
}

const signout      = ( ) =>
{
	const dispatcher = (dispatch) =>
	{	
		axios.post(config.routes.API.user.sign_out).then(({data}) => {
			toastr.success("Logged out Successfully")
			
			storage.remove('JWT_TOKEN')
			storage.remove('ACTIVE_USER')

			const action = {
				type: ActionType.Root.RESET_STATE
			}
			dispatch(action)
		}).catch(({response}) => {
			toastr.error(response.data.error.errors[0].message)
		})
	}

	return dispatcher
}

export { signin, signout, setUser }