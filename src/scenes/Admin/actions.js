import * as types from './actionTypes'

export const getUsersRequest = () => ({ type: types.GET_USERS_REQUEST })
export const getUserSuccess = (users) => ({ type: types.GET_USERS_SUCCESS, users })

export const sortUsers = (sortBy) => ({ type: types.SORT_USERS, sortBy })
export const updateUserPage = (page) => ({ type: types.UPDATE_USER_PAGE, page })
export const updateUserRows = (rowsPerPage) => ({ type: types.UPDATE_USER_ROWS, rowsPerPage })