import { persistReducer } from 'redux-persist'
import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage/session'
import home from './Home/reducer'
import admin from './Admin/reducer'
import login from './Login/reducer'
import codingScheme from './CodingScheme/reducer'
import docManage from './DocumentManagement/reducer'
import coding, { codingHandlers } from './Coding/reducer'
import validation, { validationHandlers } from './Validation/reducer'
import protocol from './Protocol/reducer'
import { createCodingValidationReducer } from 'components/CodingValidation/reducer'
import * as types from 'data/user/actionTypes'
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

const INITIAL_STATE = {
  pdfError: '',
  pdfFile: null,
  isRefreshing: false
}

const mainReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.DOWNLOAD_PDF_REQUEST:
      return {
        ...state,
        menuOpen: false
      }

    case types.DOWNLOAD_PDF_FAIL:
      return {
        ...state,
        pdfError: 'We failed to download the help guide.'
      }

    case types.DOWNLOAD_PDF_SUCCESS:
      return {
        ...state,
        pdfError: '',
        pdfFile: new Blob([action.payload], { type: 'application/pdf' })
      }

    case types.CLEAR_PDF_FILE:
      return {
        ...state,
        pdfFile: null
      }

    case types.RESET_DOWNLOAD_PDF_ERROR:
      return {
        ...state,
        pdfError: ''
      }

    case types.REFRESH_JWT:
      return {
        ...state,
        isRefreshing: true
      }

    case types.FLUSH_STATE:
      return INITIAL_STATE

    default:
      return state
  }
}

// Config used for redux-persist
const config = {
  storage,
  stateReconciler: autoMergeLevel2
}

/**
 * Create the scenes root reducer by combining all of the reducers for each scene into one. It can be accessed at
 * state.scenes. All reducers defined here are accessible by doing state.scenes.reducerName, where reducerName is the
 * name of the reducer. For example, if I wanted to access the home reducer, I would use state.scenes.home. It also
 * sets up redux-persist for home and admin reducers.
 */
const scenesReducer = combineReducers({
  main: persistReducer({ ...config, key: 'main' }, mainReducer),
  home: persistReducer({ ...config, key: 'home', blacklist: ['addEditJurisdictions'] }, home),
  admin: persistReducer({ ...config, key: 'admin' }, admin),
  docManage: persistReducer({ ...config, key: 'docManage', blacklist: ['upload'] }, docManage),
  coding: createCodingValidationReducer(coding, codingHandlers, 'CODING' ),
  validation: createCodingValidationReducer(validation, validationHandlers, 'VALIDATION'),
  codingScheme,
  login,
  protocol
})

export default scenesReducer