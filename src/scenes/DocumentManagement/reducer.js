import { combineReducers } from 'redux'
import upload from './scenes/Upload/reducer'

const INITIAL_STATE = {
  documents: {
    byId: {},
    allIds: [],
    visible: []
  },
  searchValue: ''
}

const docManagementReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    default:
      return state
  }
}

const docManageReducer = combineReducers({
  upload,
  main: docManagementReducer
})

export default docManageReducer