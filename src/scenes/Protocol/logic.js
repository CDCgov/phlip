import { createLogic } from 'redux-logic'
import * as types from './actionTypes'

const getProtocolLogic = createLogic({
  type: types.GET_PROTOCOL_REQUEST,
  async process({ getState, api, action }, dispatch, done) {
    const currentUserId = getState().data.user.currentUser.id
    try {
      const protocol = await api.getProtocol({}, {}, { projectId: action.projectId })
      let lockInfo = {}, error = {}

      try {
        lockInfo = await api.getProtocolLockInfo({}, {}, { projectId: action.projectId })
        if (lockInfo === undefined) {
          lockInfo = {}
        }
      } catch (e) {
        error.lockInfo =  'We couldn\'t determine if the protocol is checked out at this time.'
      }

      dispatch({
        type: types.GET_PROTOCOL_SUCCESS,
        payload: {
          protocol: protocol.text,
          lockInfo,
          lockedByCurrentUser: Object.keys(lockInfo).length > 0 ? lockInfo.userId === currentUserId : false,
          error
        }
      })
    } catch (error) {
      dispatch({
        type: types.GET_PROTOCOL_FAIL
      })
    }
    done()
  }
})

const saveProtocolLogic = createLogic({
  type: types.SAVE_PROTOCOL_REQUEST,
  async process({ getState, api, action }, dispatch, done) {
    const userId = getState().data.user.currentUser.id
    try {
      const resp = await api.saveProtocol({ text: action.protocol, userId }, {}, {
        projectId: action.projectId,
        userId
      })
      dispatch({
        type: types.SAVE_PROTOCOL_SUCCESS,
        payload: { ...resp }
      })
    } catch (error) {
      dispatch({
        type: types.SAVE_PROTOCOL_FAIL,
        payload: 'We couldn\'t save the protocol.'
      })
    }
    done()
  }
})

const lockProtocolLogic = createLogic({
  type: types.LOCK_PROTOCOL_REQUEST,
  async process({ api, action, getState }, dispatch, done) {
    const currentUserId = getState().data.user.currentUser.id
    try {
      const lockInfo = await api.lockProtocol({}, {}, { projectId: action.projectId, userId: currentUserId })
      dispatch({
        type: types.LOCK_PROTOCOL_SUCCESS,
        payload: {
          lockInfo,
          lockedByCurrentUser: Object.keys(lockInfo).length > 0 ? lockInfo.userId === currentUserId : false
        }
      })
    } catch (error) {
      dispatch({
        type: types.LOCK_PROTOCOL_FAIL,
        error: true,
        payload: 'We couldn\'t lock the protocol for editing.'
      })
    }
    done()
  }
})

const unlockProtocolLogic = createLogic({
  type: types.UNLOCK_PROTOCOL_REQUEST,
  async process({ api, action, getState }, dispatch, done) {
    const userId = getState().data.user.currentUser.id
    try {
      const unlockInfo = await api.unlockProtocol({}, {}, { projectId: action.projectId, userId })
      dispatch({
        type: types.UNLOCK_PROTOCOL_SUCCESS,
        payload: { ...unlockInfo }
      })
    } catch (error) {
      dispatch({
        type: types.UNLOCK_PROTOCOL_FAIL,
        error: true,
        payload: 'We couldn\'t release the lock for the protocol.'
      })
    }
    done()
  }
})

export default [
  getProtocolLogic,
  saveProtocolLogic,
  lockProtocolLogic,
  unlockProtocolLogic
]