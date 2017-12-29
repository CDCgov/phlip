import * as types from './actionTypes'

const INITIAL_STATE = {
  jurisdictions: []
}

const addEditJurisdictionsReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.UPDATE_PROJECT_JURISDICTION:
    case types.ADD_PROJECT_JURISDICTION:
    default:
      return state
  }
}

export default addEditJurisdictionsReducer