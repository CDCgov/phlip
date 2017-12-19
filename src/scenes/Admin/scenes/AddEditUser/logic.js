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

export default [
  updateUserLogic,
  addUserLogic
]