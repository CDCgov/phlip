import * as types from './actionTypes'

// Dispatched when a user navigates to any question
export const getQuestionRequest = (questionId, projectId) => ({ type: types.GET_QUESTION_REQUEST, questionId, projectId })

// Dispatched when a user clicks the 'next question' button at the bottom of the page
export const getNextQuestion = (id, newIndex) => ({ type: types.GET_NEXT_QUESTION, id, newIndex })

// Dispatched when a user click the 'previous question' button at the bottom of the page
export const getPrevQuestion = (id, newIndex) => ({ type: types.GET_PREV_QUESTION, id, newIndex })

// Dispatched when coding component mounts to get coding scheme
export const getCodingOutlineRequest = (projectId, jurisdictionId) => ({
  type: types.GET_CODING_OUTLINE_REQUEST,
  projectId,
  jurisdictionId
})

// Dispatched when a user updates their answers for the question
export const answerQuestionRequest = (projectId, jurisdictionId, questionId, answerId, answerValue) => ({
  type: types.UPDATE_USER_ANSWER_REQUEST,
  projectId,
  jurisdictionId,
  questionId,
  answerId,
  answerValue
})

// Dispatched when a user updates their comment for a question
export const onChangeComment = (projectId, jurisdictionId, questionId, comment) => ({
  type: types.ON_CHANGE_COMMENT,
  projectId,
  jurisdictionId,
  questionId,
  comment
})

// Dispatched when a user updates their pincite for their answer for a question
export const onChangePincite = (projectId, jurisdictionId, questionId, answerId, pincite) => ({
  type: types.ON_CHANGE_PINCITE,
  projectId,
  jurisdictionId,
  questionId,
  answerId,
  pincite
})

// Dispatched when a user changes the category on a category question
export const onChangeCategory = (event, selection) => ({
  type: types.ON_CHANGE_CATEGORY,
  selection
})

// Dispatched when a user clicks the clear answer broom for a question
export const onClearAnswer = (projectId, jurisdictionId, questionId) => ({
  type: types.ON_CLEAR_ANSWER,
  questionId,
  projectId,
  jurisdictionId
})

// Dispatched when the Coding component unmounts
export const onCloseCodeScreen = () => ({ type: types.ON_CLOSE_CODE_SCREEN })

// Dispatched when the user selects a different jurisdiction in the jurisdiction dropdown
export const onJurisdictionChange = (event, jurisdictionsList) => ({
  type: types.ON_JURISDICTION_CHANGE,
  event,
  jurisdictionsList
})

// Dispatched when the user selects a different jurisdiction in the jurisdiction dropdown
export const getUserCodedQuestions = (projectId, jurisdictionId) => ({
  type: types.GET_USER_CODED_QUESTIONS_REQUEST,
  projectId,
  jurisdictionId
})

// Dispatched when the user changes any part of the question
export const updateEditedFields = projectId => ({ type: types.UPDATE_EDITED_FIELDS, projectId })

// Dispatched when a user selected a question from the navigator
export const onQuestionSelectedInNav = question => ({ type: types.ON_QUESTION_SELECTED_IN_NAV, question })

// Dispatched when a user clicks the 'Apply answer to all categories' button for a category question
export const applyAnswerToAll = (projectId, jurisdictionId, questionId) => ({
  type: types.APPLY_ANSWER_TO_ALL,
  projectId,
  jurisdictionId,
  questionId
})

// Dispatched when a user saves a green or yellow flag for a question in the 'flag this question' flag popover
export const onSaveFlag = (projectId, jurisdictionId, questionId, flagInfo) => ({
  type: types.ON_SAVE_FLAG,
  projectId,
  jurisdictionId,
  questionId,
  flagInfo
})

// Dispatched when a user saves a red flag for a question in the 'stop coding this question' popover
export const onSaveRedFlag = (projectId, questionId, flagInfo) => ({
  type: types.ON_SAVE_RED_FLAG,
  projectId,
  questionId,
  flagInfo
})