import * as types from './actionTypes'

export const getSchemeRequest = id => ({ type: types.GET_SCHEME_REQUEST, id })
export const updateQuestionTree = questions => ({ type: types.HANDLE_QUESTION_TREE_CHANGE, questions })