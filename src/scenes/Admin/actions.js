import * as types from './actionTypes'

export const getUsersRequest = () => ({ type: types.GET_USERS_REQUEST })
export const getUserSuccess = (users) => ({ type: types.GET_USERS_SUCCESS, users })

export const sortUsers = (sortBy) => ({ type: types.SORT_USERS, sortBy })
export const updatePage = (page) => ({ type: types.UPDATE_PAGE, page })
export const updateRows = (rowsPerPage) => ({ type: types.UPDATE_ROWS, rowsPerPage })