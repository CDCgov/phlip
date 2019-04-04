import { types } from './actions'

const INITIAL_STATE = {
  currentUser: {},
  byId: {}
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
        currentUser: action.payload,
        byId: {
          ...state.byId,
          [action.payload.id]: { ...action.payload, username: `${action.payload.firstName} ${action.payload.lastName}` }
        }
      }

    case types.UPDATE_CURRENT_USER_AVATAR:
      return {
        ...state,
        currentUser: { ...state.currentUser, avatar: action.payload },
        byId: {
          ...state.byId,
          [state.currentUser.id]: { ...state.byId[state.currentUser.id], avatar: action.payload }
        }
      }

    case types.REMOVE_CURRENT_USER_AVATAR:
      return {
        ...state,
        currentUser: { ...state.currentUser, avatar: null },
        byId: {
          ...state.byId,
          [state.currentUser.id]: { ...state.byId[state.currentUser.id], avatar: null }
        }
      }

    case types.TOGGLE_BOOKMARK_SUCCESS:
      return {
        ...state,
        currentUser: action.payload.user
      }

    case types.ADD_USER:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.user.id]: { ...action.user, username: `${action.user.firstName} ${action.user.lastName}` }
        }
      }

    case types.FLUSH_STATE:
      return INITIAL_STATE

    default:
      return state
  }
}

export default userReducer
