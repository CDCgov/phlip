import {
  handleUpdateUserCodedQuestion,
  handleUpdateUserCategoryChild,
  generateError
} from 'utils/codingHelpers'
import { sortList } from 'utils'
import * as codingValidationTypes from 'scenes/Coding/actionTypes'
import * as otherActionTypes from 'components/CodingValidation/actionTypes'
const types = { ...codingValidationTypes, ...otherActionTypes }

const codingReducer = (state, action) => {
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
          isSchemeEmpty: action.payload.isSchemeEmpty,
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
          categories: undefined,
          areJurisdictionsEmpty: false,
          isSchemeEmpty: false,
          schemeError: null,
          getQuestionErrors: errors.length > 0 ? errors : null,
          codedQuestionsError: action.payload.errors.hasOwnProperty('codedQuestions') ? true : null,
          isLoadingPage: false,
          pageLoaderMessage: '',
          showPageLoader: false
        }
      }

    case types.GET_CODING_OUTLINE_REQUEST:
      return {
        ...state,
        isLoadingPage: true,
        pageLoaderMessage: 'We\'re retrieving the data...'
      }

    case types.GET_CODING_OUTLINE_FAIL:
      return {
        ...state,
        schemeError: action.payload,
        isLoadingPage: false,
        pageLoaderMessage: '',
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
       saveFlagErrorContent: 'We couldn\'t save the red flag for this question.'
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
        codedQuestionsError: action.payload.errors.hasOwnProperty('codedQuestions') ? true : null,
        isLoadingPage: false,
        pageLoaderMessage: '',
        showPageLoader: false,
        ...action.payload.otherUpdates,
      }

    case types.GET_USER_CODED_QUESTIONS_FAIL:
      return {
        ...state,
        getQuestionsError: '',
        isLoadingPage: false,
        pageLoaderMessage: '',
        showPageLoader: false
      }

    case types.GET_USER_CODED_QUESTIONS_REQUEST:
      return {
        ...state,
        codedQuestionsError: null,
        isLoadingPage: true,
        pageLoaderMessage: 'We\'re getting the data for this jurisdiction...'
      }

    case types.ON_SAVE_RED_FLAG_REQUEST:
      return {
        ...state,
        unsavedChanges: true
      }

    default:
      return state
  }
}

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