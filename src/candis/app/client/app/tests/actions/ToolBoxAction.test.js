import ActionType from '../../constant/ActionType'
import { insertTool, onHoverTool } from '../../action/ToolBoxAction.jsx'

test('should setup insertTool action object', () => {
    const action = insertTool({name: 'Create', tooltip: 'Create a new DataSet'})
    expect(action).toEqual({
        type: ActionType.INSERT_TOOL,
        payload: {
            name: 'Create',
            tooltip: 'Create a new DataSet'
        }
    })
})

test('should setup onHoverTool action object', () => {
    const action = onHoverTool({name: 'Create', tooltip: 'Create a new DataSet'})
    expect(action).toEqual({
        type: ActionType.ON_HOVER_TOOL,
        payload: {
            name: 'Create',
            tooltip: 'Create a new DataSet'
        }
    })
})
