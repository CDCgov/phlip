/**
 * This collects all of the logic through the application into one array that is passed to redux-logic middleware.
 */

import { createLogic } from 'redux-logic'
import * as types from 'data/user/actionTypes'
import scenesLogic from 'scenes/logic'
import { logout } from 'services/authToken'

/**
 * Logic for when the user logs out. Flushes the state calls logout from authToken service
 */
const logoutLogic = createLogic({
  type: types.LOGOUT_USER,
  processOptions: {
    dispatchReturn: false
  },
  process({ api }, dispatch, done) {
    logout()
    dispatch({ type: types.FLUSH_STATE })
    done()
  }
})

export default [
  ...scenesLogic,
  logoutLogic
]