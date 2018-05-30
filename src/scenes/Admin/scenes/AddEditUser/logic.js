import { createLogic } from 'redux-logic'
import * as types from './actionTypes'

/**
 * Sends a request to add a user
 */
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

/**
 * Sends a request to update the user with userId: action.user.id
 */
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

/**
 * Sends a PATCH request to update the avatar for the user with userId = action.userId
 */
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

/**
 * Sends a request to get the avatar for a user with userId = action.userId
 */
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

/**
 * Sends a request to delete the avatar image for a user with userId = action.userId
 */
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