import * as types from './actionTypes'

export const loginUserRequest = (credentials) => ({ type: types.LOGIN_USER_REQUEST, credentials })
export const loginUserSuccess = (payload) => ({ type: types.LOGIN_USER_SUCCESS, payload })
export const logoutUser = () => ({ type: types.LOGOUT_USER })