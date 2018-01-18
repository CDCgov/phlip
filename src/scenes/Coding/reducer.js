import * as types from './actionTypes'
import { normalize } from 'utils'

const INITIAL_STATE = {
  question: {},
  outline: {},
  jurisdiction: {},
  questionOrder: [],
  currentIndex: 0,
  userAnswer: null
}

const initializeAnswers = type => {
  let userAnswer = {}
  switch (type) {
    case 1:
    case 4:
      userAnswer = ''
      break
    case 2:
      break
    case 3:
      userAnswer = {}
      break
    case 5:
      userAnswer = ''
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
        userAnswer: initializeAnswers(action.payload.questionType)
      }

    case types.GET_CODING_OUTLINE_SUCCESS:
      return {
        ...state,
        outline: action.payload.outline,
        question: action.payload.question,
        questionOrder: action.payload.questionOrder,
        userAnswer: initializeAnswers(action.payload.question.questionType)
      }

    case types.ANSWER_QUESTION_REQUEST:
      let updatedAnswer = state.userAnswer
      if ([1,4,5].includes(state.question.questionType)) {
        updatedAnswer = action.answerValue
      } else if (state.question.questionType === 3) {
        updatedAnswer[action.answerId] = action.answerValue
      }

      return {
        ...state,
        userAnswer: updatedAnswer
      }

    case types.GET_CODING_OUTLINE_REQUEST:
    case types.GET_QUESTION_REQUEST:
      return {
        ...state,
        currentIndex: action.newIndex
      }

    default:
      return state
  }
}

export default codingReducer