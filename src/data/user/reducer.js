import * as types from 'scenes/Login/actionTypes'

const INITIAL_STATE = {
  currentUser: undefined
}

function userReducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.LOGIN_USER_SUCCESS:
      return {
        ...state,
        currentUser: action.payload
      }

    default:
      return state
  }
}

export default userReducer