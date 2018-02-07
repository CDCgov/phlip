import * as types from './actionTypes'
import { normalize } from 'utils'
import {
  getNextQuestion,
  getPreviousQuestion,
  determineShowButton,
  handleUpdateUserAnswers,
  handleUpdateUserCodedQuestion,
  handleClearAnswers
} from 'utils/codingHelpers'
import * as questionTypes from 'scenes/CodingScheme/scenes/AddEditQuestion/constants'

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
  showNextButton: true
}

const validationReducer = (state = INITIAL_STATE, action) => {
  const selectedCategoryId = state.categories !== undefined ? state.categories[state.selectedCategory].id : 0
  const questionUpdater = handleUpdateUserCodedQuestion(state, action)

  switch (action.type) {
    case types.GET_VALIDATION_NEXT_QUESTION:
      const updatedState = { ...state, ...getNextQuestion(state, action) }

      return {
        ...updatedState,
        showNextButton: determineShowButton(updatedState)
      }

    case types.GET_VALIDATION_PREV_QUESTIONS:
      const update = { ...state, ...getPreviousQuestion(state, action) }
      return {
        ...update,
        showNextButton: determineShowButton(update)
      }

    case types.GET_VALIDATION_OUTLINE_SUCCESS:
      if (action.payload.isSchemeEmpty) {
        return {
          ...state,
          scheme: { order: [], byId: {} },
          outline: {},
          question: {},
          userAnswers: {}
        }
      } else {
        const normalizedQuestions = normalize.arrayToObject(action.payload.scheme)

        let updatedState = {
          ...state,
          outline: action.payload.outline,
          scheme: {
            byId: normalizedQuestions,
            order: action.payload.questionOrder
          },
          question: action.payload.question,
          userAnswers: action.payload.codedQuestions.length !== 0
            ? initializeUserAnswers(action.payload.codedQuestions, normalizedQuestions)
            : {
              [action.payload.question.id]: {
                codingSchemeQuestionId: action.payload.question.id,
                comment: '',
                answers: {}
              }
            }
        }

        return {
          ...updatedState,
          showNextButton: determineShowButton(updatedState)
        }
      }

    case types.UPDATE_USER_VALIDATION_REQUEST:
      const updated = {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          ...handleUpdateUserAnswers(state, action, selectedCategoryId)
        }
      }
      return {
        ...updated,
        showNextButton: determineShowButton(updated)
      }

    case types.ON_CLEAR_VALIDATION_ANSWER:
      return {
        ...state,
        ...questionUpdater(
          'answers',
          state.question.isCategoryChild
            ? handleClearCategoryAnswers(selectedCategoryId, state.question.questionType, state.userAnswers[action.questionId].answers)
            : handleClearAnswers(state.question.questionType, state.userAnswers[action.questionId].answers)
        )
      }

    case types.ON_CHANGE_VALIDATION_CATEGORY:
      return {
        ...state,
        selectedCategory: action.selection
      }

    case types.ON_VALIDATION_JURISDICTION_CHANGE:
      return {
        ...state,
        jurisdictionId: action.event,
        jurisdiction: action.jurisdictionList.find(jurisdiction => jurisdiction.id === action.event)
      }

    case types.ON_CLOSE_VALIDATION_SCREEN:
      return INITIAL_STATE

    default:
      return state
  }
}

export default validationReducer