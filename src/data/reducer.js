import { persistReducer } from 'redux-persist'
import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage'
import user from './user/reducer'

const dataPersistConfig = {
  key: 'data',
  storage,
  blacklist: ['menuAnchor']
}

const dataReducer = combineReducers({
  user: persistReducer(dataPersistConfig, user)
})

export default dataReducer