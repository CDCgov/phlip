import * as types from './actionTypes'
import { makeActionCreator, actions as commonActions } from 'components/CodingValidation/actions'

const scene = 'CODING'
let actions = {}

for (let action in commonActions) {
  actions = { ...actions, [action]: makeActionCreator(commonActions[action].type, scene, ...commonActions[action].args) }
}

// Dispatched when a user navigates to any question
export const getQuestionRequest = (questionId, projectId) => ({
  type: types.GET_QUESTION_REQUEST,
  questionId,
  projectId
})

// Dispatched when coding component mounts to get coding scheme
export const getCodingOutlineRequest = (projectId, jurisdictionId, reducerName) => ({
  type: types.GET_CODING_OUTLINE_REQUEST,
  projectId,
  jurisdictionId,
  reducerName
})

// Dispatched when the user selects a different jurisdiction in the jurisdiction dropdown
export const getUserCodedQuestions = (projectId, jurisdictionId) => ({
  type: types.GET_USER_CODED_QUESTIONS_REQUEST,
  projectId,
  jurisdictionId
})

// Dispatched when a user saves a green or yellow flag for a question in the 'flag this question' flag popover
export const onSaveFlag = (projectId, jurisdictionId, questionId, flagInfo) => ({
  type: types.ON_SAVE_FLAG,
  projectId,
  jurisdictionId,
  questionId,
  flagInfo
})

// Dispatched when a user saves a red flag for a question in the 'stop coding this question' popover
export const onSaveRedFlag = (projectId, questionId, flagInfo) => ({
  type: types.ON_SAVE_RED_FLAG_REQUEST,
  projectId,
  questionId,
  flagInfo
})

export default actions