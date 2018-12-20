import * as types from '../../actionTypes'

/** Adding questions */
export const addQuestionRequest = (question, projectId, parentId) => ({
  type: types.ADD_QUESTION_REQUEST,
  question,
  projectId,
  parentId
})

export const addChildQuestionRequest = (question, projectId, parentId, parentNode, path) => ({
  type: types.ADD_CHILD_QUESTION_REQUEST,
  question,
  projectId,
  parentId,
  parentNode,
  path
})

export const addChildQuestionFailure = (payload) => ({
  type: types.ADD_CHILD_QUESTION_FAIL,
  payload: { errorContent: payload, error: true }
})

/** Updating questions */
export const updateQuestionRequest = (question, projectId, questionId, path) => ({
  type: types.UPDATE_QUESTION_REQUEST,
  question,
  projectId,
  questionId,
  path
})

export const updateType = () => ({ type: types.UPDATE_TYPE })