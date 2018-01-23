import * as types from './actionTypes'
import { normalize } from 'utils'

const INITIAL_STATE = {
  question: {},
  outline: {},
  jurisdiction: {},
  questionOrder: [],
  currentIndex: 0,
  userAnswer: {},
  comment: ''
}

const initializeAnswers = (type, answers) => {
  let userAnswer = {}
  switch (type) {
    case 1:
    case 4:
      userAnswer = normalize.arrayToObject(answers)
      break
    case 2:
      break
    case 3:
      userAnswer = normalize.arrayToObject(answers)
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
        userAnswer: initializeAnswers(action.payload.questionType, action.payload.possibleAnswers)
      }

    case types.GET_CODING_OUTLINE_SUCCESS:
      return {
        ...state,
        outline: action.payload.outline,
        question: action.payload.question,
        questionOrder: action.payload.questionOrder,
        userAnswer: initializeAnswers(action.payload.question.questionType, action.payload.question.possibleAnswers)
      }

    case types.ANSWER_QUESTION_REQUEST:
      let updatedAnswer = null
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
      }

      return {
        ...state,
        userAnswer: updatedAnswer
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