import { createLogic } from 'redux-logic'
import * as types from './actionTypes'

export const loginLogic = createLogic({ //Will remove/comment out when we go to production
  type: types.LOGIN_USER_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.LOGIN_USER_SUCCESS,
    failType: types.LOGIN_USER_FAIL
  },
  async process({ action, api }) {
    let user = {}, bookmarks = [], error = ''
    try {
      user = await api.login(action.credentials)
    } catch (e) {
      throw { error: 'failed login' }
    }
    try {
      bookmarks = await api.getUserBookmarks(user.id, user.token.value)
    } catch (e) {
      error = 'could not get bookmarks'
    }

    return {
      ...user,
      bookmarks: bookmarks.reduce((arr, project) => {
        arr.push(project.projectId)
        return arr
      }, []),
      error
    }
  }
})

export const checkPivUserLogic = createLogic({
  type: types.CHECK_PIV_USER_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.CHECK_PIV_USER_SUCCESS,
    failType: types.CHECK_PIV_USER_FAIL
  },
  async process({ action, api }) {
    let user = {}, bookmarks = [], error = ''
    try {
      user = await api.checkPivUser(action.tokenObj)
    } catch (e) {
      throw { error: 'failed to check piv user' }
    }

    try {
      bookmarks = await api.getUserBookmarks(user.id, user.token.value)
    } catch (e) {
      error = 'could not get bookmarks'
    }

    return {
      ...user,
      bookmarks: bookmarks.reduce((arr, project) => {
        arr.push(project.projectId)
        return arr
      }, []),
      error
    }
  }
})

export default [
  loginLogic,
  checkPivUserLogic
]
