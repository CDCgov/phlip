import data from 'data/reducer'
import scenes from 'scenes/reducer'
import { reducer as formReducer } from 'redux-form'
import { persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/es/storage'

const reducers = {
  data,
  scenes,
  form: formReducer
}

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['form']
}

const appReducer = persistCombineReducers(persistConfig, reducers)

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT_USER') {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer