import * as types from './actionTypes'
import { makeActionCreator, actions as commonActions } from 'components/CodingValidation/actions'

const scene = 'VALIDATION'
let actions = {}
for (let action in commonActions) {
  actions = { ...actions, [action]: makeActionCreator(commonActions[action].type, scene, ...commonActions[action].args) }
}

export const getValidationOutlineRequest = (projectId, jurisdictionId) => ({
  type: types.GET_VALIDATION_OUTLINE_REQUEST,
  projectId,
  jurisdictionId
})

export const getUserValidatedQuestionsRequest = (projectId, jurisdictionId, page) => ({
  type: types.GET_USER_VALIDATED_QUESTIONS_REQUEST,
  projectId,
  jurisdictionId,
  page
})

export const clearFlag = (flagId, projectId, jurisdictionId, questionId) => ({
  type: types.CLEAR_FLAG,
  flagId,
  projectId,
  jurisdictionId,
  questionId
})

export const clearRedFlag = (flagId, questionId, projectId) => ({
  type: types.CLEAR_RED_FLAG,
  flagId,
  questionId,
  projectId
})


export default actions