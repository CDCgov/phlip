import * as types from './actionTypes'

export const getNextQuestion = (id, newIndex) => ({ type: types.GET_VALIDATION_NEXT_QUESTION, id, newIndex })
export const getPrevQuestion = (id, newIndex) => ({ type: types.GET_VALIDATION_PREV_QUESTIONS, id, newIndex })

export const getValidationOutlineRequest = (projectId, jurisdictionId) => ({
  type: types.GET_VALIDATION_OUTLINE_REQUEST,
  projectId,
  jurisdictionId
})