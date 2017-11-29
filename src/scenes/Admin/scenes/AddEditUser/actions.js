import * as types from './actionTypes'

export const addUserRequest = (user) => ({ type: types.ADD_USER_REQUEST, user })
export const addUserSuccess = (user) => ({ type: types.ADD_USER_SUCCESS, user })

export const updateUserRequest = (user) => ({ type: types.UPDATE_USER_REQUEST, user })