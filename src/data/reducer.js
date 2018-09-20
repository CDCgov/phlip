import { persistReducer } from 'redux-persist'
import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage/session'
import user from './user/reducer'

/**
 * Root reducer for the data directory. Combines any reducer from the subdirectories.
 */
const dataPersistConfig = {
  key: 'user',
  storage
}

const dataReducer = combineReducers({
  user: persistReducer(dataPersistConfig, user)
})

export default dataReducer