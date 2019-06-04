import AppReducer from '../../reducer/AppReducer'
import ActionType from '../../constant/ActionType'

const initial = {
    user: null
}

const dummyApp = {
    user: 'rupav'
}

const ActionTypeList = {
    setZero: [
        ActionType.App.SIGNIN_REQUEST,
        ActionType.App.SIGNOUT_REQUEST
    ],
    setOne: [
        ActionType.App.SIGNIN_SUCCESS,
        ActionType.App.SIGNIN_ERROR,
        ActionType.App.SIGNOUT_SUCCESS,
        ActionType.App.SIGNOUT_ERROR,
        ActionType.Asynchronous.WRITE_SUCCESS,
        ActionType.Asynchronous.WRITE_ERROR,
        ActionType.Asynchronous.GET_RESOURCE_SUCCESS,
        ActionType.Asynchronous.GET_RESOURCE_ERROR
    ]
}

test('should setup AppReducer with default state', () => {
    const state = AppReducer(
        undefined,
            {
                type: '@@INIT'
        }
    )
    expect(state).toEqual({
        ...initial
    })
})

test('should return provided state and set nprogress to 0.0', () => {
    ActionTypeList.setZero.forEach(ActionTypeItem => {
        const state = AppReducer(
            dummyApp,
                {
                    payload: null,
                    type: ActionTypeItem
            }
        )
        expect(state).toEqual({
            ...dummyApp
        })
        expect(nprogress.set).toHaveBeenCalledWith(0.0)
    })
})

test('should return provided state and set nprogress to 1.0', () => {
    ActionTypeList.setOne.forEach(ActionTypeItem => {
        const state = AppReducer(
            dummyApp,
                {
                    payload: null,
                    type: ActionTypeItem
            }
        )
        expect(state).toEqual({
            ...dummyApp
        })
        expect(nprogress.set).toHaveBeenCalledWith(1.0)
    })
})

test('should modify the provided state', () => {
    const fakeUser = 'RJ'
    const state = AppReducer(
        undefined,
            {
            payload: fakeUser,
            type: ActionType.App.SET_USER
        }
    )
    expect(state).toEqual({
        ...initial,
        user: fakeUser
    })
})