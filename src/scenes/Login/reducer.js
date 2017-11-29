import * as types from './actionTypes'

const TOKEN_KEY = 'esquire_token'

const INITIAL_STATE = {
  session: !!localStorage.esquire_token
}

function loginReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.LOGIN_USER_SUCCESS:
      return {
        ...state,
        session: !!localStorage.esquire_token
      }
    case types.LOGIN_USER_FAIL:
      return state
    case types.LOGIN_USER_REQUEST:
      return state

    default: return state
  }
}

export default loginReducer