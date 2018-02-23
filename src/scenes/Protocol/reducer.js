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

    case types.GET_PROTOCOL_SUCCESS:
      return {
        ...state,
        content: action.payload
      }

    case types.CLEAR_STATE:
      return INITIAL_STATE

    case types.SAVE_PROTOCOL_SUCCESS:
    case types.GET_PROTOCOL_REQUEST:
    case types.SAVE_PROTOCOL_REQUEST:
    default:
      return state
  }
}

export default protocolReducer