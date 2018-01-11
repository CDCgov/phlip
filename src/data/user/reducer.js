import * as types from './actionTypes'

const INITIAL_STATE = {
  currentUser: {},
  menuOpen: false
}

function userReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.LOGIN_USER_SUCCESS:
      return {
        ...state,
        currentUser: action.payload
      }

    case types.TOGGLE_MENU:
      return {
        ...state,
        menuOpen: !state.menuOpen
      }

    case types.CLOSE_MENU:
      return {
        ...state
      }

    case types.TOGGLE_BOOKMARK_SUCCESS:
      return {
        ...state,
        currentUser: action.payload.user
      }

    case 'FLUSH_STATE':
      return INITIAL_STATE

    default:
      return state
  }
}

export default userReducer