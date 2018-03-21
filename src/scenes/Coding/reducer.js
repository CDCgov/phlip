import {
  handleUpdateUserCodedQuestion,
  handleUpdateUserCategoryChild,
} from 'utils/codingHelpers'
import { sortList } from 'utils'
import * as codingValidationTypes from 'scenes/Coding/actionTypes'
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
  selectedCategoryId: null,
  userAnswers: {},
  showNextButton: true,
  mergedUserQuestions: null
}

const codingReducer = (state = INITIAL_STATE, action) => {
  const questionUpdater = state.question.isCategoryQuestion
    ? handleUpdateUserCategoryChild(state, action)
    : handleUpdateUserCodedQuestion(state, action)

  switch (action.type) {
    case types.GET_CODING_OUTLINE_SUCCESS:
      if (action.payload.isSchemeEmpty || action.payload.areJurisdictionsEmpty) {
        return {
          ...state,
          scheme: { order: [], byId: {}, tree: [] },
          outline: {},
          question: {},
          userAnswers: {},
          categories: undefined,
          areJurisdictionsEmpty: action.payload.areJurisdictionsEmpty,
          isSchemeEmpty: action.payload.isSchemeEmpty
        }
      } else {
        sortList(action.payload.question.possibleAnswers, 'order', 'asc')
        return {
          ...state,
          outline: action.payload.outline,
          scheme: action.payload.scheme,
          question: action.payload.question,
          userAnswers: action.payload.userAnswers,
          categories: undefined,
          areJurisdictionsEmpty: false,
          isSchemeEmpty: false
        }
      }

    case types.ON_SAVE_RED_FLAG:
      const curQuestion = { ...state.scheme.byId[action.questionId] }
      return {
        ...state,
        question: {
          ...state.question,
          flags: [action.flagInfo]
        },
        scheme: {
          ...state.scheme,
          byId: {
            ...state.scheme.byId,
            [action.questionId]: {
              ...curQuestion,
              flags: [action.flagInfo]
            }
          }
        }
      }

    case types.ON_SAVE_FLAG:
      return {
        ...state,
        ...questionUpdater('flag', action.flagInfo)
      }

    case types.GET_USER_CODED_QUESTIONS_SUCCESS:
      return {
        ...state,
        userAnswers: action.payload.userAnswers,
        question: action.payload.question,
        scheme: action.payload.scheme,
        ...action.payload.otherUpdates,
      }

    case types.GET_USER_CODED_QUESTIONS_REQUEST:
    case types.GET_CODING_OUTLINE_REQUEST:
    default:
      return state
  }
}

export const codingHandlers = [
  'GET_CODING_OUTLINE_REQUEST',
  'GET_CODING_OUTLINE_SUCCESS',
  'GET_USER_CODED_QUESTIONS_REQUEST',
  'GET_USER_CODED_QUESTIONS_SUCCESS',
  'ON_SAVE_RED_FLAG',
  'ON_SAVE_FLAG'
]

export default codingReducer