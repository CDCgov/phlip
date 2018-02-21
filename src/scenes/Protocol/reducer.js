import * as types from './actionTypes'

const INITIAL_STATE = {
  content: ''
}

const protocolReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.UPDATE_PROTOCOL:
      return {
        ...state,
        content: action.content
      }
    default:
      return state
  }
}

export default protocolReducer