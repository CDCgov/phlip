import * as types from './actionTypes'

const INITIAL_STATE = {
  session: !!sessionStorage.esquire_token,
  pivError: null,
  formMessage: null
}

const loginReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.LOGIN_USER_SUCCESS:
      return {
        ...state,
        session: !!sessionStorage.esquire_token,
        formMessage: null
      }

    case types.CHECK_PIV_USER_SUCCESS:
      return {
        ...state,
        session: !!sessionStorage.esquire_token
      }

    case types.LOGIN_USER_FAIL:
      return state

    case types.CHECK_PIV_USER_FAIL:
      return {
        ...state,
        formMessage: 'Login failed. Please contact your administrator.'
      }

    case types.LOGIN_USER_REQUEST:
      return state

    case types.LOGOUT_USER:
      if (action.sessionExpired === true) {
        return {
          ...state,
          formMessage: 'Your session expired. Please login again.'
        }
      } else {
        return state
      }

    case types.FLUSH_STATE:
      return {
        ...INITIAL_STATE,
        formMessage: state.formMessage
      }

    default: return { ...state }
  }
}

export default loginReducer