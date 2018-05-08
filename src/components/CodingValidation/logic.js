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

const answerQuestionLogic = createLogic({
  type: [codingTypes.SAVE_USER_ANSWER_REQUEST, valTypes.SAVE_USER_ANSWER_REQUEST],
  debounce: 350,
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

const applyAnswerToAllLogic = createLogic({
  type: [codingTypes.ON_APPLY_ANSWER_TO_ALL, valTypes.ON_APPLY_ANSWER_TO_ALL],
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

const sendMessageLogic = createLogic({
  type: [codingTypes.SEND_QUEUE_REQUESTS, valTypes.SEND_QUEUE_REQUESTS],
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