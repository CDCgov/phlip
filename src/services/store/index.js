import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { createLogicMiddleware } from 'redux-logic'
import { persistStore, persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/es/storage'
import rootLogic from 'logic'
import rootReducer from 'reducer'
import { reducer as formReducer } from 'redux-form'
import api from '../api'

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['form']
}

const reducer = persistCombineReducers(persistConfig, rootReducer)
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(createLogicMiddleware(rootLogic, { api }))
  )
)
const persistor = persistStore(store, null, () => store.getState())

export {
  store,
  persistor
}