import { createLogic } from 'redux-logic'
import * as types from '../../actionTypes'
import * as questionTypes from './constants'


const updateUserIdLogic = createLogic({
  type: [types.ADD_QUESTION_REQUEST, types.UPDATE_QUESTION_REQUEST, types.ADD_CHILD_QUESTION_REQUEST],
  transform({ getState, action }, next) {
    next({
      ...action,
      question: { ...action.question, userId: getState().data.user.currentUser.id }
    })
  }
})

const updateOutlineLogic = createLogic({
  type: [types.ADD_QUESTION_REQUEST, types.ADD_CHILD_QUESTION_REQUEST],
  transform({ getState, action }, next) {
    next({
      ...action,
      question: {
        ...action.question,
        outline: getState().scenes.codingScheme.outline,
        parentId: action.parentId,
        positionInParent: getState().scenes.codingScheme.questions.length
      }
    })
  }
})

const updateIsCategoryQuestionLogic = createLogic({
  type: types.ADD_CHILD_QUESTION_REQUEST,
  transform({ getState, action }, next) {
    next({
      ...action,
      question: {
        ...action.question,
        isCategoryQuestion: action.parentNode.questionType === questionTypes.CATEGORY ? true : false
      }
    })
  }
})

const updateQuestionLogic = createLogic({
  type: types.UPDATE_QUESTION_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.UPDATE_QUESTION_SUCCESS
  },
  async process({ api, action }) {
    action.question.hovering = false
    const updatedQuestion = await api.updateQuestion(action.question, action.projectId, action.questionId)
    return {
      ...updatedQuestion,
      hovering: false
    }
  }
})

const addChildQuestionLogic = createLogic({
  type: types.ADD_CHILD_QUESTION_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.ADD_CHILD_QUESTION_SUCCESS,
    failType: types.ADD_CHILD_QUESTION_FAIL
  },
  async process({ api, action }) {
    const question = await api.addQuestion(action.question, action.projectId)
    return {
      ...question,
      parentId: action.question.parentId,
      positionInParent: action.question.positionInParent,
      isCategoryQuestion: action.question.isCategoryQuestion,
      path: action.path,
      hovering: false
    }
  }
})

const addQuestionLogic = createLogic({
  type: types.ADD_QUESTION_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.ADD_QUESTION_SUCCESS
  },
  async process({ api, action }) {
    action.question.hovering = false
    const question = await api.addQuestion(action.question, action.projectId)
    return {
      ...question,
      parentId: action.question.parentId,
      positionInParent: action.question.positionInParent,
      hovering: false
    }
  }
})

export default [
  updateUserIdLogic,
  updateOutlineLogic,
  updateQuestionLogic,
  updateIsCategoryQuestionLogic,
  addQuestionLogic,
  addChildQuestionLogic
]