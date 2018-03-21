import * as types from './actionTypes'
import { createAvatarUrl } from 'utils/urlHelper'

const INITIAL_STATE = {
  avatarUrl: null
}

export default function addEditUserReducer(state = INITIAL_STATE, action) {
  switch (action.type) {

    case types.GET_USER_PICTURE_SUCCESS:
      return {
        ...state,
        avatarUrl: action.payload
      }

    case types.ADD_USER_PICTURE_SUCCESS:
      return {
        ...state,
        avatarUrl: action.payload
      }

    case types.DELETE_USER_PICTURE_SUCCESS:
    case types.ON_CLOSE_ADD_EDIT_USER:
    case types.ADD_USER_PICTURE_REQUEST:
      return INITIAL_STATE

    case types.ADD_USER_REQUEST:
    case types.UPDATE_USER_REQUEST:

    default:
      return state
  }
}