import {
  initializeUserAnswers,
  initializeCodedUsers, handleCheckCategories, generateError
} from 'utils/codingHelpers'
import { sortList } from 'utils'
import * as codingValidationTypes from 'scenes/Validation/actionTypes'
import * as otherActionTypes from 'components/CodingValidation/actionTypes'
const types = { ...codingValidationTypes, ...otherActionTypes }

const validationReducer = (state, action) => {
  switch (action.type) {
    case types.GET_VALIDATION_OUTLINE_SUCCESS:
      if (action.payload.isSchemeEmpty || action.payload.areJurisdictionsEmpty) {
        return {
          ...state,
          scheme: { order: [], byId: {}, tree: [] },
          outline: {},
          question: {},
          userAnswers: {},
          mergedUserQuestions: {},
          isSchemeEmpty: action.payload.isSchemeEmpty,
          areJurisdictionsEmpty: action.payload.areJurisdictionsEmpty,
          schemeError: null,
          isLoadingPage: false,
          pageLoaderMessage: '',
          showPageLoader: false
        }
      } else {
        sortList(action.payload.question.possibleAnswers, 'order', 'asc')
        const errors = generateError(action.payload.errors)
        return {
          ...state,
          outline: action.payload.outline,
          scheme: action.payload.scheme,
          question: action.payload.question,
          userAnswers: action.payload.userAnswers,
          mergedUserQuestions: action.payload.mergedUserQuestions,
          userImages: action.payload.userImages,
          categories: undefined,
          isSchemeEmpty: false,
          areJurisdictionsEmpty: false,
          schemeError: null,
          getQuestionErrors: errors.length > 0 ? errors : null,
          codedQuestionsError: action.payload.errors.hasOwnProperty('codedQuestions') ? true : null,
          isLoadingPage: false,
          pageLoaderMessage: '',
          showPageLoader: false
        }
      }

    case types.GET_VALIDATION_OUTLINE_REQUEST:
      return {
        ...state,
        isLoadingPage: true,
        pageLoaderMessage: 'We\'re retrieving the data...'
      }

    case types.GET_VALIDATION_OUTLINE_FAIL:
      return {
        ...state,
        schemeError: action.payload,
        isLoadingPage: false,
        pageLoaderMessage: '',
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
        codedQuestionsError: action.payload.errors.hasOwnProperty('codedQuestions') ? true : null,
        userImages: action.payload.userImages,
        isLoadingPage: false,
        pageLoaderMessage: '',
        showPageLoader: false,
        ...action.payload.otherUpdates,
      }

    case types.GET_USER_VALIDATED_QUESTIONS_REQUEST:
      return {
        ...state,
        codedQuestionsError: null,
        isLoadingPage: true,
        pageLoaderMessage: 'We\'re getting the data for this jurisdiction...'
      }

    case types.GET_USER_VALIDATED_QUESTIONS_FAIL:
      return {
        ...state,
        getQuestionErrors: '',
        isLoadingPage: false,
        pageLoaderMessage: '',
        showPageLoader: false
      }

    case types.CLEAR_RED_FLAG:
    case types.CLEAR_FLAG:
    default:
      return state
  }
}

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