import * as types from './actionTypes'

const INITIAL_STATE = {
  currentUser: {}
}

/**
 * Reducer for handling user related actions, mostly coming from the actions in the avatar menu
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {{currentUser: {}, menuOpen: boolean, pdfError: string, pdfFile: null}}
 */
const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.UPDATE_CURRENT_USER:
    case types.CHECK_PIV_USER_SUCCESS:
    case types.LOGIN_USER_SUCCESS:
      return {
        ...state,
        currentUser: action.payload
      }

    case types.UPDATE_CURRENT_USER_AVATAR:
      return {
        ...state,
        currentUser: { ...state.currentUser, avatar: action.payload }
      }

    case types.REMOVE_CURRENT_USER_AVATAR:
      return {
        ...state,
        currentUser: { ...state.currentUser, avatar: null }
      }

    case types.TOGGLE_BOOKMARK_SUCCESS:
      return {
        ...state,
        currentUser: action.payload.user
      }

    case types.FLUSH_STATE:
      return INITIAL_STATE

    default:
      return state
  }
}

export default userReducer