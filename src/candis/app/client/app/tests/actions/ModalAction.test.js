import ActionType from '../../constant/ActionType'
import modal from '../../action/ModalAction'
import dialog from '../fixtures/modal'

test('should setup show action object', () => {
    const action = modal.show(dialog)
    expect(action).toEqual({
        type: ActionType.Modal.SHOW,
        payload: dialog
    })
})

test('should setup hide action object', () => {
    const action = modal.hide()
    expect(action).toEqual({
        type: ActionType.Modal.HIDE
    })
})

