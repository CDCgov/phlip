import {
  handleUpdateUserCodedQuestion,
  handleUpdateUserCategoryChild,
  generateError
} from 'utils/codingHelpers'
import * as codingValidationTypes from 'scenes/Coding/actionTypes'
import { types as otherActionTypes } from 'components/CodingValidation/actions'
import { INITIAL_STATE } from 'components/CodingValidation/reducer'

const types = { ...codingValidationTypes, ...otherActionTypes }

/**
 * Main coding reducer, that is the 'uniqueReducer' that is used when handling actions that are not common to both Coding
 * and Validation
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
const codingReducer = (state = INITIAL_STATE, action) => {
  const questionUpdater = state.question.isCategoryQuestion
    ? handleUpdateUserCategoryChild(state, action)
    : handleUpdateUserCodedQuestion(state, action)

  switch (action.type) {
    case types.GET_CODING_OUTLINE_SUCCESS:
      const error = generateError(action.payload.errors)
      return {
        ...state,
        outline: action.payload.outline,
        scheme: action.payload.scheme,
        question: action.payload.question,
        userAnswers: action.payload.userAnswers,
        categories: undefined,
        areJurisdictionsEmpty: action.payload.areJurisdictionsEmpty,
        isSchemeEmpty: action.payload.isSchemeEmpty,
        schemeError: null,
        getQuestionErrors: error.length > 0 ? error : null,
        codedQuestionsError: action.payload.errors.hasOwnProperty('codedValQuestions') ? true : null,
        isLoadingPage: false,
        showPageLoader: false
      }

    case types.GET_CODING_OUTLINE_REQUEST:
      return {
        ...state,
        isLoadingPage: true
      }

    case types.GET_CODING_OUTLINE_FAIL:
      return {
        ...state,
        schemeError: action.payload,
        isLoadingPage: false,
        showPageLoader: false
      }

    case types.ON_SAVE_RED_FLAG_SUCCESS:
      const curQuestion = { ...state.scheme.byId[state.question.id] }
      return {
        ...state,
        question: {
          ...state.question,
          flags: [action.payload]
        },
        scheme: {
          ...state.scheme,
          byId: {
            ...state.scheme.byId,
            [state.question.id]: {
              ...curQuestion,
              flags: [action.payload]
            }
          }
        },
        unsavedChanges: false
      }

    case types.ON_SAVE_RED_FLAG_FAIL:
      return {
        ...state,
        saveFlagErrorContent: 'We couldn\'t save the red flag for this question.',
        saveFailed: true
      }

    case types.ON_SAVE_FLAG:
      return {
        ...state,
        ...questionUpdater('flag', action.flagInfo),
        unsavedChanges: true
      }

    case types.GET_USER_CODED_QUESTIONS_SUCCESS:
      const errors = generateError(action.payload.errors)
      return {
        ...state,
        userAnswers: action.payload.userAnswers,
        question: action.payload.question,
        scheme: action.payload.scheme,
        getQuestionErrors: errors.length > 0 ? errors : null,
        codedQuestionsError: action.payload.errors.hasOwnProperty('codedValQuestions') ? true : null,
        isLoadingPage: false,
        showPageLoader: false,
        unsavedChanges: false,
        ...action.payload.otherUpdates
      }

    case types.GET_USER_CODED_QUESTIONS_FAIL:
      return {
        ...state,
        getQuestionsError: '',
        isLoadingPage: false,
        showPageLoader: false
      }

    case types.GET_USER_CODED_QUESTIONS_REQUEST:
      return {
        ...state,
        codedQuestionsError: null,
        isLoadingPage: true
      }

    case types.ON_SAVE_RED_FLAG_REQUEST:
      return {
        ...state,
        unsavedChanges: true,
        saveFailed: false
      }

    default:
      return state
  }
}

/**
 * All of these actions will be handled by this reducer and not the reducer in `components/CodingValidation/reducer`
 */
export const codingHandlers = [
  'GET_CODING_OUTLINE_REQUEST',
  'GET_CODING_OUTLINE_SUCCESS',
  'GET_CODING_OUTLINE_FAIL',
  'GET_USER_CODED_QUESTIONS_REQUEST',
  'GET_USER_CODED_QUESTIONS_SUCCESS',
  'ON_SAVE_RED_FLAG_REQUEST',
  'ON_SAVE_RED_FLAG_SUCCESS',
  'ON_SAVE_RED_FLAG_FAIL',
  'ON_SAVE_FLAG'
]

export default codingReducer