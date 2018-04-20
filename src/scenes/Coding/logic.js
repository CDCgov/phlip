import { createLogic } from 'redux-logic'
import { sortQuestions, getQuestionNumbers } from 'utils/treeHelpers'
import { getTreeFromFlatData } from 'react-sortable-tree'
import {
  getFinalCodedObject,
  initializeUserAnswers,
  getQuestionSelectedInNav,
  getNextQuestion,
  getPreviousQuestion,
  getQuestionAndInitialize,
  initializeNextQuestion
} from 'utils/codingHelpers'
import { normalize, sortList } from 'utils'
import * as types from './actionTypes'

export const getOutlineLogic = createLogic({
  type: types.GET_CODING_OUTLINE_REQUEST,
  async process({ action, getState, api }, dispatch, done) {
    let scheme = {}, errors = {}, payload = {}
    let codedQuestions = []
    const userId = getState().data.user.currentUser.id
    payload = {
      scheme: { order: [], byId: {}, tree: [] },
      outline: {},
      question: {},
      userAnswers: {},
      categories: undefined,
      areJurisdictionsEmpty: false,
      isSchemeEmpty: false,
      schemeError: null,
      isLoadingPage: false,
      showPageLoader: false
    }

    // Try to get the project coding scheme
    try {
      scheme = await api.getScheme(action.projectId)
      // Get user coded questions for currently selected jurisdiction
      if (action.jurisdictionId) {
        if (scheme.schemeQuestions.length === 0) {
          payload = { isSchemeEmpty: true, areJurisdictionsEmpty: false }
        } else {
          try {
            codedQuestions = await api.getUserCodedQuestions(userId, action.projectId, action.jurisdictionId)
          } catch (e) {
            errors = {
              codedQuestions: `We couldn\'t get your coded questions for this project and jurisdiction, 
                               so you won\'t be able to answer quetions.`
            }
          }

          // Create one array with the outline information in the question information
          const merge = scheme.schemeQuestions.reduce((arr, q) => {
            return [...arr, { ...q, ...scheme.outline[q.id] }]
          }, [])

          // Create a sorted question tree with sorted children with question numbering and order
          const { questionsWithNumbers, order, tree } = getQuestionNumbers(sortQuestions(getTreeFromFlatData({ flatData: merge })))
          const questionsById = normalize.arrayToObject(questionsWithNumbers)
          const firstQuestion = questionsWithNumbers[0]

          // Initialize the user answers object
          const userAnswers = initializeUserAnswers(
            [initializeNextQuestion(firstQuestion), ...codedQuestions], questionsById, userId
          )

          sortList(firstQuestion.possibleAnswers, 'order', 'asc')
          payload = {
            ...payload,
            outline: scheme.outline,
            scheme: { byId: questionsById, tree, order },
            userAnswers,
            question: firstQuestion,
            codedQuestions,
            userId,
            errors: { ...errors }
          }
        }
      } else {
        // Check if the scheme is empty, if it is, there's nothing to do so send back empty status
        if (scheme.schemeQuestions.length === 0) {
          payload = { ...payload, isSchemeEmpty: true, areJurisdictionsEmpty: true }
        } else {
          payload = { ...payload, isSchemeEmpty: false, areJurisdictionsEmpty: true }
        }
      }

      dispatch({
        type: types.GET_CODING_OUTLINE_SUCCESS,
        payload
      })
    } catch (e) {
      dispatch({
        type: types.GET_CODING_OUTLINE_FAIL,
        payload: 'Failed to get outline.',
        error: true
      })
    }
    done()
  }
})

export const getQuestionLogic = createLogic({
  type: [types.ON_QUESTION_SELECTED_IN_NAV, types.GET_NEXT_QUESTION, types.GET_PREV_QUESTION],
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_QUESTION_SUCCESS,
    failType: types.GET_QUESTION_FAIL
  },
  latest: true,
  async process({ getState, action, api }) {
    const state = getState().scenes.coding
    const userId = getState().data.user.currentUser.id
    let questionInfo = {}

    // How did the user navigate to the currently selected question
    switch (action.type) {
      case types.ON_QUESTION_SELECTED_IN_NAV:
        questionInfo = getQuestionSelectedInNav(state, action)
        break
      case types.GET_NEXT_QUESTION:
        questionInfo = getNextQuestion(state, action)
        break
      case types.GET_PREV_QUESTION:
        questionInfo = getPreviousQuestion(state, action)
        break
    }

    return await getQuestionAndInitialize(state, action, userId, api, questionInfo)
  }
})

