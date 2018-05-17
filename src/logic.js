import { createLogic } from 'redux-logic'
import * as types from 'data/user/actionTypes'
import scenesLogic from 'scenes/logic'
import { logout } from 'services/authToken'
import dataLogic from 'data/user/logic'

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
  ...dataLogic,
  logoutLogic
]