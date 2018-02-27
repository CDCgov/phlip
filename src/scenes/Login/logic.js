import { createLogic } from 'redux-logic'
import * as types from './actionTypes'
import { createAvatarUrl } from 'utils/urlHelper'

export const loginLogic = createLogic({
  type: types.LOGIN_USER_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.LOGIN_USER_SUCCESS,
    failType: types.LOGIN_USER_FAIL
  },
  async process({ action, api }) {
    let user = {}, bookmarks = [], error = '', hasAvatarImage = false, avatarUrl = ''
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
      hasAvatarImage = await api.getUserPicture(user.id)
      avatarUrl = hasAvatarImage ? createAvatarUrl(user.id) : null
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
      avatarUrl
    }
  }
})

export default [
  loginLogic
]