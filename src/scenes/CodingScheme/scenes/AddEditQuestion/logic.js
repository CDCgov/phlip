import { createLogic } from 'redux-logic'
import * as types from '../../actionTypes'

const addQuestionLogic = createLogic({
  type: types.ADD_QUESTION_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.ADD_QUESTION_SUCCESS
  },
  async process({ api, action }) {
    action.question.hovering = false
    return api.addQuestion(action.question, action.id)
  }
})

export default [
  addQuestionLogic
]