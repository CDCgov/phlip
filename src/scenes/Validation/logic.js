/** Unique logic for Validation scene */

import { createLogic } from 'redux-logic'
import {
  initializeUserAnswers,
  getSelectedQuestion,
  checkIfExists,
  initializeNextQuestion,
  getSchemeAndInitialize,
  getCodedValidatedQuestions,
  getSchemeQuestionAndUpdate
} from 'utils/codingHelpers'
import * as types from './actionTypes'

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
            ...addCoderToAnswers(
              doesExist
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
  Some of the reusable functions need to know whether we're on the validation screen or not, so that's what this is for
 */
export const updateValidatorLogic = createLogic({
  type: [types.UPDATE_USER_ANSWER, types.ON_APPLY_ANSWER_TO_ALL],
  transform({ action, getState }, next) {
    next({
      ...action,
      otherProps: { validatedBy: { ...getState().data.user.currentUser } },
      isValidation: true
    })
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
        const { codedValQuestions, codedValErrors } = await getCodedValidatedQuestions(
          action.projectId, action.jurisdictionId, userId, api.getValidatedQuestions
        )

        // Initialize the user answers object
        const userAnswers = initializeUserAnswers(
          [initializeNextQuestion(firstQuestion), ...codedValQuestions], questionsById, userId
        )

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
 * Logic for when the user navigates to a question. It gets the updated scheme question information as well as the coded
 * and validated questions for the new question. It updates the mergedUserQuestions state property and gets any avatars
 * based on the coded / validation questions that it needs to.
 */
export const getQuestionLogicValidation = createLogic({
  type: [types.ON_QUESTION_SELECTED_IN_NAV, types.GET_NEXT_QUESTION, types.GET_PREV_QUESTION],
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_QUESTION_SUCCESS,
    failType: types.GET_QUESTION_FAIL
  },
  latest: true,
  async process({ getState, action, api }) {
    let otherErrors = {}
    const state = getState().scenes.validation.coding
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
})

/**
 * Logic for when the validator changes jurisdictions on the validation screen. Gets the coded and validation questions
 * for the question current visible as well as the updated scheme question information. It updates the mergedUserQuestions
 * state property like the logic above, with avatar and user information.
 */
export const getUserValidatedQuestionsLogic = createLogic({
  type: types.GET_USER_VALIDATED_QUESTIONS_REQUEST,
  async process({ action, api, getState }, dispatch, done) {
    const userId = getState().data.user.currentUser.id
    const state = getState().scenes.validation.coding
    const question = action.question, otherUpdates = action.otherUpdates
    let errors = {}, payload = {}, coders = {}

    // Get validated questions for this jurisdiction
    const { codedValQuestions, codedValErrors } = await getCodedValidatedQuestions(
      action.projectId, action.jurisdictionId, userId, api.getValidatedQuestions
    )

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

    const userAnswers = initializeUserAnswers(
      [initializeNextQuestion(updatedSchemeQuestion), ...codedValQuestions], updatedScheme.byId, userId
    )

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
  updateValidatorLogic,
  getUserValidatedQuestionsLogic,
  getQuestionLogicValidation,
  getValidationOutlineLogic,
  clearFlagLogic
]