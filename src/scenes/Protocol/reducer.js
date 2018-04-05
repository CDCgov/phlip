import * as types from './actionTypes'

const INITIAL_STATE = {
  content: '',
  getProtocolError: null,
  submitting: false,
  lockedAlert: null,
  lockedByCurrentUser: false,
  lockInfo: {},
  alertError: null
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
        content: action.payload.protocol,
        getProtocolError: null,
        lockInfo: action.payload.lockInfo,
        lockedByCurrentUser: action.payload.lockedByCurrentUser,
        lockedAlert: Object.keys(action.payload.lockInfo).length > 0
          ? action.payload.lockedByCurrentUser ? null : true
          : null
      }

    case types.GET_PROTOCOL_FAIL:
      return {
        ...state,
        getProtocolError: true
      }

    case types.RESET_ALERT_ERROR:
      return {
        ...state,
        alertError: null
      }

    case types.LOCK_PROTOCOL_FAIL:
    case types.UNLOCK_PROTOCOL_FAIL:
    case types.SAVE_PROTOCOL_FAIL:
      return {
        alertError: action.payload,
        submitting: false
      }

    case types.RESET_LOCK_ALERT_PROTOCOL:
      return {
        ...state,
        lockedAlert: null
      }

    case types.CLEAR_STATE:
      return INITIAL_STATE

    case types.SAVE_PROTOCOL_SUCCESS:
      return {
        ...state,
        alertError: null,
        submitting: false
      }

    case types.SAVE_PROTOCOL_REQUEST:
      return {
        ...state,
        submitting: true
      }

    case types.LOCK_PROTOCOL_SUCCESS:
      return {
        ...state,
        lockInfo: action.payload,
        lockedByCurrentUser: true
      }

    case types.UNLOCK_PROTOCOL_SUCCESS:
      return {
        ...state,
        lockInfo: {},
        lockedByCurrentUser: false
      }

    case types.LOCK_PROTOCOL_REQUEST:
    case types.UNLOCK_PROTOCOL_REQUEST:
    case types.GET_PROTOCOL_REQUEST:
    default:
      return state
  }
}

export default protocolReducer