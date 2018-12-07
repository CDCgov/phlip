import { generateError } from 'utils/codingHelpers'
import * as codingValidationTypes from 'scenes/Validation/actionTypes'
import { types as otherActionTypes } from 'components/CodingValidation/actions'
const types = { ...codingValidationTypes, ...otherActionTypes }
import { INITIAL_STATE } from 'components/CodingValidation/reducer'

/**
 * Main validation reducer, that is the 'uniqueReducer' that is used when handling actions that are not common to both
 * Coding and Validation
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
const validationReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.GET_VALIDATION_OUTLINE_SUCCESS:
      const error = generateError(action.payload.errors)
      return {
        ...state,
        outline: action.payload.outline,
        scheme: action.payload.scheme,
        question: action.payload.question,
        userAnswers: action.payload.userAnswers,
        mergedUserQuestions: action.payload.mergedUserQuestions,
        userImages: action.payload.userImages,
        categories: undefined,
        isSchemeEmpty: action.payload.isSchemeEmpty,
        areJurisdictionsEmpty: action.payload.areJurisdictionsEmpty,
        schemeError: null,
        getQuestionErrors: error.length > 0 ? error : null,
        codedQuestionsError: action.payload.errors.hasOwnProperty('codedValQuestions') ? true : null,
        isLoadingPage: false,
        showPageLoader: false
      }

    case types.GET_VALIDATION_OUTLINE_REQUEST:
      return {
        ...state,
        isLoadingPage: true
      }

    case types.GET_VALIDATION_OUTLINE_FAIL:
      return {
        ...state,
        schemeError: action.payload,
        isLoadingPage: false,
        showPageLoader: false
      }

    case types.CLEAR_FLAG_SUCCESS:
      if (action.payload.type === 1) {
        return {
          ...state,
          question: { ...state.question, flags: [] },
          scheme: {
            ...state.scheme,
            byId: {
              ...state.scheme.byId,
              [state.question.id]: {
                ...state.scheme.byId[state.question.id],
                flags: []
              }
            }
          }
        }
      } else {
        let flagIndex = null

        const flagComments = state.question.isCategoryQuestion
          ? state.mergedUserQuestions[state.question.id][state.selectedCategoryId].flagsComments
          : state.mergedUserQuestions[state.question.id].flagsComments

        const { id, type, notes, raisedAt, ...flag } = flagComments.find((item, i) => {
          if (item.id === action.payload.flagId) {
            flagIndex = i
          }
          return item.id === action.payload.flagId
        })

        if (Object.keys(flag).length === 1) {
          flagComments.splice(flagIndex, 1)
        } else {
          if (flag.comment.length === 0) {
            flagComments.splice(flagIndex, 1)
          } else {
            flagComments.splice(flagIndex, 1, flag)
          }
        }

        return {
          ...state,
          mergedUserQuestions: {
            ...state.mergedUserQuestions,
            [state.question.id]: {
              ...state.mergedUserQuestions[state.question.id],
              ...state.question.isCategoryQuestion
                ? {
                  [state.selectedCategoryId]: {
                    ...state.mergedUserQuestions[state.question.id][state.selectedCategoryId],
                    flagComments
                  }
                }
                : {
                  flagComments
                }
            }
          }
        }
      }

    case types.CLEAR_FLAG_FAIL:
      return {
        ...state,
        saveFlagErrorContent: 'We couldn\'t clear this flag.'
      }

    case types.GET_USER_VALIDATED_QUESTIONS_SUCCESS:
      const errors = generateError(action.payload.errors)
      return {
        ...state,
        userAnswers: action.payload.userAnswers,
        question: action.payload.question,
        scheme: action.payload.scheme,
        mergedUserQuestions: action.payload.mergedUserQuestions,
        getQuestionErrors: errors.length > 0 ? errors : null,
        codedQuestionsError: action.payload.errors.hasOwnProperty('codedValQuestions') ? true : null,
        userImages: action.payload.userImages,
        isLoadingPage: false,
        showPageLoader: false,
        ...action.payload.otherUpdates
      }

    case types.GET_USER_VALIDATED_QUESTIONS_REQUEST:
      return {
        ...state,
        codedQuestionsError: null,
        isLoadingPage: true
      }

    case types.GET_USER_VALIDATED_QUESTIONS_FAIL:
      return {
        ...state,
        getQuestionErrors: '',
        isLoadingPage: false,
        showPageLoader: false
      }

    case types.CLEAR_RED_FLAG:
    case types.CLEAR_FLAG:
    default:
      return state
  }
}

/**
 * All of these actions will be handled by this reducer and not the reducer in `components/CodingValidation/reducer`
 */
export const validationHandlers = [
  'GET_VALIDATION_OUTLINE_REQUEST',
  'GET_VALIDATION_OUTLINE_SUCCESS',
  'GET_VALIDATION_OUTLINE_FAIL',
  'GET_USER_VALIDATED_QUESTIONS_REQUEST',
  'GET_USER_VALIDATED_QUESTIONS_SUCCESS',
  'GET_USER_VALIDATED_QUESTIONS_FAIL',
  'CLEAR_FLAG',
  'CLEAR_RED_FLAG',
  'CLEAR_FLAG_SUCCESS',
  'CLEAR_FLAG_FAIL'
]

export default validationReducer