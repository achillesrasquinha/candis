import axios      from 'axios'

import config     from '../config'
import ActionType from '../constant/ActionType'

const entrez = {

    search: (values) => {
        const dispatch = (dispatch) => {
			const action = entrez.searchRequest(values)
			dispatch(action)

            return axios.post(config.routes.API.data.search, values).then(({data}) => {
                data = data.data
                
                let action = {
                    type: ActionType.Entrez.SEARCH,
                    payload: {
                        data,
                        values
                    }
                }
                dispatch(action)
                
                action = entrez.successSearch(data)
                dispatch(action)
            }).catch(({response}) => {
                const error = response.data.error
                const action = entrez.errorSearch(error)
                dispatch(action)
            })
        }
        return dispatch
    },

    download: (payload) => {
        const dispatch = (dispatch) => {
			const action = entrez.downloadRequest(payload)
			dispatch(action)
            
            return axios.post(config.routes.API.data.download, payload).then((data) => {
                data = data.data
                let action = {
                    type: ActionType.Entrez.DOWNLOAD,
                    payload: data
                }
                dispatch(action)
                
                action = entrez.successDownload(data)
                dispatch(action)
            }).catch(({response}) => {
                const error = response.data.error
                const action = entrez.errorDownload(error)
                dispatch(action)
            })
        }
        return dispatch
    },

	searchRequest: (output) => {
		const action = {
			   type: ActionType.Entrez.SEARCH_REQUEST,
			payload: output
		}
		return action
	},    
    
    successSearch: (payload) => {
        const action = {
            type: ActionType.Entrez.SEARCH_SUCCESS,
            payload
        }
        return action
    },

    errorSearch: (payload) => {
        const action = {
            type: ActionType.Entrez.SEARCH_ERROR,
            payload
        }
        return action
    },

	downloadRequest: (output) => {
		const action = {
			   type: ActionType.Entrez.DOWNLOAD_REQUEST,
			payload: output
		}
		return action
	},

    successDownload: (payload) => {
        const action = {
            type: ActionType.Entrez.DOWNLOAD_SUCCESS,
            payload
        }
        return action
    },
    
    errorDownload: (payload) => {
        const action = {
            type: ActionType.Entrez.DOWNLOAD_ERROR,
            payload
        }
        return action
    }
}

export default entrez
