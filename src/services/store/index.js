import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { createLogicMiddleware } from 'redux-logic'
import { persistStore } from 'redux-persist'
import rootLogic from 'logic'
import rootReducer from 'reducer'
import api from '../api'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(createLogicMiddleware(rootLogic, { api }))
  )
)
const persistor = persistStore(store, null, () => store.getState())

export {
  store,
  persistor
}