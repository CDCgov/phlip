import makeActionCreatore from 'utils/makeActionCreator'
import { types as addEditTypes } from './scenes/AddEditQuestion/actions'

export const types = {
  GET_SCHEME_REQUEST: 'GET_SCHEME_REQUEST',
  GET_SCHEME_SUCCESS: 'GET_SCHEME_SUCCESS',
  GET_SCHEME_FAIL: 'GET_SCHEME_FAIL',
  REORDER_SCHEME_REQUEST: 'REORDER_SCHEME_REQUEST',
  REORDER_SCHEME_SUCCESS: 'REORDER_SCHEME_SUCCESS',
  REORDER_SCHEME_FAIL: 'REORDER_SCHEME_FAIL',
  DELETE_QUESTION_REQUEST: 'DELETE_QUESTION_REQUEST',
  DELETE_QUESTION_SUCCESS: 'DELETE_QUESTION_SUCCESS',
  DELETE_QUESTION_FAIL: 'DELETE_QUESTION_FAIL',
  LOCK_SCHEME_REQUEST: 'LOCK_SCHEME_REQUEST',
  LOCK_SCHEME_SUCCESS: 'LOCK_SCHEME_SUCCESS',
  LOCK_SCHEME_FAIL: 'LOCK_SCHEME_FAIL',
  UNLOCK_SCHEME_REQUEST: 'UNLOCK_SCHEME_REQUEST',
  UNLOCK_SCHEME_SUCCESS: 'UNLOCK_SCHEME_SUCCESS',
  UNLOCK_SCHEME_FAIL: 'UNLOCK_SCHEME_FAIL',
  HANDLE_QUESTION_TREE_CHANGE: 'HANDLE_QUESTION_TREE_CHANGE',
  TOGGLE_HOVER: 'TOGGLE_HOVER',
  ENABLE_HOVER: 'ENABLE_HOVER',
  DISABLE_HOVER: 'DISABLE_HOVER',
  UPDATE_TYPE: 'UPDATE_TYPE',
  CLEAR_STATE: 'CLEAR_STATE',
  SET_EMPTY_STATE: 'SET_EMPTY_STATE',
  RESET_ALERT_ERROR: 'RESET_ALERT_ERROR',
  CLOSE_CODING_SCHEME_LOCK_ALERT: 'CLOSE_CODING_SCHEME_LOCK_ALERT',
  ...addEditTypes
}

export default {
  getSchemeRequest: makeActionCreatore(types.GET_SCHEME_REQUEST, 'id'),
  lockCodingSchemeRequest: makeActionCreatore(types.LOCK_SCHEME_REQUEST, 'id'),
  unlockCodingSchemeRequest: makeActionCreatore(types.UNLOCK_SCHEME_REQUEST, 'id', 'userId'),
  updateQuestionTree: makeActionCreatore(types.HANDLE_QUESTION_TREE_CHANGE, 'questions'),
  toggleHover: makeActionCreatore(types.TOGGLE_HOVER, 'node', 'path', 'hover'),
  disableHover: makeActionCreatore(types.DISABLE_HOVER),
  enableHover: makeActionCreatore(types.ENABLE_HOVER),
  reorderSchemeRequest: makeActionCreatore(types.REORDER_SCHEME_REQUEST, 'projectId'),
  clearState: makeActionCreatore(types.CLEAR_STATE),
  setEmptyState: makeActionCreatore(types.SET_EMPTY_STATE),
  resetAlertError: makeActionCreatore(types.RESET_ALERT_ERROR),
  closeLockedAlert: makeActionCreatore(types.CLOSE_CODING_SCHEME_LOCK_ALERT),
  deleteQuestionRequest: makeActionCreatore(types.DELETE_QUESTION_REQUEST, 'projectId', 'questionId', 'path')
}
