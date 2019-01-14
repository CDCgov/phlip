/**
 * Handles all of the common / reusable logic for the coding and validation scenes
 */

import { createLogic } from 'redux-logic'
import * as codingTypes from 'scenes/Coding/actionTypes'
import * as valTypes from 'scenes/Validation/actionTypes'
import * as commonTypes from './actionTypes'
import {
  getFinalCodedObject,
  getNextQuestion,
  getPreviousQuestion,
  getQuestionSelectedInNav,
  initializeValues
} from 'utils/codingHelpers'

/**
 * Updates the action creator values with the jurisdictionEmpty state and current userId before sending it to
 * the reducer for getting the coding scheme outline.
 */
const outlineLogic = createLogic({
  type: [codingTypes.GET_CODING_OUTLINE_REQUEST, valTypes.GET_VALIDATION_OUTLINE_REQUEST],
  transform({ getState, action }, next) {
    next({
      ...action,
      payload: {
        scheme: { order: [], byId: {}, tree: [] },
        outline: {},
        question: {},
        userAnswers: {},
        mergedUserQuestions: {},
        categories: undefined,
        areJurisdictionsEmpty: !action.jurisdictionId,
        isSchemeEmpty: false,
        schemeError: null,
        isLoadingPage: false,
        showPageLoader: false,
        errors: {}
      },
      userId: getState().data.user.currentUser.id
    })
  }
})

/**
 * Transforms the action creator values with the current userId and information about the new question to show. It
 * determines the question to show based on the way the user navigated to it.
 */
const getQuestionLogic = createLogic({
  type: [
    codingTypes.GET_PREV_QUESTION, codingTypes.GET_NEXT_QUESTION, codingTypes.ON_QUESTION_SELECTED_IN_NAV,
    valTypes.GET_PREV_QUESTION, valTypes.GET_NEXT_QUESTION, valTypes.ON_QUESTION_SELECTED_IN_NAV
  ],
  transform({ getState, action }, next) {
    const state = getState().scenes[action.page]
    const userId = getState().data.user.currentUser.id
    let questionInfo = {}

    // How did the user navigate to the currently selected question
    switch (action.type) {
      case codingTypes.ON_QUESTION_SELECTED_IN_NAV:
      case valTypes.ON_QUESTION_SELECTED_IN_NAV:
        questionInfo = getQuestionSelectedInNav(state, action)
        break
      case codingTypes.GET_NEXT_QUESTION:
      case valTypes.GET_NEXT_QUESTION:
        questionInfo = getNextQuestion(state, action)
        break
      case codingTypes.GET_PREV_QUESTION:
      case valTypes.GET_PREV_QUESTION:
        questionInfo = getPreviousQuestion(state, action)
        break
    }

    next({
      ...action,
      questionInfo,
      userId
    })
  }
})

/**
 * The logic is invoked when the user has made changes to a question.
 */
