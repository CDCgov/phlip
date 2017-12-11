import * as types from './actionTypes'

const INITIAL_STATE = {
  currentUser: undefined,
  menuOpen: false,
  menuAnchor: null
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
        menuOpen: !state.menuOpen,
        menuAnchor: action.anchor
      }

    case types.CLOSE_MENU:
      return {
        ...state,
        menuOpen: false,
        menuAnchor: null
      }

    default:
      return state
  }
}

export default userReducer