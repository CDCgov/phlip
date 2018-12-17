import makeActionCreator from 'utils/makeActionCreator'
import { default as docListActions } from './components/DocumentList/actions'

export const types = {
  UPDATE_EDITED_FIELDS: 'UPDATE_EDITED_FIELDS',
  ON_CLOSE_SCREEN: 'ON_CLOSE_SCREEN',
  ON_CHANGE_JURISDICTION: 'ON_CHANGE_JURISDICTION',
  ON_SHOW_PAGE_LOADER: 'ON_SHOW_PAGE_LOADER',
  ON_SHOW_QUESTION_LOADER: 'ON_SHOW_QUESTION_LOADER',
  CLEAR_ANSWER_ERROR: 'CLEAR_ANSWER_ERROR',
  DISMISS_API_ALERT: 'DISMISS_API_ALERT',
  CHANGE_TOUCHED_STATUS: 'CHANGE_TOUCHED_STATUS',

  ON_QUESTION_SELECTED_IN_NAV: 'ON_QUESTION_SELECTED_IN_NAV',
  GET_NEXT_QUESTION: 'GET_NEXT_QUESTION',
  GET_PREV_QUESTION: 'GET_PREV_QUESTION',
  GET_QUESTION_REQUEST: 'GET_QUESTION_REQUEST',
  GET_QUESTION_SUCCESS: 'GET_QUESTION_SUCCESS',
  GET_QUESTION_FAIL: 'GET_QUESTION_FAIL',

  SAVE_USER_ANSWER_REQUEST: 'SAVE_USER_ANSWER_REQUEST',
  SAVE_USER_ANSWER_FAIL: 'SAVE_USER_ANSWER_FAIL',
  SAVE_USER_ANSWER_SUCCESS: 'SAVE_USER_ANSWER_SUCCESS',
  UPDATE_USER_ANSWER: 'UPDATE_USER_ANSWER',
  ON_CHANGE_COMMENT: 'ON_CHANGE_COMMENT',
  ON_CHANGE_PINCITE: 'ON_CHANGE_PINCITE',
  ON_CHANGE_CATEGORY: 'ON_CHANGE_CATEGORY',
  ON_APPLY_ANSWER_TO_ALL: 'ON_APPLY_ANSWER_TO_ALL',
  ON_CLEAR_ANSWER: 'ON_CLEAR_ANSWER',

  ADD_REQUEST_TO_QUEUE: 'ADD_REQUEST_TO_QUEUE',
  REMOVE_REQUEST_FROM_QUEUE: 'REMOVE_REQUEST_FROM_QUEUE',
  SEND_QUEUE_REQUESTS: 'SEND_QUEUE_REQUESTS',
  OBJECT_EXISTS: 'OBJECT_EXISTS',

  GET_APPROVED_DOCUMENTS_REQUEST: 'GET_APPROVED_DOCUMENTS_REQUEST',
  GET_APPROVED_DOCUMENTS_SUCCESS: 'GET_APPROVED_DOCUMENTS_SUCCESS',
  GET_APPROVED_DOCUMENTS_FAIL: 'GET_APPROVED_DOCUMENTS_FAIL',

  GET_CODING_OUTLINE_REQUEST: 'GET_CODING_OUTLINE_REQUEST',
  GET_CODING_OUTLINE_SUCCESS: 'GET_CODING_OUTLINE_SUCCESS',
  GET_CODING_OUTLINE_FAIL: 'GET_CODING_OUTLINE_FAIL',

  GET_VALIDATION_OUTLINE_REQUEST: 'GET_VALIDATION_OUTLINE_REQUEST',
  GET_VALIDATION_OUTLINE_SUCCESS: 'GET_VALIDATION_OUTLINE_SUCCESS',
  GET_VALIDATION_OUTLINE_FAIL: 'GET_VALIDATION_OUTLINE_FAIL',

  GET_USER_CODED_QUESTIONS_REQUEST: 'GET_USER_CODED_QUESTIONS_REQUEST',
  GET_USER_CODED_QUESTIONS_SUCCESS: 'GET_USER_CODED_QUESTIONS_SUCCESS',
  GET_USER_CODED_QUESTIONS_FAIL: 'GET_USER_CODED_QUESTIONS_FAIL',

  GET_USER_VALIDATED_QUESTIONS_REQUEST: 'GET_USER_VALIDATED_QUESTIONS_REQUEST',
  GET_USER_VALIDATED_QUESTIONS_SUCCESS: 'GET_USER_VALIDATED_QUESTIONS_SUCCESS',
  GET_USER_VALIDATED_QUESTIONS_FAIL: 'GET_USER_VALIDATED_QUESTIONS_FAIL',

  ON_SAVE_RED_FLAG_REQUEST: 'ON_SAVE_RED_FLAG_REQUEST',
  ON_SAVE_RED_FLAG_SUCCESS: 'ON_SAVE_RED_FLAG_SUCCESS',
  ON_SAVE_RED_FLAG_FAIL: 'ON_SAVE_RED_FLAG_FAIL',
  ON_SAVE_FLAG: 'ON_SAVE_FLAG',
  CLEAR_FLAG: 'CLEAR_FLAG',
  CLEAR_RED_FLAG: 'CLEAR_RED_FLAG',
  CLEAR_FLAG_SUCCESS: 'CLEAR_FLAG_SUCCESS',
  CLEAR_FLAG_FAIL: 'CLEAR_FLAG_FAIL',

  ON_TOGGLE_ANSWER_FOR_ANNO: 'ON_TOGGLE_ANSWER_FOR_ANNO'
}

