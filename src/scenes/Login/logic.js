import { createLogic } from 'redux-logic'
import * as types from './actionTypes'

export const loginLogic = createLogic({
  type: types.LOGIN_USER_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.LOGIN_USER_SUCCESS,
    failType: types.LOGIN_USER_FAIL
  },
  async process({ action, api }) {
    let user = {}, bookmarks = [], error = '', avatar = ''
    try {
      user = await api.login(action.credentials)
    } catch (e) {
      throw { error: 'failed login' }
    }

    try {
      bookmarks = await api.getUserBookmarks(user.id)
    } catch (e) {
      error = 'could not get bookmarks'
    }

    try {
      avatar = await api.getUserImage(user.id)
    } catch (e) {
      error = 'failed to get avatar image'
    }

    return {
      ...user,
      bookmarks: bookmarks.reduce((arr, project) => {
        arr.push(project.projectId)
        return arr
      }, []),
      error,
      avatar
    }
  }
})

export default [
  loginLogic
]