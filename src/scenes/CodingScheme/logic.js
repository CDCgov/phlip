import { createLogic } from 'redux-logic'
import addEditQuestionLogic from './scenes/AddEditQuestion/logic'
import { removeNodeAtPath } from 'react-sortable-tree'
import { questionsToOutline, getNodeKey } from 'scenes/CodingScheme/reducer'
import * as types from './actionTypes'

const getSchemeLogic = createLogic({
  type: types.GET_SCHEME_REQUEST,
  async process({ api, action, getState }, dispatch, done) {
    try {
      const scheme = await api.getScheme(action.id)
      let lockInfo = {}

      try {
        lockInfo = await api.getCodingSchemeLockInfo(action.id)
      } catch (error) {
        if (error.response.status === 404) {
          lockInfo = {}
        }
      }
      const currentUserId = getState().data.user.currentUser.id
      dispatch({
        type: types.GET_SCHEME_SUCCESS,
        payload: {
          scheme,
          lockInfo,
          lockedByCurrentUser: Object.keys(lockInfo).length > 0 ? lockInfo.userId === currentUserId : false
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

const lockSchemeLogic = createLogic({
  type: types.LOCK_SCHEME_REQUEST,
  async process({ api, action, getState }, dispatch, done) {
    const currentUserId = getState().data.user.currentUser.id
    try {
      const lockInfo = await api.lockCodingScheme(action.id, currentUserId)
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
        payload: 'We couldn\'t lock the project coding scheme.'
      })
    }
    done()
  }
})

const unlockSchemeLogic = createLogic({
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
        payload: 'We couldn\'t release the lock for the project coding scheme.'
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
        payload: 'We couldn\'t save the scheme reorder. Please try again later.',
        error: true
      })
    }
    done()
  }
})

const deleteQuestionLogic = createLogic({
  type: types.DELETE_QUESTION_REQUEST,
  async process({ api, action, getState }, dispatch, done) {
    try {
      const response = await api.deleteQuestion(action.projectId, action.questionId)
      const updatedQuestions = removeNodeAtPath({
        treeData: getState().scenes.codingScheme.questions,
        path: action.path,
        getNodeKey
      })
      const updatedOutline = questionsToOutline(updatedQuestions)

      dispatch({
        type: types.DELETE_QUESITON_SUCCESS,
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
        payload: 'We could\'t delete the question. Please try again later.'
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