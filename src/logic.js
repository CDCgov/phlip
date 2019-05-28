/**
 * This collects all of the logic through the application into one array that is passed to redux-logic middleware.
 */
import { createLogic } from 'redux-logic'
import { types } from 'data/users/actions'
import scenesLogic from 'scenes/logic'
import dataLogic from 'data/logic'
import { logout } from 'services/authToken'
import { persistor } from 'services/store'
import axios from 'axios'

/**
 * Logic for when the user logs out. Flushes the state calls logout from authToken service
 */
const logoutLogic = createLogic({
  type: types.LOGOUT_USER,
  processOptions: {
    dispatchReturn: false
  },
  async process({ action, api }, dispatch, done) {
    logout()
    // if (APP_IS_SAML_ENABLED === '1') {
    samsLogout(api)
    //location.href='/auth/logout'
    // }

    dispatch({ type: types.FLUSH_STATE, isLogout: true })
    await persistor.flush()
    await persistor.purge()
    done()
  }
})

const samsLogout = async (api) => {
  try {
    axios.get(`/auth/logout`)
      .then(res => {
        const result = res.data
        console.log(result)
        return result
      })
    //let logoutResult = await api.samsLogout({}, {}, {})
    //return logoutResult

  } catch (err) {
    return err
  }
}

export default [
  ...dataLogic,
  ...scenesLogic,
  logoutLogic
]
