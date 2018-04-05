import { createLogic } from 'redux-logic'
import * as types from './actionTypes'

const getProtocolLogic = createLogic({
  type: types.GET_PROTOCOL_REQUEST,
  async process({ getState, api, action }, dispatch, done) {
    const currentUserId = getState().data.user.currentUser.id
    try {
      const protocol = await api.getProtocol(action.projectId)
      const lockInfo = await api.getProtocolLockInfo(action.projectId)
      dispatch({
        type: types.GET_PROTOCOL_SUCCESS,
        payload: {
          protocol,
          lockInfo,
          lockedByCurrentUser: Object.keys(lockInfo).length > 0 ? lockInfo.userId === currentUserId : false
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
    try {
      const resp = await api.saveProtocol(action.projectId, getState().data.user.currentUser.id, action.protocol)
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
      const lockInfo = await api.lockProtocol(action.id, currentUserId)
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
      const unlockInfo = await api.unlockProtocol(action.id, userId)
      dispatch({
        type: types.UNLOCK_PROTOCOL_SUCCESS,
        payload: { ...unlockInfo }
      })
    } catch (error) {
      dispatch({
        type: types.UNLOCK_PROTOCOL_FAIL,
        error: true,
        payload: 'We couldn\'t releast the lock for the protocol.'
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