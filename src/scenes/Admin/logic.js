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
    let users = {}, userAvatar = '', updatedUsers = []
    try {
      users = await api.getUsers()
      for (let user of users) {
        try {
          let avatarUrl = await api.getUserImage(user.id)
          updatedUsers = [...updatedUsers, { ...user, avatarUrl }]
        } catch (e) {
          throw { error: `failed to retrieve image for userId: ${user.id}` }
        }
      }
    } catch (e) {
      throw { error: 'failed to get users' }

    }
    return updatedUsers
  }
})

export default [
  getUserLogic,
  ...addEditUserLogic
]