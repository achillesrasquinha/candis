import ActionType   from '../../constant/ActionType'
import toolBoxReducer from '../../reducer/ToolBoxReducer'
import toolBox from '../fixtures/toolbox'

const initial = {
    tools: [ ]
}

test('should setup ToolBoXReducer with initial state', () => {
    const state = toolBoxReducer(
        undefined,
        {
            type: '@@INIT'
    })
    expect(state).toEqual({
        ...initial
    })
})

test('should insert tool', () => {
    const state = toolBoxReducer(
        undefined,
        {
            type: ActionType.INSERT_TOOL,
            payload: toolBox.tools[0]
    })
    expect(state).toEqual({
        ...initial,
        tools: [toolBox.tools[0]]
    })
})

test('should insert tool', () => {
    const state = toolBoxReducer(
        undefined,
        {
            type: ActionType.ON_HOVER_TOOL,
            payload: toolBox.tools[0]
    })
    expect(state).toEqual({
        ...initial,
        active: toolBox.tools[0]
    })
})