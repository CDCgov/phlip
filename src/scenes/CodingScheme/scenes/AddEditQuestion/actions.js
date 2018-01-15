import * as types from '../../actionTypes'

export const addQuestionRequest = (question, projectId) => ({ type: types.ADD_QUESTION_REQUEST, question, projectId })
export const addQuestionSuccess = (payload) => ({ type: types.ADD_QUESTION_SUCCESS, payload })
//TODO Fail action

export const updateQuestionRequest = (question, projectId, questionId) => ({ type: types.UPDATE_QUESTION_REQUEST, question, projectId, questionId })
export const updateQuestionSuccess = (payload) => ({ type: types.UPDATE_QUESTION_SUCCESS, payload })

export const updateType = type => ({ type: types.UPDATE_TYPE, type })