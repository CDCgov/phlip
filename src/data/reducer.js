import { persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import user from './user/reducer'

const dataReducer = persistCombineReducers({ key: 'data', storage }, {
  user
})

export default dataReducer