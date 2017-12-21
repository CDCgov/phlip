import { createLogic } from 'redux-logic'
import projectLogic from 'scenes/Home/logic'
import userLogic from 'scenes/Admin/logic'
import loginLogic from 'scenes/Login/logic'
import * as types from 'data/user/actionTypes'

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
  ...projectLogic,
  ...userLogic,
  ...loginLogic,
  logoutLogic
]