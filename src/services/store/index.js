import { createStore, applyMiddleware, compose } from 'redux'
import { createLogicMiddleware } from 'redux-logic'
import { persistStore } from 'redux-persist'
import rootLogic from 'logic'
import appReducer from 'reducer'
import createApiHandler from '../api'
import createBrowserHistory from 'history/createBrowserHistory'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
let persistor, history, api

/**
 * Redux store initialization
 */
const configureStore = () => {
  history = createBrowserHistory()
  api = createApiHandler({ history })

  const store = createStore(
    appReducer,
    composeEnhancers(
      applyMiddleware(createLogicMiddleware(rootLogic, { api, history }))
    )
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../../reducer', () => {
      store.replaceReducer(appReducer)
      persistor = persistStore(store, null, () => store.getState())
    })
  }

  persistor = persistStore(store, null, () => store.getState())

  return { store }
}

export {
  configureStore,
  persistor,
  history,
  api
}