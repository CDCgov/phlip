import { combineReducers } from 'redux'
import upload from './scenes/Upload/reducer'
import { types } from './actions'

const INITIAL_STATE = {
  documents: [],
  searchValue: ''
}

const docManagementReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.GET_DOCUMENTS_SUCCESS:
      return {
        ...state,
        documents: action.payload
      }

    default:
      return state
  }
}

const docManageReducer = combineReducers({
  upload,
  main: docManagementReducer
})

export default docManageReducer