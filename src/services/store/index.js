import { createStore, applyMiddleware, compose } from 'redux'
import { createLogicMiddleware } from 'redux-logic'
import { persistStore } from 'redux-persist'
import rootLogic from 'logic'
import appReducer from 'reducer'
import createApiHandler from '../api'
import createBrowserHistory from 'history/createBrowserHistory'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const history = createBrowserHistory()
const api = createApiHandler({ history })

const store = createStore(
  appReducer,
  composeEnhancers(
    applyMiddleware(createLogicMiddleware(rootLogic, { api, history }))
  )
)
const persistor = persistStore(store, null, () => store.getState())

export {
  store,
  persistor,
  history,
  api
}