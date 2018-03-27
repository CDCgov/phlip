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

export const patchUserImageLogic = createLogic({
  type: types.ADD_USER_IMAGE_REQUEST,
  latest: true,
  processOptions: {
    dispatchReturn: true,
    successType: types.ADD_USER_IMAGE_SUCCESS
  },
  async process({ action, api }) {
    return await api.updateUserImage(action.userId, action.patchOperation)
  }
})

export const getUserImageLogic = createLogic({
  type: types.GET_USER_IMAGE_REQUEST,
  latest: true,
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_USER_IMAGE_SUCCESS
  },
  async process({ action, api }) {
    return await api.getUserImage(action.userId)
  }
})

export const deleteUserImageLogic = createLogic({
  type: types.DELETE_USER_IMAGE_REQUEST,
  latest: true,
  processOptions: {
    dispatchReturn: true,
    successType: types.DELETE_USER_IMAGE_SUCCESS,
  },
  async process({ action, api }) {
    return await api.deleteUserImage(action.userId, action.operation)
  }
})

export default [
  deleteUserImageLogic,
  getUserImageLogic,
  patchUserImageLogic,
  updateUserLogic,
  addUserLogic
]