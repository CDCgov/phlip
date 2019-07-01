import { types } from './actions'

export const INITIAL_STATE = {
  formError: null,
  goBack: false,
  submitting: false,
  users: [],
  userSuggestions: [],
  userSearchValue: ''
}

/**
 * Reducer for the AddEditProject scene
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {{formError: null, goBack: boolean}}
 */
const addEditProjectReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.ADD_PROJECT_FAIL:
    case types.UPDATE_PROJECT_FAIL:
    case types.DELETE_PROJECT_FAIL:
      return {
        ...state,
        formError: action.payload,
        goBack: false,
        submitting: false
      }

    case types.DELETE_PROJECT_SUCCESS:
    case types.UPDATE_PROJECT_SUCCESS:
    case types.ADD_PROJECT_SUCCESS:
      return {
        ...state,
        formError: null,
        goBack: true,
        submitting: false
      }

    case types.ADD_PROJECT_REQUEST:
    case types.UPDATE_PROJECT_REQUEST:
    case types.DELETE_PROJECT_REQUEST:
      return {
        ...state,
        submitting: true,
        goBack: false
      }
      
    case types.SET_CURRENT_USERS:
      const creatorIndex = action.users.findIndex(user => user.userId === action.creatorId)
      const users = action.users.slice()
      users.splice(creatorIndex, 1)
      const updated = [...users, action.users[creatorIndex]]
      
      return {
        ...state,
        users: updated
      }
      
    case types.ON_USER_SUGGESTION_SELECTED:
      return {
        ...state,
        users: [
          ...state.users,
          { ...action.user, userId: action.user.id }
        ],
        userSearchValue: ''
      }
      
    case types.REMOVE_USER_FROM_LIST:
      const updatedUsers = state.users.slice()
      updatedUsers.splice(action.index, 1)
      
      return {
        ...state,
        users: updatedUsers
      }
      
    case types.UPDATE_USER_SUGGESTION_VALUE:
      return {
        ...state,
        userSearchValue: action.suggestionValue
      }
      
    case types.SET_USER_SUGGESTIONS:
      return {
        ...state,
        userSuggestions: action.payload
      }
      
    case types.ON_CLEAR_USER_SUGGESTIONS:
      return {
        ...state,
        userSuggestions: []
      }
  
    case types.RESET_FORM_ERROR:
      return {
        ...state,
        formError: null
      }
      
    default:
      return state
  }
}

export default addEditProjectReducer
