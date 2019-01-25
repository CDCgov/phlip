import makeActionCreator from 'utils/makeActionCreator'

export const types = {
  GET_USERS_REQUEST: 'GET_USERS_REQUEST',
  GET_USERS_SUCCESS: 'GET_USERS_SUCCESS',
  GET_USERS_FAIL: 'GET_USERS_FAIL',
  UPDATE_USER_REQUEST: 'UPDATE_USER_REQUEST',
  UPDATE_USER_SUCCESS: 'UPDATE_USER_SUCCESS',
  UPDATE_USER_FAIL: 'UPDATE_USER_FAIL',
  ADD_USER_SUCCESS: 'ADD_USER_SUCCESS',
  FLUSH_STATE: 'FLUSH_STATE',
  SORT_USERS: 'SORT_USERS',
  UPDATE_USER_PAGE: 'UPDATE_USER_PAGE',
  UPDATE_USER_ROWS: 'UPDATE_USER_ROWS',
  ADD_USER_IMAGE_SUCCESS: 'ADD_USER_IMAGE_SUCCESS'
}

export default {
  getUsersRequest: makeActionCreator(types.GET_USERS_REQUEST),
  getUserSuccess: makeActionCreator(types.GET_USERS_SUCCESS, 'users'),
  sortUsers: makeActionCreator(types.SORT_USERS, 'sortBy')
  //updateUserPage: makeActionCreator(types.UPDATE_USER_PAGE, 'page'),
  //updateUserRows: makeActionCreator(types.UPDATE_USER_ROWS, 'rowsPerPage')
}