export const applyAllAnswers = createLogic({
  type: types.ON_APPLY_ANSWER_TO_ALL,
  async process({ getState, action, api }, dispatch, done) {
    const userId = getState().data.user.currentUser.id
    const codingState = getState().scenes.coding
    const allCategoryObjects = Object.values(codingState.userAnswers[action.questionId])

    const answerObject = {
      questionId: action.questionId,
      jurisdictionId: action.jurisdictionId,
      userId,
      projectId: action.projectId
    }

    try {
      for (let category of allCategoryObjects) {
        let respCodedQuestion = {}
        const question = getFinalCodedObject(codingState, action, category.categoryId)
        if (category.id !== undefined) {
          respCodedQuestion = await api.updateCodedQuestion({ ...answerObject, questionObj: question })
        } else {
          const { id, ...questionObj } = question
          respCodedQuestion = await api.answerCodedQuestion({ ...answerObject, questionObj })
        }

        dispatch({
          type: types.SAVE_USER_ANSWER_SUCCESS,
          payload: { ...respCodedQuestion }
        })
      }
      dispatch({
        type: types.UPDATE_EDITED_FIELDS,
        projectId: action.projectId
      })
    } catch (error) {
      dispatch({
        type: types.SAVE_USER_ANSWER_FAIL,
        payload: { error: 'Could not update answer', isApplyAll: true }
      })
    }
    done()
  }
})

export const sendMessageInQueue = createLogic({
  type: types.SEND_QUEUE_REQUESTS,
  validate({ getState, action }, allow, reject) {
    const messageQueue = getState().scenes.coding.messageQueue
    const messageToSend = messageQueue.find(message => message.questionId === action.payload.questionId)
    if (messageQueue.length > 0 && messageToSend !== undefined) {
      allow({ ...action, message: messageToSend })
    } else {
      reject()
    }
  },
  async process({ getState, action, api }, dispatch, done) {
    try {
      const respCodedQuestion = await api.updateCodedQuestion({
        ...action.message,
        questionObj: { ...action.message.questionObj, id: action.payload.id }
      })

      dispatch({
        type: types.SAVE_USER_ANSWER_SUCCESS,
        payload: { ...respCodedQuestion, questionId: action.payload.questionId, selectedCategoryId: action.payload.selectedCategoryId }
      })

      dispatch({
        type: types.REMOVE_REQUEST_FROM_QUEUE,
        payload: { questionId: action.payload.questionId, categoryId: action.payload.selectedCategoryId }
      })
    } catch (e) {
      dispatch({
        type: types.SAVE_USER_ANSWER_FAIL,
        payload: { error: 'Could not update answer', isApplyAll: false }
      })
    }
    done()
  }
})

export const answerQuestionLogic = createLogic({
  type: types.SAVE_USER_ANSWER_REQUEST,
  debounce: 200,
  //latest: true,
  validate({ getState, action }, allow, reject) {
    const state = getState().scenes.coding
    const userId = getState().data.user.currentUser.id
    const questionObj = getFinalCodedObject(state, action, action.selectedCategoryId)
    const answerObject = {
      questionId: action.questionId,
      jurisdictionId: action.jurisdictionId,
      userId,
      projectId: action.projectId,
      questionObj
    }

    if (state.unsavedChanges === true) {
      if (questionObj.isNewCodedQuestion === true && questionObj.hasMadePost === true && !questionObj.hasOwnProperty('id')) {
        reject({ type: types.ADD_REQUEST_TO_QUEUE, payload: answerObject })
      } else {
        allow({ ...action, payload: answerObject })
      }
    } else {
      reject()
    }
  },
  async process({ getState, action, api }, dispatch, done) {
    let respCodedQuestion = {}

    try {
      if (action.payload.questionObj.hasOwnProperty('id')) {
        respCodedQuestion = await api.updateCodedQuestion({ ...action.payload })

        // Remove any pending requests from the queue because this is the latest one and has an id
        dispatch({
          type: types.REMOVE_REQUEST_FROM_QUEUE,
          payload: { questionId: action.payload.questionId, categoryId: action.payload.selectedCategoryId }
        })
      } else {
        respCodedQuestion = await api.answerCodedQuestion({ ...action.payload })
      }

      dispatch({
        type: types.SAVE_USER_ANSWER_SUCCESS,
        payload: {
          ...respCodedQuestion,
          selectedCategoryId: action.payload.selectedCategoryId,
          questionId: action.payload.questionId
        }
      })

      dispatch({
        type: types.SEND_QUEUE_REQUESTS,
        payload: {
          selectedCategoryId: action.payload.selectedCategoryId,
          questionId: action.payload.questionId,
          id: respCodedQuestion.id
        }
      })

      dispatch({
        type: types.UPDATE_EDITED_FIELDS,
        projectId: action.payload.projectId
      })
      done()
    } catch (error) {
      dispatch({
        type: types.SAVE_USER_ANSWER_FAIL,
        payload: { error: 'Could not update answer', isApplyAll: false }
      })
      done()
    }
  }
})

