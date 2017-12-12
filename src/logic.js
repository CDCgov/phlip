import { createLogic } from 'redux-logic'
import projectLogic from 'scenes/Home/logic'
import userLogic from 'scenes/Admin/logic'
import loginLogic from 'scenes/Login/logic'
import * as types from 'data/user/actionTypes'

const logoutLogic = createLogic({
  type: types.LOGOUT_USER,
  processOptions: {
    dispatchReturn: false
  },
  async process({ api }, dispatch, done) {
    return await api.logoutUser().then(() => {
      dispatch({ type: 'FLUSH_STATE' })
    }).then(() => done())
  }
})

export default [
  ...projectLogic,
  ...userLogic,
  ...loginLogic,
  logoutLogic
]