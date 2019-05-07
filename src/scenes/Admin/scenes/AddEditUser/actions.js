import makeActionCreator from 'utils/makeActionCreator'

export const types = {
  ADD_USER_REQUEST: 'ADD_USER_REQUEST',
  ADD_USER_SUCCESS: 'ADD_USER_SUCCESS',
  ADD_USER_FAIL: 'ADD_USER_FAIL',
  UPDATE_USER_REQUEST: 'UPDATE_USER_REQUEST',
  UPDATE_USER_SUCCESS: 'UPDATE_USER_SUCCESS',
  UPDATE_USER_FAIL: 'UPDATE_USER_FAIL',
  UPDATE_CURRENT_USER: 'UPDATE_CURRENT_USER',
  UPDATE_CURRENT_USER_AVATAR: 'UPDATE_CURRENT_USER_AVATAR',
  REMOVE_CURRENT_USER_AVATAR: 'REMOVE_CURRENT_USER_AVATAR',
  ADD_USER_IMAGE_REQUEST: 'ADD_USER_IMAGE_REQUEST',
  ADD_USER_IMAGE_SUCCESS: 'ADD_USER_IMAGE_SUCCESS',
  GET_USER_IMAGE_REQUEST: 'GET_USER_IMAGE_REQUEST',
  GET_USER_IMAGE_SUCCESS: 'GET_USER_IMAGE_SUCCESS',
  DELETE_USER_IMAGE_REQUEST: 'DELETE_USER_IMAGE_REQUEST',
  DELETE_USER_IMAGE_SUCCESS: 'DELETE_USER_IMAGE_SUCCESS',
  ON_CLOSE_ADD_EDIT_USER: 'ON_CLOSE_ADD_EDIT_USER',
  LOAD_ADD_EDIT_AVATAR: 'LOAD_ADD_EDIT_AVATAR',
  RESET_USER_FORM_ERROR: 'RESET_USER_FORM_ERROR',
  RESET_SUBMITTING_STATUS: 'RESET_SUBMITTING_STATUS'
}

export default {
  addUserRequest: makeActionCreator(types.ADD_USER_REQUEST, 'user'),
  addUserSuccess: makeActionCreator(types.ADD_USER_SUCCESS, 'user'),
  updateUserRequest: makeActionCreator(types.UPDATE_USER_REQUEST, 'user'),
  updateCurrentUser: makeActionCreator(types.UPDATE_CURRENT_USER, 'payload'),
  updateCurrentUserAvatar: makeActionCreator(types.UPDATE_CURRENT_USER_AVATAR, 'payload'),
  removeCurrentUserAvatar: makeActionCreator(types.REMOVE_CURRENT_USER_AVATAR),
  addUserPictureRequest: makeActionCreator(types.ADD_USER_IMAGE_REQUEST, 'userId', 'patchOperation', 'user'),
  addUserPictureSuccess: makeActionCreator(types.ADD_USER_IMAGE_SUCCESS, 'user'),
  onCloseAddEditUser: makeActionCreator(types.ON_CLOSE_ADD_EDIT_USER),
  getUserPictureRequest: makeActionCreator(types.GET_USER_IMAGE_REQUEST, 'userId'),
  deleteUserPictureRequest: makeActionCreator(types.DELETE_USER_IMAGE_REQUEST, 'userId', 'operation', 'user'),
  loadAddEditAvatar: makeActionCreator(types.LOAD_ADD_EDIT_AVATAR, 'avatar'),
  resetFormError: makeActionCreator(types.RESET_USER_FORM_ERROR),
  resetSubmittingStatus: makeActionCreator(types.RESET_SUBMITTING_STATUS)
}
