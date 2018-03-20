import { normalize } from 'utils'
import {
  determineShowButton,
  handleUpdateUserAnswers,
  handleUpdateUserCodedQuestion,
  handleUpdateUserCategoryChild,
  handleClearAnswers,
  initializeUserAnswers,
  handleUserPinciteQuestion,
  initializeNavigator,
  initializeCodedUsers
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
  selectedCategoryId: null
}

const validationReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.GET_QUESTION_SUCCESS:
      return state

    case types.GET_VALIDATION_OUTLINE_SUCCESS:
      if (action.payload.isSchemeEmpty) {
        return {
          ...state,
          scheme: { order: [], byId: {}, tree: [] },
          outline: {},
          question: {},
          userAnswers: {},
          mergedUserQuestions: {}
        }
      } else {
        const normalizedQuestions = normalize.arrayToObject(action.payload.scheme)
        sortList(action.payload.question.possibleAnswers, 'order', 'asc')
        return {
          ...state,
          outline: action.payload.outline,
          scheme: {
            byId: normalizedQuestions,
            order: action.payload.questionOrder,
            tree: action.payload.tree
          },
          question: action.payload.question,
          userAnswers: initializeUserAnswers(
            [
              { schemeQuestionId: action.payload.question.id, comment: '', codedAnswers: [] },
              ...action.payload.codedQuestions
            ], normalizedQuestions, action.payload.userId
          ),
          mergedUserQuestions: action.payload.mergedUserQuestions
        }
      }

    case types.CLEAR_FLAG:
      let flagIndex = null

      const flagComments = state.question.isCategoryQuestion
        ? state.mergedUserQuestions[action.questionId][state.selectedCategoryId].flagsComments
        : state.mergedUserQuestions[action.questionId].flagsComments

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
          [action.questionId]: {
            ...state.mergedUserQuestions[action.questionId],
            ...state.question.isCategoryQuestion
              ? {
                [state.selectedCategoryId]: {
                  ...state.mergedUserQuestions[action.questionId][state.selectedCategoryId],
                  flagComments
                }
              }
              : {
                flagComments
              }
          }
        }
      }

    case types.CLEAR_RED_FLAG:
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

    case types.GET_USER_VALIDATED_QUESTIONS_SUCCESS:
      let userAnswers = {}, question = { ...state.question }, other = {}

      if (state.question.isCategoryQuestion) {
        question = state.scheme.byId[question.parentId]
        other = {
          currentIndex: state.scheme.order.findIndex(id => id === question.id)
        }
      }

      userAnswers = initializeUserAnswers(
        [
          {
            schemeQuestionId: question.id,
            comment: '',
            codedAnswers: []
          }, ...action.payload.codedQuestions
        ],
        state.scheme.byId
      )

      return {
        ...state,
        userAnswers,
        mergedUserQuestions: action.payload.mergedUserQuestions,
        question,
        ...other,
        selectedCategory: 0,
        categories: undefined,
        selectedCategoryId: null
      }

    case types.GET_VALIDATION_OUTLINE_REQUEST:
    case types.GET_USER_VALIDATED_QUESTIONS_REQUEST:
    default:
      return state
  }
}

export const validationHandlers = [
  'GET_VALIDATION_OUTLINE_REQUEST',
  'GET_VALIDATION_OUTLINE_SUCCESS',
  'GET_USER_VALIDATED_QUESTIONS_REQUEST',
  'GET_USER_VALIDATED_QUESTIONS_SUCCESS',
  'CLEAR_FLAG',
  'CLEAR_RED_FLAG'
]

export default validationReducer