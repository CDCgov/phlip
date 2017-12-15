import * as types from './actionTypes'
import { combineReducers } from 'redux'
import addEditUserReducer from './scenes/AddEditUser/reducer'
import { mockUsers } from '../../data/mockUsers'
import { sortList, updater } from '../../utils'

const INITIAL_STATE = {
  users: [],
  rowsPerPage: 10,
  page: 0,
  sortBy: 'lastName',
  direction: 'asc',
  visibleUsers: []
}


const sliceUsers = (data, page, rowsPerPage) => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

const getAvailableUsers = (users, sortBy, direction, page, rowsPerPage) => {
  const sortedUsers = sortList(users, sortBy, direction)
  // const result = { users: sortedUsers, visibleUsers: sliceUsers(sortedUsers, page, rowsPerPage) }  //TODO: Need to change after figure out state pagination issue
  return { users: sortedUsers, visibleUsers: sortedUsers }
}

function adminReducer(state = INITIAL_STATE, action) {
  switch (action.type) {

    case types.GET_USERS_SUCCESS:
      return {
        ...state,
        ...getAvailableUsers(
          action.payload, state.sortBy, state.direction, state.page, state.rowsPerPage
        )
      }

    case types.ADD_USER_SUCCESS:
      const updated = getAvailableUsers(state.users, 'lastName', 'asc', 0, state.rowsPerPage)
      if ((updated.visibleUsers.length + 1) > state.rowsPerPage) {
        updated.visibleUsers.pop()
      }
      return {
        ...state,
        users: [action.payload, ...updated.users],
        sortBy: 'lastName',
        direction: 'desc',
        page: 0,
        visibleUsers: [action.payload, ...updated.visibleUsers]
      }

    case types.UPDATE_USER_SUCCESS:
      return {
        ...state,
        users: updater.updateByProperty(action.payload, [...state.users], 'userId'),
        visibleUsers: updater.updateByProperty(action.payload, [...state.visibleUsers], 'userId')
      }

    case types.SORT_USERS:
      const direction = state.direction === 'asc' ? 'desc' : 'asc'
      return {
        ...state,
        sortBy: action.sortBy,
        direction: direction,
        ...getAvailableUsers(
          state.users, action.sortBy, direction, state.page, state.rowsPerPage
        )
      }

    case types.UPDATE_USER_ROWS:
      return {
        ...state,
        rowsPerPage: action.rowsPerPage,
        visibleUsers: sliceUsers(state.users, state.page, action.rowsPerPage)
      }

    case types.UPDATE_USER_PAGE:
      return {
        ...state,
        page: action.page,
        visibleUsers: sliceUsers(state.users, action.page, state.rowsPerPage)
      }

    case 'FLUSH_STATE':
      return INITIAL_STATE

    case types.GET_USERS_REQUEST:
    default:
      return state
  }
}

const adminRootReducer = combineReducers({
  main: adminReducer,
  addEditUser: addEditUserReducer
})

export default adminRootReducer