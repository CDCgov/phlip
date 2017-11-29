import { createLogic } from 'redux-logic'
import * as types from './actionTypes'
import addEditUserLogic from './scenes/AddEditUser/logic'

export const getUserLogic = createLogic({
  type: types.GET_USERS_REQUEST,
  latest: true,
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_USERS_SUCCESS
  },
  async process({ api }) {
    return await api.getUsers()
  }
})

export default [
  getUserLogic,
  ...addEditUserLogic
]