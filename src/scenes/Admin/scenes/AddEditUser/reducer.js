import * as types from './actionTypes'

const INITIAL_STATE = {
  avatar: null
}

/**
 * Reducer for the AddEditUser scene. Accessible at state.scenes.admin.addEditUser
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
const addEditUserReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case types.GET_USER_IMAGE_SUCCESS:
      return {
        ...state,
        avatar: action.payload
      }

    case types.ADD_USER_IMAGE_SUCCESS:
      return {
        ...state,
        avatar: action.payload.avatar
      }

    case types.LOAD_ADD_EDIT_AVATAR:
      return {
        ...state,
        avatar: action.avatar
      }

    case types.DELETE_USER_IMAGE_SUCCESS:
    case types.ON_CLOSE_ADD_EDIT_USER:
    case types.ADD_USER_IMAGE_REQUEST:
      return INITIAL_STATE

    case types.ADD_USER_REQUEST:
    case types.UPDATE_USER_REQUEST:

    default:
      return state
  }
}

export default addEditUserReducer