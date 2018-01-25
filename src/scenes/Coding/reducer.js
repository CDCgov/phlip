import * as types from './actionTypes'
import { normalize } from 'utils'
import * as questionTypes from 'scenes/CodingScheme/scenes/AddEditQuestion/constants'

const INITIAL_STATE = {
  question: {},
  scheme: {},
  outline: {},
  jurisdiction: {},
  currentIndex: 0,
  comment: '',
  categories: undefined,
  selectedCategory: 0,
  userAnswers: {}
}

const normalizeAnswers = (question, allQuestions) => {
  if (allQuestions[question.questionId].questionType === 2) {
    return { categories: normalize.arrayToObject(question.categories) }
  } else if (question.categoryId) {
    return {
      categories: {
        [question.categoryId]: {
          answers: question.answers.reduce((answerObj, answer) => ({
            ...answerObj,
            [answer.answerId]: { ...answer }
          }), {})
        }
      }
    }
  } else if (allQuestions[question.questionId].questionType === 5) {
    return question.answers.length > 0
      ? {
        answers: {
          ...question.answers[0],
          pincite: question.answers[0].pincite || '',
          value: question.answers[0].value || ''
        }
      }
      : { answers: { ...question.answers[0], pincite: '', value: '' } }
  } else {
    return {
      answers: question.answers.reduce((answerObj, answer) => ({
        ...answerObj,
        [answer.answerId]: { ...answer }
      }), {})
    }
  }
}

const initializeUserAnswers = (answers, allQuestions) => {
  return answers.reduce((userA, question) => {
    return ({
      ...userA,
      [question.questionId]: {
        ...question,
        ...normalizeAnswers(question, allQuestions)
      }
    })
  }, {})
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
    userAnswers: state.userAnswers[action.id]
      ? { ...state.userAnswers }
      : {
        ...state.userAnswers,
        [action.id]: {
          questionId: action.id,
          answers: {},
          comment: ''
        }
      }
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
      categories: [...parentQuestion.categories],
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
    case types.GET_PREV_QUESTION:
      return {
        ...state,
        ...handleCheckCategories(state, action)
      }

    case types.GET_CODING_OUTLINE_SUCCESS:
      const normalizedQuestions = normalize.arrayToObject(action.payload.scheme)

      return {
        ...state,
        outline: action.payload.outline,
        userAnswer: initializeAnswers(action.payload.question),
        scheme: {
          byId: normalizedQuestions,
          order: action.payload.questionOrder
        },
        question: action.payload.question,
        userAnswers: initializeUserAnswers(action.payload.codedQuestions, normalizedQuestions)
      }

    case types.ANSWER_QUESTION_REQUEST:
      let updatedUserAnswers = {}

      if ([1, 4].includes(state.question.questionType)) {
        updatedUserAnswers = {
          ...state.userAnswers,
          [action.questionId]: {
            ...state.userAnswers[action.questionId],
            answers: { [action.answerId]: { answerId: action.answerId, pincite: '' } }
          }
        }

      } else if (state.question.questionType === questionTypes.CHECKBOXES) {
        let currentAnswers = state.userAnswers[action.questionId].answers
        if (Object.keys(currentAnswers).includes(action.answerId)) delete currentAnswers[action.answerId]
        else currentAnswers = { ...currentAnswers, [action.answerId]: { answerId: action.answerId, pincite: '' } }

        updatedUserAnswers = {
          ...state.userAnswers,
          [action.questionId]: {
            ...state.userAnswers[action.questionId],
            answers: { ...currentAnswers }
          }
        }

      } else if (state.question.questionType === 5) {
        updatedUserAnswers = {
          ...state.userAnswers,
          [action.questionId]: { ...updatedUserAnswers[action.questionId], answers: { value: action.answerValue } }
        }
      } else if (state.question.questionType === 2) {
        let updatedAnswer = { ...state.userAnswer }
        updatedAnswer[action.answerId] = { ...updatedAnswer[action.answerId], checked: action.answerValue }
      }

      return {
        ...state,
        userAnswers: updatedUserAnswers
      }

    case types.ON_CHANGE_COMMENT:
      return {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          [action.questionId]: { ...state.userAnswers[action.questionId], comment: action.comment }
        }
      }

    case types.ON_CHANGE_PINCITE:
      const question = state.userAnswers[action.questionId]

      return {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          [action.questionId]: {
            ...question,
            answers: state.question.questionType === 5
              ? { ...question.answers, pincite: action.pincite }
              : {
                ...question.answers,
                [action.answerId]: { ...question.answers[action.answerId], pincite: action.pincite }
              }
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