import { persistReducer } from 'redux-persist'
import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage'
import home from './Home/reducer'
import admin from './Admin/reducer'
import login from './Login/reducer'
import codingScheme from './CodingScheme/reducer'
import coding from './Coding/reducer'

const config = {
  storage
}

const scenesReducer = combineReducers({
  home: persistReducer({ ...config, key: 'home', blacklist: ['addEditJurisdictions'] }, home),
  admin: persistReducer({ ...config, key: 'admin' }, admin),
  codingScheme,
  login,
  coding
})

export default scenesReducer