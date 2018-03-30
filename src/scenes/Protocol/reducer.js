import * as types from './actionTypes'

const INITIAL_STATE = {
  content: '',
  saveError: null,
  getProtocolError: null,
  submitting: false
}

const protocolReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.UPDATE_PROTOCOL:
      return {
        ...state,
        content: action.content,
        submitting: false
      }

    case types.GET_PROTOCOL_SUCCESS:
      return {
        ...state,
        content: action.payload,
        getProtocolError: null
      }

    case types.GET_PROTOCOL_FAIL:
      return {
        ...state,
        getProtocolError: true
      }

    case types.SAVE_PROTOCOL_FAIL:
      return {
        ...state,
        saveError: true,
        submitting: false
      }

    case types.RESET_SAVE_ERROR:
      return {
        ...state,
        saveError: null
      }

    case types.CLEAR_STATE:
      return INITIAL_STATE

    case types.SAVE_PROTOCOL_SUCCESS:
      return {
        ...state,
        saveError: null,
        submitting: false
      }

    case types.SAVE_PROTOCOL_REQUEST:
      return {
        ...state,
        submitting: true
      }

    case types.GET_PROTOCOL_REQUEST:
    default:
      return state
  }
}

export default protocolReducer