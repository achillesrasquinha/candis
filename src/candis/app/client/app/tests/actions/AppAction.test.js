// import configureMockStore from 'redux-mock-store'

import ActionType   from '../../constant/ActionType'
import { signin, signout, setUser } from '../../action/AppAction'

test('should setup setUser action object', () => {
    const action = setUser({id: '1'})
    expect(action).toEqual({
        type:  ActionType.App.SET_USER,
        payload: {id: '1'}
    })
})

test('should setup signin action object', () => {
    // To be Implemented - After database integrartion
})

test('should setup signout action object', () => {
    // To be Implemented - After database integrartion
})