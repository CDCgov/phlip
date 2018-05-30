import * as types from './actionTypes'
import { makeActionCreator, actions as commonActions } from 'components/CodingValidation/actions'

const scene = 'VALIDATION'
let actions = {}

/** Creates action creators for all common actions */
for (let action in commonActions) {
  actions = { ...actions, [action]: makeActionCreator(commonActions[action].type, scene, ...commonActions[action].args) }
}

/** Dispatched when component is mounted, requests the coding scheme for the project */
export const getValidationOutlineRequest = (projectId, jurisdictionId) => ({
  type: types.GET_VALIDATION_OUTLINE_REQUEST,
  projectId,
  jurisdictionId
})

/** Dispatched when the user changes jurisdictions, requests for updated validated questions for the project / jurisdiction */
export const getUserValidatedQuestionsRequest = (projectId, jurisdictionId, page) => ({
  type: types.GET_USER_VALIDATED_QUESTIONS_REQUEST,
  projectId,
  jurisdictionId,
  page
})

/** Dispatched when the user clears a flag, requests to clear flag */
export const clearFlag = (flagId, projectId, jurisdictionId, questionId) => ({
  type: types.CLEAR_FLAG,
  flagId,
  projectId,
  jurisdictionId,
  questionId
})

/** Dispatched when the user clears a 'stop coding this question', requests to clear flag */
export const clearRedFlag = (flagId, questionId, projectId) => ({
  type: types.CLEAR_RED_FLAG,
  flagId,
  questionId,
  projectId
})


export default actions