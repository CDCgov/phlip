import {
  initializeUserAnswers,
  initializeCodedUsers, handleCheckCategories
} from 'utils/codingHelpers'
import { sortList } from 'utils'
import * as codingValidationTypes from 'scenes/Validation/actionTypes'
import * as otherActionTypes from 'components/CodingValidation/actionTypes'
const types = { ...codingValidationTypes, ...otherActionTypes }

const INITIAL_STATE = {
  question: {},
  scheme: null,
  outline: {},
  jurisdiction: undefined,
  jurisdictionId: undefined,
  currentIndex: 0,
  categories: undefined,
  selectedCategory: 0,
  userAnswers: {},
  showNextButton: true,
  mergedUserQuestions: [],
  selectedCategoryId: null,
  isSchemeEmpty: null,
  areJurisdictionsEmpty: null,
  schemeError: null
}

const validationReducer = (state = INITIAL_STATE, action) => {
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
          schemeError: null
        }
      } else {
        sortList(action.payload.question.possibleAnswers, 'order', 'asc')
        return {
          ...state,
          outline: action.payload.outline,
          scheme: action.payload.scheme,
          question: action.payload.question,
          userAnswers: action.payload.userAnswers,
          mergedUserQuestions: action.payload.mergedUserQuestions,
          categories: undefined,
          isSchemeEmpty: false,
          areJurisdictionsEmpty: false,
          schemeError: null
        }
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
              [action.questionId]: {
                ...state.scheme.byId[action.questionId],
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
          if (item.id === action.flagId) {
            flagIndex = i
          }
          return item.id === action.flagId
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
      return {
        ...state,
        userAnswers: action.payload.userAnswers,
        question: action.payload.question,
        scheme: action.payload.scheme,
        mergedUserQuestions: action.payload.mergedUserQuestions,
        ...action.payload.otherUpdates,
      }

    case types.GET_VALIDATION_OUTLINE_FAIL:
      return {
        ...state,
        schemeError: action.payload
      }

    case types.CLEAR_RED_FLAG:
    case types.CLEAR_FLAG:
    case types.GET_VALIDATION_OUTLINE_REQUEST:
    case types.GET_USER_VALIDATED_QUESTIONS_REQUEST:
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
  'CLEAR_FLAG',
  'CLEAR_RED_FLAG',
  'CLEAR_FLAG_SUCCESS',
  'CLEAR_FLAG_FAIL'
]

export default validationReducer