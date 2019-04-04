/**
 * Handles all of the common / reusable logic for the coding and validation scenes
 */
import { createLogic } from 'redux-logic'
import { types } from './actions'
import {
  checkIfExists,
  getCodedValidatedQuestions,
  getFinalCodedObject,
  getNextQuestion,
  getPreviousQuestion,
  getQuestionSelectedInNav,
  getSchemeAndInitialize,
  getSchemeQuestionAndUpdate,
  getSelectedQuestion,
  initializeNextQuestion,
  initializeUserAnswers,
  initializeValues
} from 'utils/codingHelpers'
import documentListLogic from './components/DocumentList/logic'

/**
 * Updates the existing question object that is present in mergedUserQuestions. Adds answer objects and flagsComments
 * objects
 *
 * @param {Object} existingQuestion
 * @param {Object} question
 * @param {Object} coder
 * @returns {{answers: *[], flagsComments: *[]}}
 */
const addCoderToAnswers = (existingQuestion, question, coder) => {
  let flagComment = {}
  if (question.flag !== null) {
    flagComment = { ...question.flag, raisedBy: { ...coder } }
  }
  if (question.comment !== '') {
    flagComment = { ...flagComment, comment: question.comment, raisedBy: { ...coder } }
  }

  return {
    ...existingQuestion,
    answers: [...existingQuestion.answers, ...question.codedAnswers.map(answer => ({ ...answer, ...coder }))],
    flagsComments: Object.keys(flagComment).length > 0
      ? [...existingQuestion.flagsComments, flagComment]
      : [...existingQuestion.flagsComments]
  }
}

/**
 * Updates the codedQuestions object with any answers, flags, comments for each question in the codedQuestionsPerUser
 *
 * @param {Object} codedQuestions
 * @param {Array} codeQuestionsPerUser
 * @param {Object} coder
 * @returns {Object}
 */
const mergeInUserCodedQuestions = (codedQuestions, codeQuestionsPerUser, coder) => {
  const baseQuestion = { flagsComments: [], answers: [] }
  return codeQuestionsPerUser.reduce((allCodedQuestions, question) => {
    const doesExist = checkIfExists(question, allCodedQuestions, 'schemeQuestionId')
    return {
      ...allCodedQuestions,
      [question.schemeQuestionId]: question.categoryId && question.categoryId !== 0
        ? {
          ...allCodedQuestions[question.schemeQuestionId],
          [question.categoryId]: {
            ...addCoderToAnswers(doesExist
              ? checkIfExists(question, allCodedQuestions[question.schemeQuestionId], 'categoryId')
                ? allCodedQuestions[question.schemeQuestionId][question.categoryId]
                : baseQuestion
              : baseQuestion, question, coder)
          }
        }
        : {
          ...addCoderToAnswers(doesExist
            ? allCodedQuestions[question.schemeQuestionId]
            : baseQuestion, question, coder)
        }
    }
  }, codedQuestions)
}

/**
 * Gets all of the coded questions for the schemeQuestionId (questionId) parameter. This is every user
 * that has answered or flagged or commneted on the question. It creates a coders object with coder information
 * that will be used to retrieve avatars. The coder is only added in if it doesn't already exist so as to not retrieve
 * the avatar multiple times.
 *
 * @param {Object} api
 * @param {Object} action
 * @param {Number} questionId
 * @param {Object} userImages
 * @returns {{ codedQuestionObj: Object, coders: Object, coderError: Object }}
 */
const getCoderInformation = async ({ api, action, questionId, userImages }) => {
  let codedQuestionObj = {}, allCodedQuestions = [], coderErrors = {}, coders = {}

  try {
    allCodedQuestions = await api.getAllCodedQuestionsForQuestion({}, {}, {
      projectId: action.projectId,
      jurisdictionId: action.jurisdictionId,
      questionId: questionId
    })
  } catch (e) {
    coderErrors = { allCodedQuestions: 'Failed to get all the user coded answers for this question.' }
  }

  if (allCodedQuestions.length === 0) {
    codedQuestionObj = { [questionId]: { answers: [], flagsComments: [] } }
  }

  for (let coderUser of allCodedQuestions) {
    console.log(coderUser)
    if (coderUser.codedQuestions.length > 0) {
      codedQuestionObj = { ...mergeInUserCodedQuestions(codedQuestionObj, coderUser.codedQuestions, coderUser.coder) }
    }

    // Add all unique coders (later to be used for avatars)
    if (!checkIfExists(coderUser.coder, coders, 'userId') && !checkIfExists(coderUser.coder, userImages, 'userId')) {
      coders = { ...coders, [coderUser.coder.userId]: { ...coderUser.coder } }
    }
  }

  return { codedQuestionObj, coderErrors, coders }
}

