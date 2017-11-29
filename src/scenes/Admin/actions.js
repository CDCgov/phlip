import * as types from './actionTypes'

export const getUsersRequest = () => ({ type: types.GET_USERS_REQUEST })
export const getUserSuccess = (users) => ({ type: types.GET_USERS_SUCCESS, users })

