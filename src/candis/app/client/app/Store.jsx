import { createStore, applyMiddleware, compose } from 'redux'
import thunk   from 'redux-thunk'
import logger  from 'redux-logger'

import config  from './config'

import reducer from './reducer'

// NOTE
// Adding new middlewares are easy. Simply add a middleware to the 
// `middlewares` array. In case of middlewares to be used only during
// development, add a middleware to the array as follows:
//
//   config.debug && `<middleware_instance>`
//
// SOURCE: github.com/evgenyrodionov/redux-logger/issues/6#issuecomment-132731227
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const middlewares = [
	thunk,
	config.debug && logger
].filter(Boolean)

const middleware  = applyMiddleware(...middlewares)
const store       = createStore(reducer, composeEnhancers(middleware))

export default store
