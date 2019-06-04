import ActionType from '../../constant/ActionType'
import ModalReducer from '../../reducer/ModalReducer'
import modal from '../fixtures/modal'

const initial = {
    display: false,
    modal: { }
}

test('should setup initial state of ModalReucer', () => {
    const state = ModalReducer(
        undefined,
        {
            type: '@@INIT'
    })
    expect(state).toEqual({
        ...initial
    })
})

test('should SHOW modal', () => {
    const state = ModalReducer(
        undefined,
        {
            type: ActionType.Modal.SHOW,
            payload: {
                ...modal
            }
    })
    expect(state).toEqual({
        
        modal,
        display: true
    })
})

test('should HIDE modal', () => {
    const state = ModalReducer(
        { modal, display: true },
        {
            type: ActionType.Modal.HIDE
    })
    expect(state).toEqual({
        ...initial
    })
})
