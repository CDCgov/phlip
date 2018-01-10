import * as types from '../../actionTypes'

export const addQuestionRequest = (question, id) => ({ type: types.ADD_QUESTION_REQUEST, question, id })
export const addQuestionSuccess = (payload) => ({ type: types.ADD_QUESTION_SUCCESS, payload })
//TODO Fail action