import { persistReducer } from 'redux-persist'
import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage'
import home from './Home/reducer'
import admin from './Admin/reducer'
import login from './Login/reducer'

const config = {
  storage
}

const scenesReducer = combineReducers({
  home: persistReducer({ ...config, key: 'home' }, home),
  admin: persistReducer({ ...config, key: 'admin' }, admin),
  login
})

export default scenesReducer