export const getUserCodedQuestionsLogic = createLogic({
  type: types.GET_USER_CODED_QUESTIONS_REQUEST,
  async process({ action, api, getState }, dispatch, done) {
    let codedQuestions = []
    const userId = getState().data.user.currentUser.id
    const state = getState().scenes.coding
    let question = { ...state.question }
    let otherUpdates = {}, errors = {}, updatedSchemeQuestion = {}, payload = {}

    // Get user coded questions for a project and jurisdiction
    try {
      codedQuestions = await api.getUserCodedQuestions(userId, action.projectId, action.jurisdictionId)
    } catch (e) {
      errors = { codedQuestions: 'We couldn\'t get your coded questions for this project and jurisdiction, so you won\'t be able to answer questions.' }
    }

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

    // Get scheme question in case there are changes
    try {
      updatedSchemeQuestion = await api.getSchemeQuestion(question.id, action.projectId)
    } catch (error) {
      updatedSchemeQuestion = { ...question }
      errors = {
        ...errors,
        updatedSchemeQuestion: 'We couldn\'t get retrieve this scheme question. You still have access to the previous scheme question content, but any updates that have been made since the time you started coding are not available.'
      }
    }

    // Update scheme with new scheme question
    const updatedScheme = {
      ...state.scheme,
      byId: {
        ...state.scheme.byId,
        [updatedSchemeQuestion.id]: { ...state.scheme.byId[updatedSchemeQuestion.id], ...updatedSchemeQuestion }
      }
    }

    // Update the user answers object
    const userAnswers = initializeUserAnswers(
      [initializeNextQuestion(updatedSchemeQuestion), ...codedQuestions], updatedScheme.byId, userId
    )

    payload = {
      question: { ...state.scheme.byId[updatedSchemeQuestion.id], ...updatedSchemeQuestion },
      userAnswers,
      scheme: updatedScheme,
      otherUpdates,
      errors: { ...errors }
    }

    dispatch({
      type: types.GET_USER_CODED_QUESTIONS_SUCCESS,
      payload
    })
    done()
  }
})

// Save red flag logic
export const saveRedFlagLogic = createLogic({
  type: types.ON_SAVE_RED_FLAG_REQUEST,
  async process({ action, api }, dispatch, done) {
    try {
      const flag = { ...action.flagInfo, raisedBy: action.flagInfo.raisedBy.userId }
      const resp = await api.saveRedFlag(action.questionId, flag)
      dispatch({
        type: types.ON_SAVE_RED_FLAG_SUCCESS,
        payload: { ...resp }
      })
      dispatch({
        type: types.UPDATE_EDITED_FIELDS,
        projectId: action.projectId
      })
    } catch (error) {
      dispatch({
        type: types.ON_SAVE_RED_FLAG_FAIL,
        payload: 'Failed to save red flag.'
      })
    }
    done()
  }
})

export default [
  getOutlineLogic,
  getQuestionLogic,
  getUserCodedQuestionsLogic,
  answerQuestionLogic,
  applyAllAnswers,
  sendMessageInQueue,
  saveRedFlagLogic
]