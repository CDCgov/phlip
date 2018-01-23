import * as types from './actionTypes'
import { normalize } from 'utils'

const INITIAL_STATE = {
  question: {},
  outline: {},
  jurisdiction: {},
  questionOrder: [],
  currentIndex: 0,
  userAnswer: {},
  comment: '',
  categories: [],
  categoryQuestionNumber: undefined,
  selectedCategory: undefined
}

const initializeAnswers = question => {
  let userAnswer = {}
  switch (question.questionType) {
    case 1:
    case 3:
    case 4:
      userAnswer = normalize.arrayToObject(question.possibleAnswers)
      break
    case 2:
      userAnswer = normalize.arrayToObject(question.possibleCategories)
      break
    case 5:
      userAnswer = {}
      break
  }
  return userAnswer
}

const codingReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.GET_QUESTION_SUCCESS:
      return {
        ...state,
        question: action.payload,
        userAnswer: initializeAnswers(action.payload),
        categoryQuestionNumber: action.payload.questionType === 2 ? action.payload.number : state.categoryQuestionNumber,
        selectedCategory: state.selectedCategory ? state.selectedCategory : 0
      }

    case types.GET_CODING_OUTLINE_SUCCESS:
      return {
        ...state,
        outline: action.payload.outline,
        question: action.payload.question,
        questionOrder: action.payload.questionOrder,
        userAnswer: initializeAnswers(action.payload.question),
        categoryQuestionNumber: action.payload.question.questionType === 2 ? action.payload.question.number : state.categoryQuestionNumber
      }

    case types.ANSWER_QUESTION_REQUEST:
      let updatedAnswer = null, allCategories = []
      if ([1, 4].includes(state.question.questionType)) {
        updatedAnswer = { ...state.userAnswer }
        Object.keys(updatedAnswer).forEach(id => {
          if (action.answerId == id) {
            updatedAnswer[id] = { ...updatedAnswer[id], checked: true }
          } else {
            updatedAnswer[id] = { ...updatedAnswer[id], checked: false }
          }
        })
      } else if (state.question.questionType === 3) {
        updatedAnswer = { ...state.userAnswer }
        updatedAnswer[action.answerId] = { ...updatedAnswer[action.answerId], checked: action.answerValue }
      } else if (state.question.questionType === 5) {
        updatedAnswer = { ...state.userAnswer, fieldValue: action.answerValue }
      } else if (state.question.questionType === 2) {
        updatedAnswer = { ...state.userAnswer }
        updatedAnswer[action.answerId] = { ...updatedAnswer[action.answerId], checked: action.answerValue }
        allCategories = Object.values(updatedAnswer).filter(answer => answer.checked === true)
      }

      return {
        ...state,
        userAnswer: updatedAnswer,
        categories: allCategories
      }

    case types.ON_CHANGE_COMMENT:
      return {
        ...state,
        comment: action.comment
      }

    case types.ON_CHANGE_PINCITE:
      return {
        ...state,
        userAnswer: state.question.questionType === 5
          ? { ...state.userAnswer, pincite: action.pincite }
          : {
            ...state.userAnswer,
            [action.answerId]: {
              ...state.userAnswer[action.answerId],
              pincite: action.pincite
            }
          }
      }

    case types.ON_CHANGE_CATEGORY:
      console.log(action)
      return {
        ...state,
        selectedCategory: action.selection
      }

    case types.CLEAR_CATEGORIES:
      return {
        ...state,
        categories: [],
        categoryQuestionNumber: undefined
      }

    case types.GET_CODING_OUTLINE_REQUEST:
    case types.GET_QUESTION_REQUEST:
      return {
        ...state,
        currentIndex: action.newIndex,
        comment: '',
        question: {}
      }

    default:
      return state
  }
}

export default codingReducer