import * as types from '../../actionTypes'

const INITIAL_STATE = {}

function addEditProjectReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.ADD_PROJECT_REQUEST:
    case types.UPDATE_PROJECT_REQUEST:
    default:
      return state
  }
}

export default addEditProjectReducer
