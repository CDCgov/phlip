import { createLogic } from 'redux-logic'
import { types } from './actions'

/**
 * Sends a request to add a user
 */
export const addUserLogic = createLogic({
  type: types.ADD_USER_REQUEST,
  latest: true,
  processOptions: {
    dispatchReturn: true,
    successType: types.ADD_USER_SUCCESS,
    failType: types.ADD_USER_FAIL
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
  async process({ action, api }, dispatch, done) {
    let updatedUser = {}
    try {
      if (action.selfUpdate) {
        const patchDocument = [
          { op: 'replace', path: '/firstName', value: action.user.firstName },
          { op: 'replace', path: '/lastName', value: action.user.lastName },
          { op: 'replace', path: '/avatar', value: action.user.avatar }
        ]
        updatedUser = await api.updateSelf(patchDocument, {}, { userId: action.user.id })
        console.log(updatedUser)
      } else {
        updatedUser = await api.updateUser(action.user, {}, { userId: action.user.id })
      }
      dispatch({ type: types.UPDATE_USER_SUCCESS, payload: { ...updatedUser, avatar: action.user.avatar } })
    } catch (e) {
      if (e.response.status === 304) {
        updatedUser = { ...action.user, avatar: action.user.avatar }
        dispatch({ type: types.UPDATE_USER_SUCCESS, payload: { ...updatedUser, avatar: action.user.avatar } })
      } else {
        dispatch({ type: types.UPDATE_USER_FAIL })
      }
    }
    done()
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
    action.selfUpdate
      ? await api.updateSelf(action.patchOperation, {}, { userId: action.userId })
      : await api.updateUserImage(action.patchOperation, {}, { userId: action.userId })
    return { avatar: action.patchOperation[0].value, userId: action.userId, user: action.user }
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
    successType: types.DELETE_USER_IMAGE_SUCCESS
  },
  async process({ action, api }) {
    action.selfUpdate
      ? await api.updateSelf(action.operation, {}, { userId: action.userId })
      : await api.deleteUserImage(action.operation, {}, { userId: action.userId })
    return { user: action.user, userId: action.userId, avatar: null }
  }
})

export default [
  deleteUserImageLogic,
  getUserImageLogic,
  patchUserImageLogic,
  updateUserLogic,
  addUserLogic
]
