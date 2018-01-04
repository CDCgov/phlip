import { createLogic } from 'redux-logic'
import * as types from './actionTypes'

const getSchemeLogic = createLogic({
  type: types.GET_SCHEME_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_SCHEME_SUCCESS
  },
  async process({ api, action }) {
    return await api.getScheme(action.id)
  }
})

export default [
  getSchemeLogic
]