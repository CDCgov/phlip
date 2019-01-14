import { persistReducer } from 'redux-persist'
import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage/session'
import home from './Home/reducer'
import admin from './Admin/reducer'
import login from './Login/reducer'
import codingScheme from './CodingScheme/reducer'
import coding, { codingHandlers } from './Coding/reducer'
import validation, { validationHandlers } from './Validation/reducer'
import protocol from './Protocol/reducer'
import { createCodingValidationReducer } from 'components/CodingValidation/reducer'

// Config used for redux-persist
const config = {
  storage
}

/**
 * Create the scenes root reducer by combining all of the reducers for each scene into one. It can be accessed at
 * state.scenes. All reducers defined here are accessible by doing state.scenes.reducerName, where reducerName is the
 * name of the reducer. For example, if I wanted to access the home reducer, I would use state.scenes.home. It also
 * sets up redux-persist for home and admin reducers.
 */
const scenesReducer = combineReducers({
  home: persistReducer({ ...config, key: 'home', blacklist: ['addEditJurisdictions'] }, home),
  admin: persistReducer({ ...config, key: 'admin' }, admin),
  codingScheme,
  login,
  coding: createCodingValidationReducer(coding, codingHandlers, 'CODING' ),
  validation: createCodingValidationReducer(validation, validationHandlers, 'VALIDATION'),
  protocol
})

export default scenesReducer