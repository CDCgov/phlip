import { createLogic } from 'redux-logic'
import { types } from './actions'
import * as questionTypes from './constants'
import { commonHelpers } from 'utils'

/**
 * Adds a userID to every action so as to not repeat the code in every logic block
 */
const updateUserIdLogic = createLogic({
  type: types.UPDATE_QUESTION_REQUEST,
  transform({ getState, action }, next) {
    next({
      ...action,
      question: {
        ...action.question,
        userId: getState().data.user.currentUser.id,
        possibleAnswers: action.question.possibleAnswers.map(answer => {
          const { isNew, ...answerOptions } = answer
          return answerOptions
        })
      }
    })
  }
})

/**
 * Updates the question object in the action creators with outline information and possibleAnswers
 */
const updateOutlineLogic = createLogic({
  type: [types.ADD_QUESTION_REQUEST, types.ADD_CHILD_QUESTION_REQUEST],
  transform({ getState, action }, next) {
    next({
      ...action,
      question: {
        ...action.question,
        userId: getState().data.user.currentUser.id,
        outline: getState().scenes.codingScheme.main.outline,
        parentId: action.parentId,
        possibleAnswers: action.question.questionType === questionTypes.TEXT_FIELD
          ? [{ text: '' }]
          : action.question.possibleAnswers
      }
    })
  }
})

/**
 * Updates the question object in the action creator values with the position in parent number
 */
const updatePositionInParentLogic = createLogic({
  type: types.ADD_QUESTION_REQUEST,
  transform({ getState, action }, next) {
    next({
      ...action,
      question: {
        ...action.question,
        positionInParent: getState().scenes.codingScheme.main.questions.length
      }
    })
  }
})

/**
 * Updates question object in action creator with category question status and position in parent
 */
const updateIsCategoryQuestionLogic = createLogic({
  type: types.ADD_CHILD_QUESTION_REQUEST,
  transform({ action }, next) {
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

/**
 * Sends a request to update the question in the coding scheme whose questionId = action.question.id
 */
const updateQuestionLogic = createLogic({
  type: types.UPDATE_QUESTION_REQUEST,
  async process({ api, action }, dispatch, done) {
    action.question.hovering = false
    const orderedAnswers = action.question.possibleAnswers.map((answer, index) => {
      return { ...answer, order: index + 1 }
    })

    action.question.possibleAnswers = orderedAnswers
    try {
      const updatedQuestion = await api.updateQuestion(action.question, {}, {
        projectId: action.projectId,
        questionId: action.questionId
      })
      dispatch({
        type: types.UPDATE_QUESTION_SUCCESS,
        payload: {
          ...updatedQuestion,
          possibleAnswers: commonHelpers.sortListOfObjects(action.question.possibleAnswers),
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
        payload: 'We couldn\'t update the question. Please try again later.'
      })
    }
    done()
  }
})

/**
 * Sends a request to add a child question to the coding scheme
 */
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

/**
 * Sends a request to add a parent question to the coding scheme
 */
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
          possibleAnswers: commonHelpers.sortListOfObjects(action.question.possibleAnswers),
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
