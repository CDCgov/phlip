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

export const getUserValidatedQuestionsRequest = (projectId, jurisdictionId) => ({
  type: types.GET_USER_VALIDATED_QUESTIONS_REQUEST,
  projectId,
  jurisdictionId
})

export const onValidationJurisdictionChange = (event, jurisdictionList) => ({
  type: types.ON_VALIDATION_JURISDICTION_CHANGE,
  event,
  jurisdictionList
})

export const getCodedUsersAnswers = (projectId, jurisdictionId) => ({
  type: types.GET_CODED_USERS_LIST_REQUEST,
  projectId,
  jurisdictionId
})

export const onCloseValidationScreen = () => ({ type: types.ON_CLOSE_VALIDATION_SCREEN })

export const updateEditedFields = projectId => ({ type: types.UPDATE_EDITED_FIELDS, projectId })

export const onClearAnswer = (projectId, jurisdictionId, questionId) => ({ type: types.ON_CLEAR_VALIDATION_ANSWER, questionId, projectId, jurisdictionId })

export const onChangeCategory = (event, selection) => ({
  type: types.ON_CHANGE_VALIDATION_CATEGORY,
  selection
})

export const onQuestionSelectedInNav = question => ({ type: types.ON_QUESTION_SELECTED_IN_VAL_NAV, question })

export const onChangePincite = (projectId, jurisdictionId, questionId, answerId, pincite) => ({
  type: types.ON_CHANGE_VALIDATION_PINCITE,
  projectId,
  jurisdictionId,
  questionId,
  answerId,
  pincite
})

export const applyAnswerToAll = (projectId, jurisdictionId, questionId) => ({
  type: types.ON_APPLY_VALIDATION_TO_ALL,
  projectId,
  jurisdictionId,
  questionId
})