import ActionType from '../../constant/ActionType'
import { row as row_, column as column_ } from '../../action/DataEditorAction'

const position = 1
const row = 1
const index = 1
const column = 1
const key = 'CEL'
const from = 1
const to = 2
const update = ['Normal', 'Male']

test('should setup row.insert action object', () => {
    const action = row_.insert(position, row)
    expect(action).toEqual({
        type: ActionType.DataEditor.INSERT_ROW,
        payload: { position, row }
    })
})

test('should setup row.select action object', () => {
    const action = row_.select(index, row)
    expect(action).toEqual({
        type: ActionType.DataEditor.SELECT_ROW,
        payload: { index, row }
    })
})

test('should setup row.update action object', () => {
    const action = row_.update( from, to, update )
    expect(action).toEqual({
        type: ActionType.DataEditor.UPDATE_ROW,
        payload: { from, to, update }
    })
})

test('should setup row.deselect action object', () => {
    const action = row_.deselect(index, row)
    expect(action).toEqual({
        type: ActionType.DataEditor.DESELECT_ROW,
        payload: { index, row }
    })
})

test('should setup row.delete action object', () => {
    const action = row_.delete(index, row)
    expect(action).toEqual({
        type: ActionType.DataEditor.DELETE_ROW,
        payload: { index, row }
    })
})

test('should setup column.delete action object', () => {
    const action = column_.insert(position, column)
    expect(action).toEqual({
        type: ActionType.DataEditor.INSERT_COLUMN,
        payload: {position, column}
    })
})

test('should setup column.delete action object', () => {
    const action = column_.delete(key)
    expect(action).toEqual({
        type: ActionType.DataEditor.DELETE_COLUMN,
        payload: key
    })
})
