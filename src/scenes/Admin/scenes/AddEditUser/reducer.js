import * as types from './actionTypes'

const INITIAL_STATE = {}

export default function addEditUserReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.ADD_USER_REQUEST:
    case types.UPDATE_USER_REQUEST:
    default:
      return state
  }
}