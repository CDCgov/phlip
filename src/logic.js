import { createLogic } from 'redux-logic'
import projectLogic from 'scenes/Home/logic'
import userLogic from 'scenes/Admin/logic'
import loginLogic from 'scenes/Login/logic'
import * as types from 'scenes/Login/actionTypes'
import { logout } from 'services/authToken'
import { persistor } from 'services/store'

const logoutLogic = createLogic({
  type: types.LOGOUT_USER,
  processOptions: {
    dispatchReturn: false
  },
  process({ api }, dispatch, done) {
    logout()
    persistor.purge()
    return done()
  }
})

export default [
  ...projectLogic,
  ...userLogic,
  ...loginLogic,
  logoutLogic
]