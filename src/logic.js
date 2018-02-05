import { createLogic } from 'redux-logic'
import * as types from 'data/user/actionTypes'
import scenesLogic from 'scenes/logic'

const logoutLogic = createLogic({
  type: types.LOGOUT_USER,
  processOptions: {
    dispatchReturn: false,
  },
  process({ api }, dispatch, done) {
    return api.logoutUser().then(() => {
      dispatch({ type: types.FLUSH_STATE })
    }).then(() => done())
  }
})

export default [
  ...scenesLogic,
  logoutLogic
]