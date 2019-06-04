import ActionType from '../../constant/ActionType'
import dataReducer from '../../reducer/DataReducer'

const initial = {
    resource: null
}

const dummyState = {
    resource: 'abc'
}

const ActionTypeList = {
    setZero: [
        ActionType.Asynchronous.WRITE_REQUEST,
        ActionType.Asynchronous.GET_RESOURCE_REQUEST
    ],
    setOne: [
        ActionType.Asynchronous.DELETE_SUCCESS,
        ActionType.Asynchronous.DELETE_ERROR,
        ActionType.Asynchronous.WRITE_SUCCESS,
        ActionType.Asynchronous.WRITE_ERROR
    ]
}

test("should setup dataReducer with default values", () => {
    const state = dataReducer(undefined, {type: '@@INIT'})
    expect(state).toEqual({
        ...initial
    })
})

test("should set state to provided value and set nprogress to 0.0", () => {
    ActionTypeList.setZero.forEach(ActionTypeItem => {
        const state = dataReducer(
            dummyState, 
                {
                    payload: null,
                    type: ActionTypeItem
            }
        )

        expect(state).toEqual({
            ...dummyState
        })
        expect(nprogress.set).toHaveBeenCalledWith(0.0)
    })
})

test("should set state to provided value and set nprogress to 1.0", () => {
    ActionTypeList.setOne.forEach(ActionTypeItem => {
        const state = dataReducer(
            dummyState, 
                {
                    payload: null,
                    type: ActionTypeItem
            }
        )

        expect(state).toEqual({
            ...dummyState
        })
        expect(nprogress.set).toHaveBeenCalledWith(1.0)
    })
})

test("should modify resource value by action.payload.data", () => {
    const state = dataReducer(undefined, {
            type: ActionType.Asynchronous.GET_RESOURCE_SUCCESS,
            payload: {
                data: 'ABC'
            } 
        })
    expect(state).toEqual({
        ...initial,
        resource: 'ABC'
    })
    expect(nprogress.set).toHaveBeenCalledWith(1.0)
})