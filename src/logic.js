import { createLogic } from 'redux-logic'
import projectLogic from 'scenes/Home/logic'
import userLogic from 'scenes/Admin/logic'
import loginLogic from 'scenes/Login/logic'
import * as types from 'data/user/actionTypes'

const logoutLogic = createLogic({
  type: types.LOGOUT_USER,
  processOptions: {
    dispatchReturn: true,
    successType: 'FLUSH_STATE'
  },
  async process({ api }) {
    return await api.logoutUser()
  }
})

export default [
  ...projectLogic,
  ...userLogic,
  ...loginLogic,
  logoutLogic
]