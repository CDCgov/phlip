import * as types from './actionTypes'

export const getNextQuestion = (id, newIndex) => ({ type: types.GET_VALIDATION_NEXT_QUESTION, id, newIndex })
export const getPrevQuestion = (id, newIndex) => ({ type: types.GET_VALIDATION_PREV_QUESTIONS, id, newIndex })

export const getValidationOutlineRequest = (projectId, jurisdictionId) => ({
  type: types.GET_VALIDATION_OUTLINE_REQUEST,
  projectId,
  jurisdictionId
})

export const validateQuestionRequest = (projectId, jurisdictionId, questionId, answerId, answerValue) => ({
  type: types.UPDATE_USER_VALIDATION_REQUEST,
  projectId,
  jurisdictionId,
  questionId,
  answerId,
  answerValue
})

export const onValidationJurisdictionChange = (event, jurisdictionList) => ({
  type: types.ON_VALIDATION_JURISDICTION_CHANGE,
  event,
  jurisdictionList
})

export const onCloseValidationScreen = () => ({ type: types.ON_CLOSE_VALIDATION_SCREEN })

export const updateEditedFields = projectId => ({ type: types.UPDATE_EDITED_FIELDS, projectId })

export const onClearAnswer = (projectId, jurisdictionId, questionId) => ({ type: types.ON_CLEAR_VALIDATION_ANSWER, questionId, projectId, jurisdictionId })

export const onChangeCategory = (event, selection) => ({
  type: types.ON_CHANGE_VALIDATION_CATEGORY,
  selection
})

export const onChangePincite = (projectId, jurisdictionId, questionId, answerId, pincite) => ({
  type: types.ON_CHANGE_VALIDATION_PINCITE,
  projectId,
  jurisdictionId,
  questionId,
  answerId,
  pincite
})