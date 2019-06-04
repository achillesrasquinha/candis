import axios      from 'axios'

import config     from '../config'
import ActionType from '../constant/ActionType'
import store      from '../Store'

const pipeline     =
{
	run: (output) =>
	{
		const dispatch = (dispatch) =>
		{
			output = {...output, 'split_percent': store.getState().defaults.trainPercent}
			const action = pipeline.runRequest(output)
			dispatch(action)

			return axios.post(config.routes.API.pipeline.run, output).then(({ data }) => {
				data         = data.data
				const action = pipeline.runSuccess(output, data)

				dispatch(action)
			})
			.catch(({ response }) => {
				const error  = response.data.error
				const action = pipeline.runError(output, error)

				dispatch(action)
			})
		}

		return dispatch
	},
	runRequest: (output) =>
	{
		const action =
		{
			   type: ActionType.Pipeline.RUN_REQUEST,
			payload: output
		}

		return action
	},
	runSuccess: (output, data) =>
	{
		const payload = { output: output, data: data }
		const action  =
		{
			   type: ActionType.Pipeline.RUN_SUCCESS,
			payload: payload
		}

		return action
	},
	runError: (output, error) =>
	{
		const payload = { output: output, error: error }
		const action =
		{
			   type: ActionType.Pipeline.RUN_ERROR,
			payload: payload
		}

		return action
	},
	delete: (activePipe) => {
		const dispatch = (dispatch) => {
			return axios.post(config.routes.API.data.delete, { name: activePipe }).then(({data}) => {
				data         = data.data
				dispatch({
					type: ActionType.Asynchronous.DELETE_SUCCESS,
					payload: { name: activePipe, data }
				})
				const action = {
					type: ActionType.Pipeline.DELETE_PIPELINE,
				}
				dispatch(action)
			}).catch((error) => {
				dispatch({
					type: ActionType.Asynchronous.DELETE_ERROR,
					payload: { name: activePipe, error }
				})
			})
		}
		return dispatch
	}
}

export default pipeline
