/*
  This file is all of the action creators that are used by both Coding and Validation
 */
import * as types from './actionTypes'

// Dispatched when a user clicks the 'next question' button at the bottom of the page
export const getNextQuestion = (id, newIndex, projectId, jurisdictionId, reducerName) => ({
  type: types.GET_NEXT_QUESTION,
  id,
  newIndex,
  projectId,
  jurisdictionId,
  reducerName
})

// Dispatched when a user click the 'previous question' button at the bottom of the page
export const getPrevQuestion = (id, newIndex, projectId, jurisdictionId, reducerName) => ({
  type: types.GET_PREV_QUESTION,
  id,
  newIndex,
  projectId,
  jurisdictionId,
  reducerName
})

// Dispatched when a user selected a question from the navigator
export const onQuestionSelectedInNav = (question, projectId, jurisdictionId, reducerName) => ({
  type: types.ON_QUESTION_SELECTED_IN_NAV,
  question,
  projectId,
  jurisdictionId,
  reducerName
})

// Dispatched when a user clicks the 'Apply answer to all categories' button for a category question
export const applyAnswerToAll = (projectId, jurisdictionId, questionId, reducerName) => ({
  type: types.ON_APPLY_ANSWER_TO_ALL,
  projectId,
  jurisdictionId,
  questionId,
  reducerName
})

// Dispatched when a user updates their answers for the question
export const answerQuestionRequest = (projectId, jurisdictionId, questionId, answerId, answerValue, reducerName) => ({
  type: types.UPDATE_USER_ANSWER_REQUEST,
  projectId,
  jurisdictionId,
  questionId,
  answerId,
  answerValue,
  reducerName
})

// Dispatched when a user updates their comment for a question
export const onChangeComment = (projectId, jurisdictionId, questionId, comment, reducerName) => ({
  type: types.ON_CHANGE_COMMENT,
  projectId,
  jurisdictionId,
  questionId,
  comment,
  reducerName
})

// Dispatched when a user updates their pincite for their answer for a question
export const onChangePincite = (projectId, jurisdictionId, questionId, answerId, pincite, reducerName) => ({
  type: types.ON_CHANGE_PINCITE,
  projectId,
  jurisdictionId,
  questionId,
  answerId,
  pincite,
  reducerName
})

// Dispatched when a user changes the category on a category question
export const onChangeCategory = (selection, reducerName) => ({
  type: types.ON_CHANGE_CATEGORY,
  selection,
  reducerName
})

// Dispatched when the user selects a different jurisdiction in the jurisdiction dropdown
export const onJurisdictionChange = (event, jurisdictionsList, reducerName) => ({
  type: types.ON_CHANGE_JURISDICTION,
  event,
  jurisdictionsList,
  reducerName
})

// Dispatched when a user clicks the clear answer broom for a question
export const onClearAnswer = (projectId, jurisdictionId, questionId, reducerName) => ({
  type: types.ON_CLEAR_ANSWER,
  questionId,
  projectId,
  jurisdictionId,
  reducerName
})

// Dispatched when the Coding component unmounts
export const onCloseScreen = reducerName => ({ type: types.ON_CLOSE_SCREEN, reducerName })

// Dispatched when the user changes any part of the question
export const updateEditedFields = projectId => ({ type: types.UPDATE_EDITED_FIELDS, projectId })