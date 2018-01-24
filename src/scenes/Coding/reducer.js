import * as types from './actionTypes'
import { normalize } from 'utils'

const INITIAL_STATE = {
  question: {},
  scheme: {},
  outline: {},
  jurisdiction: {},
  currentIndex: 0,
  userAnswer: {},
  comment: '',
  categories: undefined,
  selectedCategory: 0
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
      userAnswer = normalize.arrayToObject(question.categories)
      break
    case 5:
      userAnswer = { fieldValue: '' }
      break
  }
  return userAnswer
}

const handleCheckCategories = (state, action) => {
  let newQuestion = state.scheme.byId[action.id]

  let base = {
    question: newQuestion,
    currentIndex: action.newIndex,
    comment: '',
    userAnswer: initializeAnswers(newQuestion)
  }

  if (newQuestion.parentId === 0) {
    return {
      ...base,
      categories: undefined,
      selectedCategory: 0
    }
  }

  const parentQuestion = state.scheme.byId[newQuestion.parentId]

  if (parentQuestion.questionType === 2) {
    return {
      ...base,
      categories: [ ...parentQuestion.categories ],
      selectedCategory: state.selectedCategory
    }
  } else {
    return {
      ...base,
      categories: undefined,
      selectedCategory: 0
    }
  }


}

const codingReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.GET_NEXT_QUESTION:
      return {
        ...state,
        ...handleCheckCategories(state, action)
      }


    case types.GET_PREV_QUESTION:
      return {
        ...state,
        ...handleCheckCategories(state, action)
      }

    case types.GET_CODING_OUTLINE_SUCCESS:
      return {
        ...state,
        outline: action.payload.outline,
        userAnswer: initializeAnswers(action.payload.question),
        scheme: {
          byId: normalize.arrayToObject(action.payload.scheme),
          order: action.payload.questionOrder
        },
        question: action.payload.question
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
      } else if (state.question.questionType === 2) {
        updatedAnswer = { ...state.userAnswer }
        updatedAnswer[action.answerId] = { ...updatedAnswer[action.answerId], checked: action.answerValue }
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

    case types.ON_CHANGE_CATEGORY:
      return {
        ...state,
        selectedCategory: action.selection
      }

    case types.CLEAR_CATEGORIES:
      return {
        ...state,
        categories: []
      }

    case types.GET_CODING_OUTLINE_REQUEST:
    default:
      return state
  }
}

export default codingReducer