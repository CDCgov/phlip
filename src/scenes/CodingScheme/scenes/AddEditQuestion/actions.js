import * as types from '../../actionTypes'

export const addQuestionRequest = (question, projectId, parentId) => ({ type: types.ADD_QUESTION_REQUEST, question, projectId, parentId })
export const addQuestionSuccess = (payload) => ({ type: types.ADD_QUESTION_SUCCESS, payload })
//TODO Fail action

export const addChildQuestionRequest = (question, projectId, parentId, path) => ({ type: types.ADD_CHILD_QUESTION_REQUEST, question, projectId, parentId, path })
export const addChildQuestionSuccess = (payload) => ({ type: types.ADD_CHILD_QUESTION_SUCCESS, payload })

export const updateQuestionRequest = (question, projectId, questionId, path) => ({ type: types.UPDATE_QUESTION_REQUEST, question, projectId, questionId, path })
export const updateQuestionSuccess = (payload) => ({ type: types.UPDATE_QUESTION_SUCCESS, payload })

export const updateType = type => ({ type: types.UPDATE_TYPE, type })