/**
 * Makes an action creator function with action.type = type, scene = Coding or Validation and arguments from argNames.
 */
export const makeOtherActionCreator = (type, ...argNames) => {
  return function (...args) {
    let action = { type }
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index]
    })
    return action
  }
}

/**
 * All of the reusable actions for Coding and Validation
 */
let actions = {
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
    args: ['index']
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


for (let action in actions) {
  actions = { ...actions, [action]: makeOtherActionCreator(actions[action].type, ...actions[action].args) }
}

actions = {
  ...actions,
  getQuestionRequest: makeActionCreator(types.GET_QUESTION_REQUEST, 'questionId', 'projectId'),
  getCodingOutlineRequest: makeActionCreator(types.GET_CODING_OUTLINE_REQUEST, 'projectId', 'jurisdictionId', 'reducerName'),
  getUserCodedQuestions: makeActionCreator(types.GET_USER_CODED_QUESTIONS_REQUEST, 'projectId', 'jurisdictionId', 'page'),
  onSaveFlag: makeActionCreator(types.ON_SAVE_FLAG, 'projectId', 'jurisdictionId', 'questionId', 'flagInfo'),
  onSaveRedFlag: makeActionCreator(types.ON_SAVE_RED_FLAG_REQUEST, 'projectId', 'questionId', 'flagInfo'),
  getValidationOutlineRequest: makeActionCreator(types.GET_VALIDATION_OUTLINE_REQUEST, 'projectId', 'jurisdictionId'),
  getUserValidatedQuestionsRequest: makeActionCreator(types.GET_USER_VALIDATED_QUESTIONS_REQUEST, 'projectId', 'jurisdictionId', 'page'),
  clearFlag: makeActionCreator(types.CLEAR_FLAG, 'flagId', 'projectId', 'jurisdictionId', 'questionId'),
  clearRedFlag: makeActionCreator(types.CLEAR_RED_FLAG, 'flagId', 'questionId', 'projectId'),
  onToggleAnswerForAnno: makeActionCreator(types.ON_TOGGLE_ANSWER_FOR_ANNO, 'schemeAnswerId'),
  ...docListActions
}

export default actions