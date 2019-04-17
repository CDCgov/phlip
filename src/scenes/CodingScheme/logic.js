/**
 * This is all of the redux-logic for the CodingScheme scene.
 */

import { createLogic } from 'redux-logic'
import addEditQuestionLogic from './scenes/AddEditQuestion/logic'
import { removeNodeAtPath } from 'react-sortable-tree'
import { questionsToOutline, getNodeKey } from 'scenes/CodingScheme/reducer'
import * as types from './actionTypes'

/**
 * Sends a request to the API to get the coding scheme for project ID: action.id. Also gets the lock information if any
 * on the coding scheme.
 */
const getSchemeLogic = createLogic({
  type: types.GET_SCHEME_REQUEST,
  async process({ api, action, getState }, dispatch, done) {
    try {
      const scheme = await api.getScheme({}, {}, { projectId: action.id })
      let lockInfo = {}, error = {}

      try {
        lockInfo = await api.getCodingSchemeLockInfo({}, {}, { projectId: action.id })
        if (lockInfo === '') {
          lockInfo = {}
        }
      } catch (e) {
        error.lockInfo = 'We couldn\'t determine if the coding scheme is checked out at this time.'
      }
      const currentUserId = getState().data.user.currentUser.id
      dispatch({
        type: types.GET_SCHEME_SUCCESS,
        payload: {
          scheme,
          lockInfo,
          lockedByCurrentUser: Object.keys(lockInfo).length > 0 ? lockInfo.userId === currentUserId : false,
          error
        }
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

/**
 * Sends a request to check out / lock the coding scheme for project ID: action.id and userId
 */
const lockSchemeLogic = createLogic({
  type: types.LOCK_SCHEME_REQUEST,
  async process({ api, action, getState }, dispatch, done) {
    const currentUserId = getState().data.user.currentUser.id
    try {
      const lockInfo = await api.lockCodingScheme({}, {}, { userId: currentUserId, projectId: action.id })
      dispatch({
        type: types.LOCK_SCHEME_SUCCESS,
        payload: {
          lockInfo,
          lockedByCurrentUser: Object.keys(lockInfo).length > 0 ? lockInfo.userId === currentUserId : false
        }
      })
    } catch (error) {
      dispatch({
        type: types.LOCK_SCHEME_FAIL,
        error: true,
        payload: 'We couldn\'t lock the coding scheme.  Please try again later'
      })
    }
    done()
  }
})

/**
 * Sends a request to unlock / check in the coding scheme
 */
const unlockSchemeLogic = createLogic({
  type: types.UNLOCK_SCHEME_REQUEST,
  async process({ api, action, getState }, dispatch, done) {
    const userId = getState().data.user.currentUser.id
    try {
      const unlockInfo = await api.unlockCodingScheme({}, {}, { projectId: action.id, userId })
      dispatch({
        type: types.UNLOCK_SCHEME_SUCCESS,
        payload: { ...unlockInfo }
      })
    } catch (error) {
      dispatch({
        type: types.UNLOCK_SCHEME_FAIL,
        error: true,
        payload: 'We couldn\'t release the lock for the project coding scheme.'
      })
    }
    done()
  }
})

/**
 * Sends a request to reorder the coding scheme, new order is in state.scenes.codingScheme.outline
 */
const reorderSchemeLogic = createLogic({
  type: types.REORDER_SCHEME_REQUEST,
  latest: true,
  async process({ api, action, getState }, dispatch, done) {
    const outline = { userid: getState().data.user.currentUser.id, outline: getState().scenes.codingScheme.outline }
    try {
      await api.reorderScheme(outline, {}, { projectId: action.projectId })
      dispatch({
        type: types.REORDER_SCHEME_SUCCESS
      })
    } catch (error) {
      dispatch({
        type: types.REORDER_SCHEME_FAIL,
        payload: 'We couldn\'t save the scheme reorder.',
        error: true
      })
    }
    done()
  }
})

/**
 * Sends a request to delete the question with questionId = aciton.questionId
 */
const deleteQuestionLogic = createLogic({
  type: types.DELETE_QUESTION_REQUEST,
  async process({ api, action, getState }, dispatch, done) {
    try {
      await api.deleteQuestion({}, {}, { projectId: action.projectId, questionId: action.questionId })
      const updatedQuestions = removeNodeAtPath({
        treeData: getState().scenes.codingScheme.questions,
        path: action.path,
        getNodeKey
      })
      const updatedOutline = questionsToOutline(updatedQuestions)

      dispatch({
        type: types.DELETE_QUESTION_SUCCESS,
        payload: {
          updatedQuestions,
          updatedOutline
        }
      })

      dispatch({
        type: types.REORDER_SCHEME_REQUEST,
        projectId: action.projectId
      })

    } catch (error) {
      dispatch({
        type: types.DELETE_QUESTION_FAIL,
        error: true,
        payload: 'We could\'t delete the question.'
      })
    }
    done()
  }
})

export default [
  getSchemeLogic,
  reorderSchemeLogic,
  lockSchemeLogic,
  unlockSchemeLogic,
  deleteQuestionLogic,
  ...addEditQuestionLogic
]