import * as types from './actionTypes'

export const addUserRequest = (user) => ({ type: types.ADD_USER_REQUEST, user })
export const addUserSuccess = (user) => ({ type: types.ADD_USER_SUCCESS, user })

export const updateUserRequest = (user) => ({ type: types.UPDATE_USER_REQUEST, user })
export const updateCurrentUser = (payload) => ({ type: types.UPDATE_CURRENT_USER, payload })

export const addUserPictureRequest = (userId, avatarFile) => ({ type: types.ADD_USER_PICTURE_REQUEST, userId, avatarFile })
export const addUserPictureSuccess = (user) => ({ type: types.ADD_USER_PICTURE_SUCCESS, user })
export const onCloseAddEditUser = () => ({ type: types.ON_CLOSE_ADD_EDIT_USER })

export const getUserPictureRequest = userId => ({ type: types.GET_USER_PICTURE_REQUEST, userId })
export const deleteUserPictureRequest = userId => ({ type: types.DELETE_USER_PICTURE_REQUEST, userId })