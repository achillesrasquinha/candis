import { setActiveDocument, stage } from '../../action/DocumentProcessorAction'
import { newDoc } from '../fixtures/documents'
import ActionType from '../../constant/ActionType'

test('should set setActiveDocument action object', () => {
    const action = setActiveDocument(newDoc)
    expect(action).toEqual({
        type: ActionType.DocumentProcessor.SET_ACTIVE_DOCUMENT,
        payload: newDoc
    })
})
