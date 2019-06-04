import ActionType from '../constant/ActionType'

const initial = {
    search_results: [],
    toolName: '',
    api_key: '',
    email: '',
    database: ''
}

const entrezReducer = (state = initial, action) => {
    switch(action.type){
        case ActionType.Entrez.SEARCH: {
            const { data, values } = action.payload
            const search_results = Object.values(data)
            return {...state, search_results, ...values}
        }
        
        case ActionType.DOWNLOAD: {
            return {...state, search_results: []}
        }

        case ActionType.Entrez.SEARCH_REQUEST:
        case ActionType.Entrez.DOWNLOAD_REQUEST:
            nprogress.set(0.0)
            break

        case ActionType.Entrez.DOWNLOAD_ERROR:
        case ActionType.Entrez.DOWNLOAD_SUCCESS:
        case ActionType.Entrez.SEARCH_ERROR:
        case ActionType.Entrez.SEARCH_SUCCESS:
            nprogress.set(1.0)
            break
    }
    return state
}

export default entrezReducer