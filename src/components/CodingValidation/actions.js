import { default as documentListActions } from './DocumentList/actions'

export const types = {
  UPDATE_USER_ANSWER: 'UPDATE_USER_ANSWER',

  ON_CHANGE_COMMENT: 'ON_CHANGE_COMMENT',
  ON_CHANGE_PINCITE: 'ON_CHANGE_PINCITE',
  ON_APPLY_ANSWER_TO_ALL: 'ON_APPLY_ANSWER_TO_ALL',

  UPDATE_EDITED_FIELDS: 'UPDATE_EDITED_FIELDS',
  ON_CLOSE_SCREEN: 'ON_CLOSE_SCREEN',

  ON_CHANGE_JURISDICTION: 'ON_CHANGE_JURISDICTION',
  ON_CHANGE_CATEGORY: 'ON_CHANGE_CATEGORY',
  ON_CLEAR_ANSWER: 'ON_CLEAR_ANSWER',

  ON_QUESTION_SELECTED_IN_NAV: 'ON_QUESTION_SELECTED_IN_NAV',
  GET_NEXT_QUESTION: 'GET_NEXT_QUESTION',
  GET_PREV_QUESTION: 'GET_PREV_QUESTION',
  GET_QUESTION_SUCCESS: 'GET_QUESTION_SUCCESS',
  GET_QUESTION_FAIL: 'GET_QUESTION_FAIL',

  CLEAR_ANSWER_ERROR: 'CLEAR_ANSWER_ERROR',
  DISMISS_API_ALERT: 'DISMISS_API_ALERT',

  ON_SHOW_PAGE_LOADER: 'ON_SHOW_PAGE_LOADER',
  ON_SHOW_QUESTION_LOADER: 'ON_SHOW_QUESTION_LOADER',

  SAVE_USER_ANSWER_REQUEST: 'SAVE_USER_ANSWER_REQUEST',
  SAVE_USER_ANSWER_FAIL: 'SAVE_USER_ANSWER_FAIL',
  SAVE_USER_ANSWER_SUCCESS: 'SAVE_USER_ANSWER_SUCCESS',

  ADD_REQUEST_TO_QUEUE: 'ADD_REQUEST_TO_QUEUE',
  REMOVE_REQUEST_FROM_QUEUE: 'REMOVE_REQUEST_FROM_QUEUE',
  SEND_QUEUE_REQUESTS: 'SEND_QUEUE_REQUESTS',

  CHANGE_TOUCHED_STATUS: 'CHANGE_TOUCHED_STATUS',
  OBJECT_EXISTS: 'OBJECT_EXISTS',

  GET_APPROVED_DOCUMENTS_REQUEST: 'GET_APPROVED_DOCUMENTS_REQUEST',
  GET_APPROVED_DOCUMENTS_SUCCESS: 'GET_APPROVED_DOCUMENTS_SUCCESS',
  GET_APPROVED_DOCUMENTS_FAIL: 'GET_APPROVED_DOCUMENTS_FAIL'
}

const makeActionTypes = scene => {
  const sceneTypes = {}

  for (let typeName in types) {
    sceneTypes[typeName] = `${types[typeName]}_${scene}`
  }

  return sceneTypes
}

/**
 * Makes an action creator function with action.type = type, scene = Coding or Validation and arguments from argNames.
 */
const makeActionCreator = (type, scene, ...argNames) => {
  return function(...args) {
    let action = { type: `${type}_${scene}` }
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index]
    })
    return action
  }
}

/**
 * All of the reusable actions for Coding and Validation
 */
export const actions = {
  getNextQuestion: {
    type: types.GET_NEXT_QUESTION,
    args: ['id', 'newIndex', 'projectId', 'jurisdictionId', 'page']
  },
  getPrevQuestion: {
    type: types.GET_PREV_QUESTION,
    args: ['id', 'newIndex', 'projectId', 'jurisdictionId', 'page']
  },
  onQuestionSelectedInNav: {
    type: types.ON_QUESTION_SELECTED_IN_NAV,
    args: ['question', 'projectId', 'jurisdictionId', 'page']
  },
  applyAnswerToAll: {
    type: types.ON_APPLY_ANSWER_TO_ALL,
    args: ['projectId', 'jurisdictionId', 'questionId', 'page']
  },
  updateUserAnswer: {
    type: types.UPDATE_USER_ANSWER,
    args: ['projectId', 'jurisdictionId', 'questionId', 'answerId', 'answerValue']
  },
  onChangeComment: {
    type: types.ON_CHANGE_COMMENT,
    args: ['projectId', 'jurisdictionId', 'questionId', 'comment']
  },
  onChangePincite: {
    type: types.ON_CHANGE_PINCITE,
    args: ['projectId', 'jurisdictionId', 'questionId', 'answerId', 'pincite']
  },
  onChangeCategory: {
    type: types.ON_CHANGE_CATEGORY,
    args: ['selection']
  },
  updateEditedFields: {
    type: types.UPDATE_EDITED_FIELDS,
    args: ['projectId']
  },
  onCloseScreen: {
    type: types.ON_CLOSE_SCREEN,
    args: []
  },
  clearAnswerError: {
    type: types.CLEAR_ANSWER_ERROR,
    args: []
  },
  dismissApiAlert: {
    type: types.DISMISS_API_ALERT,
    args: ['errorType']
  },
  onClearAnswer: {
    type: types.ON_CLEAR_ANSWER,
    args: ['projectId', 'jurisdictionId', 'questionId']
  },
  onChangeJurisdiction: {
    type: types.ON_CHANGE_JURISDICTION,
    args: ['event', 'jurisdictionsList']
  },
  showQuestionLoader: {
    type: types.ON_SHOW_QUESTION_LOADER,
    args: []
  },
  showPageLoader: {
    type: types.ON_SHOW_PAGE_LOADER,
    args: []
  },
  saveUserAnswerRequest: {
    type: types.SAVE_USER_ANSWER_REQUEST,
    args: ['projectId', 'jurisdictionId', 'questionId', 'selectedCategoryId', 'page']
  },
  addRequestToQueue: {
    type: types.ADD_REQUEST_TO_QUEUE,
    args: ['payload', 'page']
  },
  changeTouchedStatus: {
    type: types.CHANGE_TOUCHED_STATUS,
    args: []
  }
}

export { makeActionCreator, makeActionTypes }