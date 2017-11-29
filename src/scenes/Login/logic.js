import { createLogic } from 'redux-logic'
import * as types from './actionTypes'
import axios from 'axios'
import { login } from '../../services/authToken'
import { mockUsers } from '../../data/mockUsers'
import api from '../../services/api'

const mockToken = 'j4r98cm9rshsohxe8hskdfijd'


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