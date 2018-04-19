import * as types from './actionTypes'

const TOKEN_KEY = 'esquire_token'

const INITIAL_STATE = {
  session: !!sessionStorage.esquire_token
}

const loginReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.LOGIN_USER_SUCCESS:
      return {
        ...state,
        session: !!sessionStorage.esquire_token
      }
    case types.CHECK_PIV_USER_SUCCESS:
      return {
        ...state,
        session: !!sessionStorage.esquire_token
      }
    case types.LOGIN_USER_FAIL:
      return state
    case types.LOGIN_USER_REQUEST:
      return state
    case 'FLUSH_STATE':
      return INITIAL_STATE

    default: return { ...state }
  }
}

export default loginReducer