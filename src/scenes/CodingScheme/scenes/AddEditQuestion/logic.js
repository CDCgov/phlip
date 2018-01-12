import { createLogic } from 'redux-logic'
import * as types from '../../actionTypes'

const updateOutlineLogic = createLogic({
  type: types.ADD_QUESTION_REQUEST,
  transform ({ getState, action }, next) {
    next({
      ...action,
      question: {
        ...action.question,
        outline: getState().scenes.codingScheme.outline,
        parentId: 0,
        positionInParent: getState().scenes.codingScheme.questions.length
      }
    })
  }
})

const addQuestionLogic = createLogic({
  type: types.ADD_QUESTION_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.ADD_QUESTION_SUCCESS
  },
  async process ({ api, action }) {
    action.question.hovering = false
    const question = await api.addQuestion(action.question, action.id)
    return {
      ...question,
      parentId: action.question.parentId,
      positionInParent: action.question.positionInParent,
      hovering: false
    }
  }
})

export default [
  updateOutlineLogic,
  addQuestionLogic
]