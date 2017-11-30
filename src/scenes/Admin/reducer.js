import * as types from './actionTypes'
import { combineReducers } from 'redux'
import addEditUserReducer from './scenes/AddEditUser/reducer'
import { mockUsers } from '../../data/mockUsers'
import sortList from '../../utils/sortList'

const INITIAL_STATE = {
  users: [],
  rowsPerPage: 10,
  page: 0,
  sortBy: 'name',
  direction: 'asc'
}

const randomId = Math.random(2) //TODO: Temporary for mocks


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
            id: randomId //TODO: Temporary for mocks
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

    case types.SORT_USERS:
      const direction = state.direction === 'asc' ? 'desc' : 'asc'
      const sorted = sortList(state.users, action.sortBy, direction)
      return {
        ...state,
        sortBy: action.sortBy,
        direction: direction,
        users: sorted
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