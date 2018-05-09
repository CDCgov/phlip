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

const updateIsCategoryQuestionLogic = createLogic({
  type: types.ADD_CHILD_QUESTION_REQUEST,
  transform({ getState, action }, next) {
    next({
      ...action,
      question: {
        ...action.question,
        isCategoryQuestion: action.parentNode.questionType === questionTypes.CATEGORY,
        positionInParent: action.parentNode.hasOwnProperty('children') ? action.parentNode.children.length : 0
      }
    })
  }
})

const updateQuestionLogic = createLogic({
  type: types.UPDATE_QUESTION_REQUEST,
  async process({ api, action }, dispatch, done) {
    action.question.hovering = false
    const orderedAnswers = action.question.possibleAnswers.map((answer, index) => {
      return { ...answer, order: index + 1 }
    })

    action.question.possibleAnswers = orderedAnswers
    try {
      const updatedQuestion = await api.updateQuestion(action.question, {}, { projectId: action.projectId, questionId: action.questionId })
      dispatch({
        type: types.UPDATE_QUESTION_SUCCESS,
        payload: {
          ...updatedQuestion,
          possibleAnswers: sortList(action.question.possibleAnswers),
          children: action.question.children,
          expanded: true,
          hovering: false,
          path: action.path
        }
      })
    } catch (error) {
      dispatch({
        type: types.UPDATE_QUESTION_FAIL,
        error: true,
        payload: 'We couldn\'t update this question. Please try again later.',
      })
    }
    done()
  }
})

const addChildQuestionLogic = createLogic({
  type: types.ADD_CHILD_QUESTION_REQUEST,
  async process({ api, action }, dispatch, done) {
    const orderedAnswers = action.question.possibleAnswers.map((answer, index) => {
      return { ...answer, order: index + 1 }
    })
    action.question.possibleAnswers = orderedAnswers
    try {
      const question = await api.addQuestion(action.question, {}, { projectId: action.projectId })
      dispatch({
        type: types.ADD_CHILD_QUESTION_SUCCESS,
        payload: {
          ...action.question,
          id: question.id,
          path: action.path,
          hovering: false
        }
      })
    } catch (error) {
      dispatch({
        type: types.ADD_CHILD_QUESTION_FAIL,
        payload: 'We couldn\'t add this child question. Please try again later.',
        error: true
      })
    }
    done()
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
      const question = await api.addQuestion(action.question, {}, { projectId: action.projectId })
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
  updateUserIdLogic,
  updateOutlineLogic,
  updateQuestionLogic,
  updateIsCategoryQuestionLogic,
  addQuestionLogic,
  addChildQuestionLogic
]