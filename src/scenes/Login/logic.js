import { createLogic } from 'redux-logic'
import * as types from './actionTypes'
import api from '../../services/api'

export const loginLogic = createLogic({
  type: types.LOGIN_USER_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.LOGIN_USER_SUCCESS
  },
  async process({ action, history }) {
    return await api.login(action.credentials)
  }
})

export default [
  loginLogic
]