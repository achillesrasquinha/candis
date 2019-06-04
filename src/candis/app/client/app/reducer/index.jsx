import { combineReducers } from 'redux'

import app               from './AppReducer'
import toolBox           from './ToolBoxReducer'
import documentProcessor from './DocumentProcessorReducer'
import modal             from './ModalReducer'
import dataEditor        from './DataEditorReducer'
import data              from './DataReducer'
import entrez			       from './EntrezReducer'
import defaults					 from './DefaultsReducer'
import ActionType 		   from '../constant/ActionType'

const Reducer = combineReducers({ app, modal, documentProcessor,
	toolBox, dataEditor, data, entrez, defaults })

const rootReducer = (state, action) => {
	if (action.type === ActionType.Root.RESET_STATE) {

		state = undefined
	}

	return Reducer(state, action)
	}

export default rootReducer
