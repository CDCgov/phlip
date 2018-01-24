import * as types from './actionTypes'

export const getNextQuestion = (id, newIndex) => ({ type: types.GET_NEXT_QUESTION, id, newIndex })
export const getPrevQuestion = (id, newIndex) => ({ type: types.GET_PREV_QUESTION, id, newIndex })

export const getCodingOutlineRequest = (projectId, jurisdictionId) => ({
  type: types.GET_CODING_OUTLINE_REQUEST,
  projectId,
  jurisdictionId
})

export const answerQuestionRequest = (projectId, jurisdictionId, questionId, answerId, answerValue) => ({
  type: types.ANSWER_QUESTION_REQUEST,
  projectId,
  jurisdictionId,
  questionId,
  answerId,
  answerValue
})

export const onChangeComment = (projectId, jurisdictionId, questionId, comment) => ({
  type: types.ON_CHANGE_COMMENT,
  projectId,
  jurisdictionId,
  questionId,
  comment
})

export const onChangePincite = (projectId, jurisdictionId, questionId, answerId, pincite) => ({
  type: types.ON_CHANGE_PINCITE,
  projectId,
  jurisdictionId,
  questionId,
  answerId,
  pincite
})

export const clearCategories = () => ({
  type: types.CLEAR_CATEGORIES
})

export const onChangeCategory = (event, selection) => ({
  type: types.ON_CHANGE_CATEGORY,
  selection
})