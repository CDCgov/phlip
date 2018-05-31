import { createLogic } from 'redux-logic'
import * as types from './actionTypes'
import { login } from 'services/authToken'

/**
 * Logic for basic authentication (the email form) -- only used in development mode. Gets the bookmarks for the user if
 * the login is successful
 */
export const basicLoginLogic = createLogic({
  type: types.LOGIN_USER_REQUEST,
  async process({ action, api }, dispatch, done) {
    let user = {}, bookmarks = [], error = ''

    try {
      user = await api.login(action.credentials, {}, {})
      await login(user.token.value)

      try {
        bookmarks = await getBookmarks(api, user.id)
      } catch (e) {
        error = 'could not get bookmarks'
      }

      dispatch({
        type: types.LOGIN_USER_SUCCESS,
        payload: {
          ...user,
          bookmarks,
          error
        }
      })

    } catch (e) {
      dispatch({
        type: types.LOGIN_USER_FAIL,
        payload: 'Login failed. Please check email.'
      })
    }
    done()
  }
})

/**
 * Logic for PIV card authentication. This logic is invoked after the user is returned from the SAMS login page. A request
 * is sent to the backend to check the status of the user then log them in. Gets the bookmarks for the user if login is
 * successful
 */
export const checkPivUserLogic = createLogic({
  type: types.CHECK_PIV_USER_REQUEST,
  async process({ action, api }, dispatch, done) {
    let user = {}, bookmarks = [], error = ''
    try {
      user = await api.checkPivUser({ email: action.tokenObj.decodedToken.userEmail }, {}, { tokenObj: action.tokenObj })
      await login(user.token.value)

      try {
        bookmarks = await getBookmarks(api, user.id)
      } catch (e) {
        error = 'could not get bookmarks'
      }

      dispatch({
        type: types.CHECK_PIV_USER_SUCCESS,
        payload: {
          ...user,
          bookmarks,
          error
        }
      })
    } catch (e) {
      dispatch({
        type: types.CHECK_PIV_USER_FAIL,
        payload: 'Login failed. Please contact your administrator.'
      })
    }
    done()
  }
})

/**
 * Sends a request to the API to get the project bookmarks for the user with id : userID
 *
 * @param {Object} api
 * @param {Number} userId
 * @returns {Array}
 */
const getBookmarks = async (api, userId) => {
  let bookmarks = await api.getUserBookmarks({}, {}, { userId })
  bookmarks = bookmarks.reduce((arr, project) => {
    arr.push(project.projectId)
    return arr
  }, [])

  return bookmarks
}

let loginLogic = [checkPivUserLogic]

/**
 * If the environment is not prduction, then basicLoginLogic is used
 */
if (!process.env.API_HOST) {
  loginLogic = [...loginLogic, basicLoginLogic]
}

export default loginLogic