const answerQuestionLogic = createLogic({
  type: [codingTypes.SAVE_USER_ANSWER_REQUEST, valTypes.SAVE_USER_ANSWER_REQUEST],
  debounce: 350,
  /**
   * It updates the action creator values and validates
   * that the action should follow through and be sent to the reducers. It updates the action creator values with the final
   * object that should be sent in the request body, the api methods to use, state and userId.
   *
   * It validates that the action should be sent to the reducers to send a request to the API to save the users answer.
   * It will reject the action for a couple different reasons: if there are not unsaved changes, then no need to allow
   * the action. It will also reject if a POST request has already been sent but has not returned a response yet. This
   * is to prevent duplication of codedQuestions and duplicate POST requests being sent. If the app is still waiting on
   * a response then this will reject and dispatch ADD_REQUESTS_TO_QUEUE action to add all of the requests to a queue
   * that will be sent when the app gets a response.
   */
  validate({ getState, action, api }, allow, reject) {
    const state = getState().scenes[action.page]
    const userId = getState().data.user.currentUser.id
    const apiMethods = action.page === 'validation'
      ? { create: api.answerValidatedQuestion, update: api.updateValidatedQuestion }
      : { create: api.answerCodedQuestion, update: api.updateCodedQuestion }

    const questionObj = getFinalCodedObject(state, { ...action, userId }, action.page ===
      'validation', action.selectedCategoryId)

    const answerObject = {
      questionId: action.questionId,
      jurisdictionId: action.jurisdictionId,
      projectId: action.projectId,
      userId,
      questionObj
    }

    if (state.unsavedChanges === true) {
      if (questionObj.isNewCodedQuestion === true && questionObj.hasMadePost === true &&
        !questionObj.hasOwnProperty('id')) {
        reject({ type: `${commonTypes.ADD_REQUEST_TO_QUEUE}_${action.page.toUpperCase()}`, payload: answerObject })
      } else {
        allow({ ...action, payload: { ...answerObject, selectedCategoryId: action.selectedCategoryId }, apiMethods })
      }
    } else {
      reject()
    }
  },
  /**
   * Handles actually sending the requests to the API. If the final questionObj (that was created in the validate function
   * above) has an ID a PUT request is sent, otherwise a POST request is sent. This will also send or clear out any
   * messages hanging in the queue for the questionId. If there's an error with the request and the error code is OBJECT_EXISTS,
   * then a message error action is dispatched.
   */
  async process({ getState, action, api }, dispatch, done) {
    let respCodedQuestion = {}

    try {
      if (action.payload.questionObj.hasOwnProperty('id')) {
        respCodedQuestion = await action.apiMethods.update(action.payload.questionObj, {}, { ...action.payload })

        // Remove any pending requests from the queue because this is the latest one and has an id
        dispatch({
          type: `${commonTypes.REMOVE_REQUEST_FROM_QUEUE}_${action.page.toUpperCase()}`,
          payload: { questionId: action.payload.questionId, categoryId: action.payload.selectedCategoryId }
        })
      } else {
        respCodedQuestion = await action.apiMethods.create(action.payload.questionObj, {}, { ...action.payload })
      }

      dispatch({
        type: `${commonTypes.SAVE_USER_ANSWER_SUCCESS}_${action.page.toUpperCase()}`,
        payload: {
          ...respCodedQuestion,
          selectedCategoryId: action.payload.selectedCategoryId,
          questionId: action.payload.questionId
        }
      })

      dispatch({
        type: `${commonTypes.SEND_QUEUE_REQUESTS}_${action.page.toUpperCase()}`,
        payload: {
          selectedCategoryId: action.payload.selectedCategoryId,
          questionId: action.payload.questionId,
          id: respCodedQuestion.id
        },
        page: action.page,
        apiUpdateMethod: action.apiMethods.update
      })

      dispatch({
        type: commonTypes.UPDATE_EDITED_FIELDS,
        projectId: action.payload.projectId
      })
    } catch (error) {
      if (error.response.status === 303) {
        dispatch({
          type: `${commonTypes.OBJECT_EXISTS}_${action.page.toUpperCase()}`,
          payload: {
            selectedCategoryId: action.payload.selectedCategoryId,
            questionId: action.payload.questionId,
            object: initializeValues(error.response.data)
          }
        })
      } else {
        dispatch({
          type: `${commonTypes.SAVE_USER_ANSWER_FAIL}_${action.page.toUpperCase()}`,
          payload: {
            error: 'Could not update answer',
            isApplyAll: false,
            selectedCategoryId: action.payload.selectedCategoryId,
            questionId: action.payload.questionId
          }
        })
      }
    }
    done()
  }
})

/**
 * Logic for when the user clicks 'Apply to all tabs'
 */
