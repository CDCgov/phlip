import * as types from './actionTypes'

export const getQuestionRequest = (questionId, projectId, jurisdictionId) => ({
  type: types.GET_QUESTION_REQUEST,
  questionId,
  projectId,
  jurisdictionId
})

export const getCodingOutlineRequest = (projectId, jurisdictionId) => ({ type: types.GET_CODING_OUTLINE_REQUEST, projectId, jurisdictionId })