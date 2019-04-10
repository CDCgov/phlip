import { types } from './actions'
import { getInitials, updateObject } from 'utils/normalize'

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
        currentUser: {
          ...action.payload,
          avatar: action.payload.avatar === null ? '' : action.payload.avatar
        },
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...action.payload,
            username: `${action.payload.firstName} ${action.payload.lastName}`,
            initials: getInitials(action.payload.firstName, action.payload.lastName),
            avatar: action.payload.avatar === null ? '' : action.payload.avatar
          }
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
        currentUser: { ...state.currentUser, avatar: '' },
        byId: {
          ...state.byId,
          [state.currentUser.id]: { ...state.byId[state.currentUser.id], avatar: '' }
        }
      }

    case types.TOGGLE_BOOKMARK_SUCCESS:
      return {
        ...state,
        currentUser: action.payload.user
      }

    case types.ADD_USER:
      const user = {
        ...action.payload,
        username: `${action.payload.firstName} ${action.payload.lastName}`,
        initials: getInitials(action.payload.firstName, action.payload.lastName)
      }

      return {
        ...state,
        byId: updateObject(state.byId, { [action.payload.id]: user })
      }

    case types.UPDATE_USER:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: updateObject(state.byId[action.payload.id], action.payload)
        }
      }

    case types.FLUSH_STATE:
      return INITIAL_STATE

    default:
      return state
  }
}

export default userReducer
