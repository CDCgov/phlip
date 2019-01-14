import * as types from './actionTypes'

/** Request to log in a user with basic auth */
export const loginUserRequest = credentials => ({ type: types.LOGIN_USER_REQUEST, credentials })

/** Dispatched when the user successfully logged in */
export const loginUserSuccess = payload => ({ type: types.LOGIN_USER_SUCCESS, payload })

/** Request to log in user with PIV auth */
export const checkPivUserRequest = tokenObj => ({ type: types.CHECK_PIV_USER_REQUEST, tokenObj })