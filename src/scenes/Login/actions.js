import * as types from './actionTypes'

export const loginUserRequest = credentials => ({ type: types.LOGIN_USER_REQUEST, credentials })
export const loginUserSuccess = payload => ({ type: types.LOGIN_USER_SUCCESS, payload })
export const checkPivUserRequest = tokenObj => ({ type: types.CHECK_PIV_USER_REQUEST, tokenObj })