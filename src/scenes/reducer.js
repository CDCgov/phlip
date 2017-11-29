import { persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import home from './Home/reducer'
import admin from './Admin/reducer'
import login from './Login/reducer'

const scenesReducer = persistCombineReducers({ key: 'scenes', storage }, {
  home,
  admin,
  login
})

export default scenesReducer