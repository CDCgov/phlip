import * as types from '../../actionTypes'

const INITIAL_STATE = {}

function newProjectReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.ADD_PROJECT_REQUEST:
    default:
      return state
  }
}

export default newProjectReducer
