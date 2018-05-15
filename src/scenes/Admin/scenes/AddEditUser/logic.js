import { createLogic } from 'redux-logic'
import * as types from './actionTypes'

export const addUserLogic = createLogic({
  type: types.ADD_USER_REQUEST,
  latest: true,
  processOptions: {
    dispatchReturn: true,
    successType: types.ADD_USER_SUCCESS
  },
  async process({ action, api }) {
    return await api.addUser(action.user, {}, {})
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
    const updatedUser = await api.updateUser(action.user, {}, { userId: action.user.id })
    return { ...updatedUser, avatar: action.user.avatar }
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
    const avatar = await api.updateUserImage(action.patchOperation, {}, { userId: action.userId })
    return { avatar: action.patchOperation[0].value, userId: action.userId }
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
    return await api.getUserImage({}, {}, { userId: action.userId })
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
    return await api.deleteUserImage(action.operation, {}, { userId: action.userId })
  }
})

export default [
  deleteUserImageLogic,
  getUserImageLogic,
  patchUserImageLogic,
  updateUserLogic,
  addUserLogic
]