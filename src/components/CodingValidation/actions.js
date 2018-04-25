/*
  This file is all of the action creators that are used by both Coding and Validation
 */
import * as types from './actionTypes'

const makeActionCreator = (type, scene, ...argNames) => {
  return function (...args) {
    let action = { type: `${type}_${scene}` }
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index]
    })
    return action
  }
}

// Dispatched when a user clicks the 'next question' button at the bottom of the page
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
    args: ['projectId', 'jurisdictionId', 'questionId']
  },
  updateUserAnswer: {
    type: types.UPDATE_USER_ANSWER,
    args: ['projectId', 'jurisdictionId', 'questionId', 'answerId', 'answerValue' ]
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
    args: ['projectId', 'jurisdictionId', 'questionId', 'selectedCategoryId']
  },
  addRequestToQueue: {
    type: types.ADD_REQUEST_TO_QUEUE,
    args: ['payload']
  },
  changeTouchedStatus: {
    type: types.CHANGE_TOUCHED_STATUS,
    args: []
  }
}

export { makeActionCreator }