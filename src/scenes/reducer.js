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

const config = {
  storage
}

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