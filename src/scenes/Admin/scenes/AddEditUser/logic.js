import { createLogic } from 'redux-logic'
import * as types from './actionTypes'
import { createAvatarUrl } from 'utils/urlHelper'

export const addUserLogic = createLogic({
  type: types.ADD_USER_REQUEST,
  latest: true,
  processOptions: {
    dispatchReturn: true,
    successType: types.ADD_USER_SUCCESS
  },
  async process({ action, api }) {
    return await api.addUser(action.user)
  }
})

export const updateUserLogic = createLogic({
  type: types.UPDATE_USER_REQUEST,
  latest: true,
  processOptions: {
    dispatchReturn: true,
    successType: types.UPDATE_USER_SUCCESS
  },
  async process({ action, api }) {
    return await api.updateUser(action.user)
  }
})

export const addUserPictureLogic = createLogic({
  type: types.ADD_USER_PICTURE_REQUEST,
  latest: true,
  processOptions: {
    dispatchReturn: true,
    successType: types.ADD_USER_PICTURE_SUCCESS
  },
  async process({ action, api }) {
    return await api.addUserPicture(action.userId, action.avatarFile)
  }
})

export const getUserPictureLogic = createLogic({
  type: types.GET_USER_PICTURE_REQUEST,
  latest: true,
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_USER_PICTURE_SUCCESS
  },
  async process({ action, api }) {
    let avatarUrl = ''
    try {
      let hasAvatarImage = await api.getUserPicture(action.userId)
      avatarUrl = hasAvatarImage ? createAvatarUrl(action.userId) : null
    } catch (e) {
      error = 'failed to get avatar image'
    }

    return avatarUrl
  }
})

export const deleteUserPictureLogic = createLogic({
  type: types.DELETE_USER_PICTURE_REQUEST,
  latest: true,
  processOptions: {
    dispatchReturn: true,
    successType: types.DELETE_USER_PICTURE_SUCCESS,
  },
  async process({ action, api }) {
    return await api.deleteUserPicture(action.userId)
  }
})

export default [
  deleteUserPictureLogic,
  getUserPictureLogic,
  addUserPictureLogic,
  updateUserLogic,
  addUserLogic
]