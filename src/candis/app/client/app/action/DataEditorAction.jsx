import ActionType from '../constant/ActionType'

const row        = 
{
  insert: (position, row) =>
  {
    const action = 
    {
          type: ActionType.DataEditor.INSERT_ROW,
      payload: { position: position, row: row }
    }

    return action
  },
  select: (index, row) =>
  {
    const action =
    {
         type: ActionType.DataEditor.SELECT_ROW,
      payload: { index: index, row: row }
    }

    return action
  },
  deselect: (index, row) =>
  {
    const action =
    {
         type: ActionType.DataEditor.DESELECT_ROW,
      payload: { index: index, row: row }
    }

    return action
  },
  delete: (index, row) =>
  {
    const action =
    {
         type: ActionType.DataEditor.DELETE_ROW,
      payload: { index: index, row: row }
    }

    return action
  },
  update: (from, to, update) =>
  {
    const action =
    {
         type: ActionType.DataEditor.UPDATE_ROW,
      payload: { from: from, to: to, update: update }
    }

    return action
  }
}
const column    = 
{
  insert: (position, column) =>
  {
    const action     = {
          type: ActionType.DataEditor.INSERT_COLUMN,
      payload: { position: position, column: column }
    }

    return action
  },
  delete: (key) =>
  {
    const action =
    {
         type: ActionType.DataEditor.DELETE_COLUMN,
      payload: key
    }

    return action
  }
}

export { row, column }
