import * as types from './actionTypes'

export const getQuestionRequest = (projectId, jurisdictionId, newIndex, question) => ({
  type: types.GET_QUESTION_REQUEST,
  projectId,
  jurisdictionId,
  newIndex,
  question
})

export const getCodingOutlineRequest = (projectId, jurisdictionId) => ({
  type: types.GET_CODING_OUTLINE_REQUEST,
  projectId,
  jurisdictionId
})

export const answerQuestionRequest = (projectId, jurisdictionId, questionId, answerId, answerValue,) => ({
  type: types.ANSWER_QUESTION_REQUEST,
  projectId,
  jurisdictionId,
  questionId,
  answerId,
  answerValue,
})