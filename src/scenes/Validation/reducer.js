import * as types from './actionTypes'
import { normalize } from 'utils'
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

const getNextQuestion = (state, action) => {
  let newQuestion = state.scheme.byId[action.id]
  let newIndex = action.newIndex

  // Check to make sure newQuestion is correct. If the newQuestion is a category child, but the user hasn't selected
  // any categories, then find the next parent question
  if (newQuestion.isCategoryQuestion) {
    if (Object.keys(state.userAnswers[state.scheme.byId[action.id].parentId].answers).length === 0) {
      let subArr = [...state.scheme.order].slice(action.newIndex)
      newQuestion = subArr.find(id => {
        if (state.scheme.byId[id].parentId !== state.question.id) {
          newIndex = state.scheme.order.indexOf(id)
          return true
        }
      })
      newQuestion = state.scheme.byId[newQuestion]
    }
  }

  return handleCheckCategories(newQuestion, newIndex, state, action)
}

const getPreviousQuestion = (state, action) => {
  let newQuestion = state.scheme.byId[action.id]
  let newIndex = action.newIndex

  if (newQuestion.isCategoryQuestion) {
    if (Object.keys(state.userAnswers[newQuestion.parentId].answers).length === 0) {
      newQuestion = state.scheme.byId[newQuestion.parentId]
      newIndex = state.scheme.order.indexOf(newQuestion.id)
    }
  }

  return handleCheckCategories(newQuestion, newIndex, state, action)
}

const determineShowButton = (state) => {
  if (state.question.questionType === questionTypes.CATEGORY) {
    if (Object.keys(state.userAnswers[state.question.id].answers).length === 0) {
      let subArr = [...state.scheme.order].slice(state.currentIndex + 1)
      let p = subArr.find(id => state.scheme.byId[id].parentId !== state.question.id)
      if (p !== undefined) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  } else {
    return state.scheme.order && state.question.id !== state.scheme.order[state.scheme.order.length - 1]
  }
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
      console.log(action.payload)
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