const applyAnswerToAllLogic = createLogic({
  type: [codingTypes.ON_APPLY_ANSWER_TO_ALL, valTypes.ON_APPLY_ANSWER_TO_ALL],
  /**
   * Transforms the action creator values with the API methods for create and update for coding or validation. Also sets
   * the answer object for the request
   */
  transform({ getState, action, api }, next) {
    const userId = getState().data.user.currentUser.id
    const apiMethods = action.page === 'validation'
      ? { create: api.answerValidatedQuestion, update: api.updateValidatedQuestion }
      : { create: api.answerCodedQuestion, update: api.updateCodedQuestion }

    const answerObject = {
      questionId: action.questionId,
      jurisdictionId: action.jurisdictionId,
      projectId: action.projectId
    }

    next({
      ...action,
      answerObject,
      apiMethods,
      userId
    })
  },
  /**
   * Actually calls the API to send a request to save the answer to all categories.
   */
  async process({ getState, action }, dispatch, done) {
    const userId = action.userId
    const state = getState().scenes[action.page]
    const allCategoryObjects = Object.values(state.userAnswers[action.questionId])

    try {
      for (let category of allCategoryObjects) {
        let respCodedQuestion = {}
        const question = getFinalCodedObject(state, action, action.page === 'validation', category.categoryId)

        if (category.id !== undefined) {
          respCodedQuestion = await action.apiMethods.update(question, {}, { ...action.answerObject, userId })
        } else {
          const { id, ...questionObj } = question
          respCodedQuestion = await action.apiMethods.create(questionObj, {}, { ...action.answerObject, userId })
        }

        dispatch({
          type: `${commonTypes.SAVE_USER_ANSWER_SUCCESS}_${action.page.toUpperCase()}`,
          payload: { ...respCodedQuestion, questionId: action.questionId, selectedCategoryId: category.categoryId }
        })
      }
      dispatch({
        type: commonTypes.UPDATE_EDITED_FIELDS,
        projectId: action.projectId
      })
    } catch (error) {
      dispatch({
        type: `${commonTypes.SAVE_USER_ANSWER_FAIL}_${action.page.toUpperCase()}`,
        payload: { error: 'Could not update answer', isApplyAll: true }
      })
    }
    done()
  }
})

/**
 * Logic for sending / handling requests hanging in the queue
 */
const sendMessageLogic = createLogic({
  type: [codingTypes.SEND_QUEUE_REQUESTS, valTypes.SEND_QUEUE_REQUESTS],
  /**
   * Finds all of the messages to send for the question in the action.payload object. Validates that there are actual
   * messages that need to be sent, otherwise rejects the action.
   */
  validate({ getState, action }, allow, reject) {
    const messageQueue = getState().scenes[action.page].messageQueue
    const messageToSend = messageQueue.find(message => {
      if (message.hasOwnProperty('categoryId')) {
        return message.questionId === action.payload.questionId && action.payload.selectedCategoryId ===
          message.categoryId
      } else {
        return message.questionId === action.payload.questionId
      }
    })
    if (messageQueue.length > 0 && messageToSend !== undefined) {
      allow({ ...action, message: messageToSend })
    } else {
      reject()
    }
  },
  /**
   * Actually sends the requests in the queue and then removest the request from the queue.
   */
  async process({ getState, action, api }, dispatch, done) {
    try {
      const respCodedQuestion = await action.apiUpdateMethod({
        ...action.message.questionObj,
        id: action.payload.id
      }, {}, { ...action.message })

      dispatch({
        type: `${commonTypes.SAVE_USER_ANSWER_SUCCESS}_${action.page.toUpperCase()}`,
        payload: {
          ...respCodedQuestion,
          questionId: action.payload.questionId,
          selectedCategoryId: action.payload.selectedCategoryId
        }
      })

      dispatch({
        type: `${commonTypes.REMOVE_REQUEST_FROM_QUEUE}_${action.page.toUpperCase()}`,
        payload: { questionId: action.payload.questionId, categoryId: action.payload.selectedCategoryId }
      })
    } catch (e) {
      dispatch({
        type: `${commonTypes.SAVE_USER_ANSWER_FAIL}_${action.page.toUpperCase()}`,
        payload: { error: 'Could not update answer', isApplyAll: false }
      })
    }
    done()
  }
})

/**
 * Logic for getting coded / validated questions, transforms the action creator values with the correct question
 * information
 */
const getCodedValQuestionsLogic = createLogic({
  type: [codingTypes.GET_USER_CODED_QUESTIONS_REQUEST, valTypes.GET_USER_VALIDATED_QUESTIONS_REQUEST],
  transform({ getState, action }, next) {
    const state = getState().scenes[action.page]
    let question = { ...state.question }, otherUpdates = {}

    // If the current question is a category question, then change the current question to parent
    if (state.question.isCategoryQuestion) {
      question = state.scheme.byId[question.parentId]
      otherUpdates = {
        currentIndex: state.scheme.order.findIndex(id => id === question.id),
        categories: undefined,
        selectedCategory: 0,
        selectedCategoryId: null
      }
    }

    next({
      ...action,
      question,
      otherUpdates
    })
  }
})

export default [
  outlineLogic,
  getQuestionLogic,
  answerQuestionLogic,
  applyAnswerToAllLogic,
  sendMessageLogic,
  getCodedValQuestionsLogic
]