/**
 * Updates the action creator values with the jurisdictionEmpty state and current userId before sending it to
 * the reducer for getting the coding scheme outline.
 */
const outlineLogic = createLogic({
  type: [types.GET_CODING_OUTLINE_REQUEST, types.GET_VALIDATION_OUTLINE_REQUEST],
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
 * Handles getting the coding scheme outline for the project
 */
export const getOutlineLogic = createLogic({
  type: types.GET_CODING_OUTLINE_REQUEST,
  async process({ action, getState, api }, dispatch, done) {
    let payload = action.payload
    const userId = action.userId

    // Try to get the project coding scheme
    try {
      const { firstQuestion, tree, order, outline, questionsById, isSchemeEmpty } = await getSchemeAndInitialize(action.projectId, api)

      // Get user coded questions for currently selected jurisdiction
      if (action.payload.areJurisdictionsEmpty || isSchemeEmpty) {
        payload = { ...payload, isSchemeEmpty }
      } else {
        const { codedValQuestions, codedValErrors } = await getCodedValidatedQuestions(action.projectId, action.jurisdictionId, userId, api.getUserCodedQuestions)

        // Initialize the user answers object
        const userAnswers = initializeUserAnswers([initializeNextQuestion(firstQuestion), ...codedValQuestions], questionsById, userId)

        payload = {
          ...payload,
          outline: outline,
          scheme: { byId: questionsById, tree, order },
          userAnswers,
          question: firstQuestion,
          errors: { ...codedValErrors }
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

/**
 * Logic for when the user first opens the validation screen
 */
export const getValidationOutlineLogic = createLogic({
  type: types.GET_VALIDATION_OUTLINE_REQUEST,
  async process({ action, getState, api }, dispatch, done) {
    let errors = {}, payload = action.payload, userImages = {}, coders = {}
    const userId = action.userId

    try {
      // Try to get the project coding scheme
      const { firstQuestion, tree, order, questionsById, outline, isSchemeEmpty } = await getSchemeAndInitialize(action.projectId, api)

      // If there are flags for this question, then we need to add the flag raiser to our coders object
      if (firstQuestion.flags.length > 0) {
        coders = { ...coders, [firstQuestion.flags[0].raisedBy.userId]: { ...firstQuestion.flags[0].raisedBy } }
      }

      // Get user coded questions for currently selected jurisdiction
      if (action.payload.areJurisdictionsEmpty || isSchemeEmpty) {
        payload = { ...payload, isSchemeEmpty }
      } else {
        const { codedValQuestions, codedValErrors } = await getCodedValidatedQuestions(action.projectId, action.jurisdictionId, userId, api.getValidatedQuestions)

        // Initialize the user answers object
        const userAnswers = initializeUserAnswers([initializeNextQuestion(firstQuestion), ...codedValQuestions], questionsById, userId)

        // Get all the coded questions for this question
        const coderInfo = await getCoderInformation({
          api,
          action,
          questionId: firstQuestion.id,
          userImages
        })

        // Update coders from the getCoderInformation method
        coders = { ...coders, ...coderInfo.coders }

        // Get all the user information for validated questions
        for (let valQuestion of codedValQuestions) {
          if (!checkIfExists(valQuestion.validatedBy, coders, 'userId')) {
            coders = { ...coders, [valQuestion.validatedBy.userId]: { ...valQuestion.validatedBy } }
          }
        }

        // Get all the avatars I need
        for (let userId of Object.keys(coders)) {
          try {
            const avatar = await api.getUserImage({}, {}, { userId })
            coders[userId] = { ...coders[userId], avatar }
          } catch (error) {
            errors = { ...errors, userImages: 'Failed to get images' }
          }
        }

        payload = {
          ...payload,
          outline,
          scheme: { byId: questionsById, tree, order },
          userAnswers,
          mergedUserQuestions: coderInfo.codedQuestionObj,
          userImages: coders,
          question: firstQuestion,
          errors: { ...errors, ...codedValErrors, ...coderInfo.coderErrors }
        }
      }

      dispatch({
        type: types.GET_VALIDATION_OUTLINE_SUCCESS,
        payload
      })
    } catch (e) {
      dispatch({
        type: types.GET_VALIDATION_OUTLINE_FAIL,
        payload: 'Couldn\'t get outline',
        error: true
      })
    }
    done()
  }
})

/**
 * The logic is invoked when the user has made changes to a question.
 */
const answerQuestionLogic = createLogic({
  type: types.SAVE_USER_ANSWER_REQUEST,
  debounce: 350,

  /**
   * It updates the action creator values and validates
   * that the action should follow through and be sent to the reducers. It updates the action creator values with the
   * final object that should be sent in the request body, the api methods to use, state and userId.
   *
   * It validates that the action should be sent to the reducers to send a request to the API to save the users answer.
   * It will reject the action for a couple different reasons: if there are not unsaved changes, then no need to allow
   * the action. It will also reject if a POST request has already been sent but has not returned a response yet. This
   * is to prevent duplication of codedQuestions and duplicate POST requests being sent. If the app is still waiting on
   * a response then this will reject and dispatch ADD_REQUESTS_TO_QUEUE action to add all of the requests to a queue
   * that will be sent when the app gets a response.
   */
  validate({ getState, action, api }, allow, reject) {
    const state = getState().scenes.codingValidation.coding
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
        reject({ type: types.ADD_REQUEST_TO_QUEUE, payload: answerObject })
      } else {
        allow({ ...action, payload: { ...answerObject, selectedCategoryId: action.selectedCategoryId }, apiMethods })
      }
    } else {
      reject()
    }
  },

  /**
   * Handles actually sending the requests to the API. If the final questionObj (that was created in the validate
   * function above) has an ID a PUT request is sent, otherwise a POST request is sent. This will also send or clear
   * out any messages hanging in the queue for the questionId. If there's an error with the request and the error code
   * is OBJECT_EXISTS, then a message error action is dispatched.
   */
  async process({ getState, action, api }, dispatch, done) {
    let respCodedQuestion = {}

    try {
      if (action.payload.questionObj.hasOwnProperty('id')) {
        respCodedQuestion = await action.apiMethods.update(action.payload.questionObj, {}, { ...action.payload })

        // Remove any pending requests from the queue because this is the latest one and has an id
        dispatch({
          type: types.REMOVE_REQUEST_FROM_QUEUE,
          payload: { questionId: action.payload.questionId, categoryId: action.payload.selectedCategoryId }
        })
      } else {
        respCodedQuestion = await action.apiMethods.create(action.payload.questionObj, {}, { ...action.payload })
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
        },
        page: action.page,
        apiUpdateMethod: action.apiMethods.update
      })

      dispatch({
        type: types.UPDATE_EDITED_FIELDS,
        projectId: action.payload.projectId
      })
    } catch (error) {
      if (error.response.status === 303) {
        dispatch({
          type: types.OBJECT_EXISTS,
          payload: {
            selectedCategoryId: action.payload.selectedCategoryId,
            questionId: action.payload.questionId,
            object: initializeValues(error.response.data)
          }
        })
      } else {
        dispatch({
          type: types.SAVE_USER_ANSWER_FAIL,
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
  type: types.ON_APPLY_ANSWER_TO_ALL,
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
    const state = getState().scenes.codingValidation.coding
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
          type: types.SAVE_USER_ANSWER_SUCCESS,
          payload: { ...respCodedQuestion, questionId: action.questionId, selectedCategoryId: category.categoryId }
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

/**
 * Logic for sending / handling requests hanging in the queue
 */
const sendMessageLogic = createLogic({
  type: types.SEND_QUEUE_REQUESTS,
  /**
   * Finds all of the messages to send for the question in the action.payload object. Validates that there are actual
   * messages that need to be sent, otherwise rejects the action.
   */
  validate({ getState, action }, allow, reject) {
    const messageQueue = getState().scenes.codingValidation.coding.messageQueue
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
        type: types.SAVE_USER_ANSWER_SUCCESS,
        payload: {
          ...respCodedQuestion,
          questionId: action.payload.questionId,
          selectedCategoryId: action.payload.selectedCategoryId
        }
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

/**
 * Logic for getting coded / validated questions, transforms the action creator values with the correct question
 * information
 */
const getCodedValQuestionsLogic = createLogic({
  type: [types.GET_USER_CODED_QUESTIONS_REQUEST, types.GET_USER_VALIDATED_QUESTIONS_REQUEST],
  transform({ getState, action }, next) {
    const state = getState().scenes.codingValidation.coding
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

/**
 * Sends requests for: getting updated scheme question information, getting the coded question for current user.
 * Initializes the userAnswers object that will be in the redux state with the codedQuestions information.
 */
export const getUserCodedQuestionsLogic = createLogic({
  type: types.GET_USER_CODED_QUESTIONS_REQUEST,
  async process({ action, api, getState }, dispatch, done) {
    const userId = getState().data.user.currentUser.id
    const state = getState().scenes.codingValidation.coding
    const question = action.question, otherUpdates = action.otherUpdates
    let errors = {}, payload = {}

    const { codedValQuestions, codedValErrors } = await getCodedValidatedQuestions(action.projectId, action.jurisdictionId, userId, api.getUserCodedQuestions)

    const { updatedScheme, schemeErrors, updatedSchemeQuestion } = await getSchemeQuestionAndUpdate(action.projectId, state, question, api)

    // Update the user answers object
    const userAnswers = initializeUserAnswers([initializeNextQuestion(updatedSchemeQuestion), ...codedValQuestions], updatedScheme.byId, userId)

    payload = {
      question: { ...state.scheme.byId[updatedSchemeQuestion.id], ...updatedSchemeQuestion },
      userAnswers,
      scheme: updatedScheme,
      otherUpdates,
      errors: { ...errors, ...codedValErrors, ...schemeErrors }
    }

    dispatch({
      type: types.GET_USER_CODED_QUESTIONS_SUCCESS,
      payload
    })
    done()
  }
})

/**
 * Sends a request to save a red flag for a question
 */
const saveRedFlagLogic = createLogic({
  type: types.ON_SAVE_RED_FLAG_REQUEST,
  async process({ action, api }, dispatch, done) {
    try {
      const flag = { ...action.flagInfo, raisedBy: action.flagInfo.raisedBy.userId }
      const resp = await api.saveRedFlag(flag, {}, { questionId: action.questionId })
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

/**
 Some of the reusable functions need to know whether we're on the validation screen or not, so that's what this is for
 */
export const updateValidatorLogic = createLogic({
  type: [types.UPDATE_USER_ANSWER, types.ON_APPLY_ANSWER_TO_ALL],
  transform({ action, getState }, next) {
    next({
      ...action,
      otherProps: { validatedBy: { ...getState().data.user.currentUser } },
      isValidation: action.page === 'validation'
    })
  }
})

/**
 * Transforms the action creator values with the current userId and information about the new question to show. It
 * determines the question to show based on the way the user navigated to it.
 *
 * Logic for when the user navigates to a question. It gets the updated scheme question information as well as the coded
 * and validated questions for the new question. It updates the mergedUserQuestions state property and gets any avatars
 * based on the coded / validation questions that it needs to.
 */
const getQuestionLogic = createLogic({
  type: [types.GET_PREV_QUESTION, types.GET_NEXT_QUESTION, types.ON_QUESTION_SELECTED_IN_NAV],
  transform({ getState, action }, next) {
    const state = getState().scenes.codingValidation.coding
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

    next({
      ...action,
      questionInfo,
      userId
    })
  },
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_QUESTION_SUCCESS,
    failType: types.GET_QUESTION_FAIL
  },
  latest: true,
  async process({ getState, action, api }) {
    let otherErrors = {}
    const state = getState().scenes.codingValidation.coding
    if (action.page === 'coding') {
      const response = await getSelectedQuestion(state, action, api, action.userId, action.questionInfo, api.getCodedQuestion)
      return response
    } else {
      const {
        updatedState,
        question,
        currentIndex,
        errors,
        newImages
      } = await getSelectedQuestion(state, action, api, action.userId, action.questionInfo, api.getUserValidatedQuestion, state.userImages)
      const { codedQuestionObj, coderErrors, coders } = await getCoderInformation({
        api,
        action,
        questionId: question.id,
        userImages: { ...state.userImages, ...newImages }
      })

      const newCoderImages = { ...newImages, ...coders }
      for (let userId of Object.keys(newCoderImages)) {
        try {
          const avatar = await api.getUserImage({}, {}, { userId })
          newCoderImages[userId] = { ...newCoderImages[userId], avatar }
        } catch (error) {
          otherErrors = { ...otherErrors, userImages: 'Failed to get images' }
        }
      }

      return {
        updatedState: { ...updatedState, mergedUserQuestions: { ...state.mergedUserQuestions, ...codedQuestionObj } },
        question,
        currentIndex,
        errors: { ...errors, ...coderErrors, ...otherErrors },
        userImages: { ...state.userImages, ...newCoderImages }
      }
    }
  }
})

/**
 * Logic for when the validator changes jurisdictions on the validation screen. Gets the coded and validation questions
 * for the question current visible as well as the updated scheme question information. It updates the
 * mergedUserQuestions state property like the logic above, with avatar and user information.
 */
export const getUserValidatedQuestionsLogic = createLogic({
  type: types.GET_USER_VALIDATED_QUESTIONS_REQUEST,
  async process({ action, api, getState }, dispatch, done) {
    const userId = getState().data.user.currentUser.id
    const state = getState().scenes.codingValidation.coding
    const question = action.question, otherUpdates = action.otherUpdates
    let errors = {}, payload = {}, coders = {}

    // Get validated questions for this jurisdiction
    const { codedValQuestions, codedValErrors } = await getCodedValidatedQuestions(action.projectId, action.jurisdictionId, userId, api.getValidatedQuestions)

    // Get updated scheme question in case changes have been made
    const { updatedScheme, schemeErrors, updatedSchemeQuestion } = await getSchemeQuestionAndUpdate(action.projectId, state, question, api)

    // If there are flags for this question, then we need to add the flag raiser to our coders object
    if (updatedSchemeQuestion.flags.length > 0) {
      if (!checkIfExists(updatedSchemeQuestion.flags[0].raisedBy, state.userImages, 'userId')) {
        coders = {
          ...coders,
          [updatedSchemeQuestion.flags[0].raisedBy.userId]: { ...updatedSchemeQuestion.flags[0].raisedBy }
        }
      }
    }

    const userAnswers = initializeUserAnswers([initializeNextQuestion(updatedSchemeQuestion), ...codedValQuestions], updatedScheme.byId, userId)

    const coderInfo = await getCoderInformation({
      api,
      action,
      questionId: updatedSchemeQuestion.id,
      userImages: { ...state.userImages, ...coders }
    })

    coders = { ...coders, ...coderInfo.coders }
    for (let userId of Object.keys(coders)) {
      try {
        const avatar = await api.getUserImage({}, {}, { userId })
        coders[userId] = { ...coders[userId], avatar }
      } catch (error) {
        errors = { ...errors, userImages: 'Failed to get images' }
      }
    }

    payload = {
      userAnswers,
      question: { ...state.scheme.byId[updatedSchemeQuestion.id], ...updatedSchemeQuestion },
      scheme: updatedScheme,
      otherUpdates,
      mergedUserQuestions: coderInfo.codedQuestionObj,
      errors: { ...errors, ...coderInfo.coderErrors, ...schemeErrors, ...codedValErrors },
      userImages: { ...state.userImages, ...coders }
    }

    dispatch({
      type: types.GET_USER_VALIDATED_QUESTIONS_SUCCESS,
      payload
    })
    done()
  }
})

/**
 * Sends a request to the API to clear the flag based on the action.flagId, type 1 === red, type 2 === other
 */
export const clearFlagLogic = createLogic({
  type: [types.CLEAR_RED_FLAG, types.CLEAR_FLAG],
  async process({ action, api }, dispatch, done) {
    try {
      const out = await api.clearFlag({}, {}, { flagId: action.flagId })
      dispatch({
        type: types.CLEAR_FLAG_SUCCESS,
        payload: {
          ...out, flagId: action.flagId, type: action.type === types.CLEAR_RED_FLAG ? 1 : 2
        }
      })
      dispatch({ type: types.UPDATE_EDITED_FIELDS, projectId: action.projectId })
    } catch (error) {
      dispatch({
        type: types.CLEAR_FLAG_FAIL,
        payload: 'We couldn\'t clear this flag.'
      })
    }
    done()
  }
})

export default [
  outlineLogic,
  getQuestionLogic,
  answerQuestionLogic,
  applyAnswerToAllLogic,
  sendMessageLogic,
  getCodedValQuestionsLogic,
  getOutlineLogic,
  getUserCodedQuestionsLogic,
  saveRedFlagLogic,
  updateValidatorLogic,
  getUserValidatedQuestionsLogic,
  getValidationOutlineLogic,
  clearFlagLogic,
  ...documentListLogic
]
