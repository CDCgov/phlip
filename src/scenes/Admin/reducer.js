import * as types from './actionTypes'
import { combineReducers } from 'redux'
import addEditUserReducer from './scenes/AddEditUser/reducer'
import { mockUsers } from '../../data/mockUsers'

const INITIAL_STATE = {
  users: []
}

function adminReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_USERS_REQUEST:
      return state

    case types.GET_USERS_SUCCESS:
      return {
        ...state,
        // users: action.payload
        users: mockUsers
      }

    case types.ADD_USER_SUCCESS:
      return {
        ...state,
        users: [
          ...state.users,
          {
            ...action.payload,
            id: Math.random(2) //TODO: Temporary for mocks
          }
        ]
      }

    case types.UPDATE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.map(user =>
          (user.id === action.payload.id)
            ? action.payload
            : user
        )
      }
    default:
      return state
  }
}

const adminRootReducer = combineReducers({
  main: adminReducer,
  addEditUser: addEditUserReducer
})

export default adminRootReducer