import * as types from './actionTypes'

/** Getting users */
export const getUsersRequest = () => ({ type: types.GET_USERS_REQUEST })
export const getUserSuccess = (users) => ({ type: types.GET_USERS_SUCCESS, users })

/** Manipulating the sortBy and direction */
export const sortUsers = (sortBy) => ({ type: types.SORT_USERS, sortBy })

/** Not currently used */
export const updateUserPage = (page) => ({ type: types.UPDATE_USER_PAGE, page })
export const updateUserRows = (rowsPerPage) => ({ type: types.UPDATE_USER_ROWS, rowsPerPage })