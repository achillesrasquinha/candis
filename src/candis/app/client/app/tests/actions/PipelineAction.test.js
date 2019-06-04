import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import config from '../../config'
import pipeline from '../../action/PipelineAction'
import ActionType from '../../constant/ActionType'
import dokuments, {newDoc} from '../fixtures/documents'

const {name} = newDoc.output  // take out name of the pipeline to be deleted from an active dokument.
const createMockStore = configureMockStore([thunk])
const mock = new MockAdapter(axios)

 test('should setup pipeline.delete action object ', (done) => {
    const data = { data: 'true' }  // dummy data object for DELETE_SUCCESS action.
    mock.onPost(config.routes.API.data.delete, { name }).reply(200, data)
    const store = createMockStore({})
    store.dispatch(pipeline.delete(name)).then(() => {
        
        const actions = store.getActions()
        expect(actions[0]).toEqual({
            type: ActionType.Asynchronous.DELETE_SUCCESS,
            payload: {
                ...data,
                name
            }
        })
        expect(actions[1]).toEqual({
            type: ActionType.Pipeline.DELETE_PIPELINE
        })
        done()
    })
    
 })

 test('should catch error while trying to delete pipeline using axios', (done) => {
    const code = 404  // should be greater than or equal to 400
    const error = new Error(`Request failed with status code ${code}`)  
    
    mock.onPost(config.routes.API.data.delete, { name }).reply(code, error)
    const store = createMockStore({})
    store.dispatch(pipeline.delete(name)).then(() => {
        
        const actions = store.getActions()
        expect(actions[0]).toEqual({
            type: ActionType.Asynchronous.DELETE_ERROR,
            payload: {
                name,
                error
            }
        })
        done()

    })
 })

 test('should setup pipeline.run action object', (done) => {
    const data = { data: true }  // dummy data which is returned by successful axios call.
    dokuments.active = {...dokuments.active, 'split_percent': 70}
    mock.onPost(config.routes.API.pipeline.run, dokuments.active).reply(200, data)
    const store = createMockStore({})
    
    store.dispatch(pipeline.run(dokuments.active)).then(() => {

        const actions = store.getActions()
        expect(actions[0]).toEqual({
            type: ActionType.Pipeline.RUN_REQUEST,
			payload: dokuments.active
        })
        expect(actions[1]).toEqual({
            type: ActionType.Pipeline.RUN_SUCCESS,
			payload: {
                output: dokuments.active,
                ...data
            }
        })
        done()
    })
 })

 test('should catch error while trying to run the pipeline', (done) => {
    const store = createMockStore({})
    const code = 404  // should be greater than or equal to 400
    const error = new Error(`Request failed with status code ${code}`)  // dummy error

    mock.onPost(config.routes.API.pipeline.run, dokuments.active).reply(code, error)
    store.dispatch(pipeline.run(dokuments.active)).then(() => {
        const actions = store.getActions()
        expect(actions[0]).toEqual({
            type: ActionType.Pipeline.RUN_REQUEST,
			payload: dokuments.active
        })
        expect(actions[1]).toEqual({
            type: ActionType.Pipeline.RUN_ERROR,
            payload: {
                output: dokuments.active,
                error: undefined  // In PipelineAction, instead of "error", "response" is destructured
            }
        })
    })
    done()
 })
