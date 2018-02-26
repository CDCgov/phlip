import { createLogic } from 'redux-logic'
import * as types from './actionTypes'

const getProtocolLogic = createLogic({
  type: types.GET_PROTOCOL_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_PROTOCOL_SUCCESS,
    failType: types.GET_PROTOCOL_FAIL
  },
  async process({ getState, api, action }) {
    return await api.getProtocol(action.projectId)
  }
})

const saveProtocolLogic = createLogic({
  type: types.SAVE_PROTOCOL_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.SAVE_PROTOCOL_SUCCESS,
    failType: types.SAVE_PROTOCOL_FAIL
  },
  async process({ getState, api, action }) {
    return await api.saveProtocol(action.projectId, getState().data.user.currentUser.id, action.protocol)
  }
})

export default [
  getProtocolLogic,
  saveProtocolLogic
]