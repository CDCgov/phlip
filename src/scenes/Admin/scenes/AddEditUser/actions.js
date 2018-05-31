import * as types from './actionTypes'

export const addUserRequest = (user) => ({ type: types.ADD_USER_REQUEST, user })
export const addUserSuccess = (user) => ({ type: types.ADD_USER_SUCCESS, user })

export const updateUserRequest = (user) => ({ type: types.UPDATE_USER_REQUEST, user })
export const updateCurrentUser = (payload) => ({ type: types.UPDATE_CURRENT_USER, payload })
export const updateCurrentUserAvatar = (payload) => ({ type: types.UPDATE_CURRENT_USER_AVATAR, payload })
export const removeCurrentUserAvatar = () => ({ type: types.REMOVE_CURRENT_USER_AVATAR })

export const addUserPictureRequest = (userId, patchOperation) => ({ type: types.ADD_USER_IMAGE_REQUEST, userId, patchOperation })
export const addUserPictureSuccess = (user) => ({ type: types.ADD_USER_IMAGE_SUCCESS, user })
export const onCloseAddEditUser = () => ({ type: types.ON_CLOSE_ADD_EDIT_USER })

export const getUserPictureRequest = userId => ({ type: types.GET_USER_IMAGE_REQUEST, userId })
export const deleteUserPictureRequest = (userId, operation) => ({ type: types.DELETE_USER_IMAGE_REQUEST, userId, operation })

export const loadAddEditAvatar = (avatar) => ({ type: types.LOAD_ADD_EDIT_AVATAR, avatar })
export const resetFormError = () => ({ type: types.RESET_USER_FORM_ERROR })
export const resetSubmittingStatus = () => ({ type: types.RESET_SUBMITTING_STATUS })