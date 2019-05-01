/**
 * This collects all of the logic through the application into one array that is passed to redux-logic middleware.
 */
import { createLogic } from 'redux-logic'
import { types } from 'data/users/actions'
import scenesLogic from 'scenes/logic'
import dataLogic from 'data/logic'
import { logout } from 'services/authToken'
import { persistor } from 'services/store'

/**
 * Logic for when the user logs out. Flushes the state calls logout from authToken service
 */
const logoutLogic = createLogic({
  type: types.LOGOUT_USER,
  processOptions: {
    dispatchReturn: false
  },
  async process({ action }, dispatch, done) {
    logout()
    dispatch({ type: types.FLUSH_STATE, isLogout: true })
    await persistor.flush()
    await persistor.purge()
    done()
  }
})

export default [
  ...dataLogic,
  ...scenesLogic,
  logoutLogic
]
