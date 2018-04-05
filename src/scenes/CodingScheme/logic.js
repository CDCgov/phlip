import { createLogic } from 'redux-logic'
import addEditQuestionLogic from './scenes/AddEditQuestion/logic'
import * as types from './actionTypes'

const getSchemeLogic = createLogic({
  type: types.GET_SCHEME_REQUEST,
  async process({ api, action, getState }, dispatch, done) {
    try {
      const scheme = await api.getScheme(action.id)
      const lockInfo = await api.getCodingSchemeLockInfo(action.id)
      const currentUserId = getState().data.user.currentUser.id
      dispatch({
        type: types.GET_SCHEME_SUCCESS,
        payload: { scheme, lockInfo, lockedByCurrentUser: lockInfo.userId === currentUserId }
      })
    } catch (error) {
      dispatch({
        type: types.GET_SCHEME_FAIL,
        error: true,
        payload: 'We couldn\'t get the project coding scheme.'
      })
    }
    done()
  }
})

const lockSchemeRequest = createLogic({
  type: types.LOCK_SCHEME_REQUEST,
  async process({ api, action, getState }, dispatch, done) {
    const userId = getState().data.user.currentUser.id
    try {
      const lockedInfo = await api.lockCodingScheme(action.id, userId)
      dispatch({
        type: types.LOCK_SCHEME_SUCCESS,
        payload: { ...lockedInfo }
      })
    } catch (error) {
      dispatch({
        type: types.LOCK_SCHEME_FAIL,
        error: true,
        payload: 'We couldn\'t lock the project coding scheme.'
      })
    }
    done()
  }
})

const unlockSchemeRequest = createLogic({
  type: types.UNLOCK_SCHEME_REQUEST,
  async process({ api, action, getState }, dispatch, done) {
    const userId = getState().data.user.currentUser.id
    try {
      const unlockInfo = await api.unlockCodingScheme(action.id, userId)
      dispatch({
          type: types.UNLOCK_SCHEME_SUCCESS,
        payload: { ...unlockInfo }
      })
    } catch (error) {
      dispatch({
        type: types.UNLOCK_SCHEME_FAIL,
        error: true,
        payload: 'We couldn\'t releast the lock for the project coding scheme.'
      })
    }
    done()
  }
})

const reorderSchemeLogic = createLogic({
  type: types.REORDER_SCHEME_REQUEST,
  latest: true,
  async process({ api, action, getState }, dispatch, done) {
    const outline = { userid: getState().data.user.currentUser.id, outline: getState().scenes.codingScheme.outline }
    try {
      await api.reorderScheme(outline, action.projectId)
      dispatch({
        type: types.REORDER_SCHEME_SUCCESS
      })
    } catch (error) {
      dispatch({
        type: types.REORDER_SCHEME_FAIL,
        payload: 'Uh-oh! We couldn\'t save the scheme reorder. Please try again later.',
        error: true
      })
    }
    done()
  }
})

export default [
  getSchemeLogic,
  reorderSchemeLogic,
  ...addEditQuestionLogic
]