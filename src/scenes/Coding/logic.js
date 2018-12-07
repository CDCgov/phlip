/**
 * The unique logic for Coding scene
 */

import { createLogic } from 'redux-logic'
import {
  initializeUserAnswers,
  getSelectedQuestion,
  initializeNextQuestion,
  getSchemeAndInitialize,
  getCodedValidatedQuestions,
  getSchemeQuestionAndUpdate
} from 'utils/codingHelpers'
import * as types from './actionTypes'

/**
 * Sends a request to get the coding scheme outline and the coded questions for the current user
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
        const { codedValQuestions, codedValErrors } = await getCodedValidatedQuestions(
          action.projectId, action.jurisdictionId, userId, api.getUserCodedQuestions
        )

        // Initialize the user answers object
        const userAnswers = initializeUserAnswers(
          [initializeNextQuestion(firstQuestion), ...codedValQuestions], questionsById, userId
        )

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
 * Process of getting the next question, sends a request to the API to get updated scheme question, and coded answer for
 * that question
 */
export const getQuestionLogic = createLogic({
  type: [types.ON_QUESTION_SELECTED_IN_NAV, types.GET_NEXT_QUESTION, types.GET_PREV_QUESTION],
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_QUESTION_SUCCESS,
    failType: types.GET_QUESTION_FAIL
  },
  latest: true,
  async process({ getState, action, api }) {
    const state = getState().scenes.coding.coding
    return await getSelectedQuestion(state, action, api, action.userId, action.questionInfo, api.getCodedQuestion)
  }
})

/**
 * Sends requests for: getting updated scheme question information, getting the coded question for current user. Initializes
 * the userAnswers object that will be in the redux state with the codedQuestions information.
 *
 */
export const getUserCodedQuestionsLogic = createLogic({
  type: types.GET_USER_CODED_QUESTIONS_REQUEST,
  async process({ action, api, getState }, dispatch, done) {
    const userId = getState().data.user.currentUser.id
    const state = getState().scenes.coding.coding
    const question = action.question, otherUpdates = action.otherUpdates
    let errors = {}, payload = {}

    const { codedValQuestions, codedValErrors } = await getCodedValidatedQuestions(
      action.projectId, action.jurisdictionId, userId, api.getUserCodedQuestions
    )

    const { updatedScheme, schemeErrors, updatedSchemeQuestion } = await getSchemeQuestionAndUpdate(action.projectId, state, question, api)

    // Update the user answers object
    const userAnswers = initializeUserAnswers(
      [initializeNextQuestion(updatedSchemeQuestion), ...codedValQuestions], updatedScheme.byId, userId
    )

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

export default [
  getOutlineLogic,
  getQuestionLogic,
  getUserCodedQuestionsLogic,
  saveRedFlagLogic
]