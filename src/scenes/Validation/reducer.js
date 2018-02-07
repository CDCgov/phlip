import * as types from './actionTypes'
import { normalize } from 'utils'
import { getNextQuestion, getPreviousQuestion, determineShowButton } from 'utils/codingHelpers'
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

    default:
      return state
  }
}

export default validationReducer