import { createLogic } from 'redux-logic'
import * as types from '../../actionTypes'
import * as questionTypes from './constants'
import { sortList } from 'utils'

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
        possibleAnswers: action.question.questionType === questionTypes.TEXT_FIELD
          ? [{ text: '' }]
          : action.question.possibleAnswers
      }
    })
  }
})

const updatePositionInParentLogic = createLogic({
  type: types.ADD_QUESTION_REQUEST,
  transform({ getState, action }, next) {
    next({
      ...action,
      question: {
        ...action.question,
        positionInParent: getState().scenes.codingScheme.questions.length
      }
    })
  }
})

const updateChildPositionInParentLogic = createLogic({
  type: types.ADD_CHILD_QUESTION_REQUEST,
  transform({ getState, action }, next) {
    let parent = getState().scenes.codingScheme.questions.find(question => question.id === action.parentId)
    let positionInParent = 0
    if (parent) {
      if (parent.children) {
        positionInParent = parent.children.length
      } else {
        positionInParent = 0
      }
    } else {
      positionInParent = 0
    }
    next({
      ...action,
      question: {
        ...action.question,
        // positionInParent: parent.children ? parent.children.length : 0
        positionInParent: positionInParent
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
        isCategoryQuestion: action.parentNode.questionType === questionTypes.CATEGORY
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
    const orderedAnswers = action.question.possibleAnswers.map((answer, index) => {
      return { ...answer, order: index + 1 }
    })

    action.question.possibleAnswers = orderedAnswers
    // action.question.hovering = false
    const updatedQuestion = await api.updateQuestion(action.question, action.projectId, action.questionId)

    return {
      ...updatedQuestion,
      possibleAnswers: sortList(action.question.possibleAnswers),
      children: action.question.children,
      expanded: true,
      hovering: false,
      path: action.path
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
    const orderedAnswers = action.question.possibleAnswers.map((answer, index) => {
      return { ...answer, order: index + 1 }
    })

    action.question.possibleAnswers = orderedAnswers
    const question = await api.addQuestion(action.question, action.projectId)
    return {
      ...question,
      possibleAnswers: sortList(action.question.possibleAnswers),
      parentId: action.question.parentId,
      positionInParent: action.parentNode.children ? action.parentNode.children.length : 0,
      isCategoryQuestion: action.question.isCategoryQuestion,
      path: action.path,
      hovering: false
    }
  }
})

const addQuestionLogic = createLogic({
  type: types.ADD_QUESTION_REQUEST,
  async process({ api, action }, dispatch, done) {
    action.question.hovering = false
    const orderedAnswers = action.question.possibleAnswers.map((answer, index) => {
      return { ...answer, order: index + 1 }
    })

    action.question.possibleAnswers = orderedAnswers
    try {
      const question = await api.addQuestion(action.question, action.projectId)
      dispatch({
        type: types.ADD_QUESTION_SUCCESS,
        payload: {
          ...question,
          possibleAnswers: sortList(action.question.possibleAnswers),
          parentId: action.question.parentId,
          positionInParent: action.question.positionInParent,
          hovering: false
        }
      })
    } catch (error) {
      dispatch({
        type: types.ADD_QUESTION_FAIL,
        payload: 'We couldn\'t add the question. Please try again later.',
        error: true
      })
    }
    done()
  }
})

export default [
  updatePositionInParentLogic,
  updateChildPositionInParentLogic,
  updateUserIdLogic,
  updateOutlineLogic,
  updateQuestionLogic,
  updateIsCategoryQuestionLogic,
  addQuestionLogic,
  addChildQuestionLogic
]