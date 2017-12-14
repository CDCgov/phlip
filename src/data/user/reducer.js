import * as types from './actionTypes'

const INITIAL_STATE = {
  currentUser: { bookmarks: [] },
  menuOpen: false,
  menuAnchor: null
}

function userReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.LOGIN_USER_SUCCESS:
      return {
        ...state,
        currentUser: { ...action.payload, bookmarks: [] }
      }

    case types.OPEN_MENU:
      return {
        ...state,
        menuOpen: true,
        menuAnchor: action.anchor
      }

    case types.CLOSE_MENU:
      return {
        ...state,
        menuOpen: false,
        menuAnchor: null
      }

    case types.TOGGLE_BOOKMARK:
      return {
        ...state,
        currentUser: action.user
      }

    case 'FLUSH_STATE':
      return INITIAL_STATE

    default:
      return state
  }
}

export default userReducer