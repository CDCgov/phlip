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

const normalizeAnswers = (question, allQuestions, userCodedAnswerObj) => {
  if (allQuestions[question.questionId].questionType === 2) {
    return { answers: normalize.arrayToObject(question.answers) }
  } else if (question.categoryId) {
    return {
      answers: {
        ...userCodedAnswerObj[question.id].answers,
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
        ...normalizeAnswers(question, allQuestions, userA)
      }
    })
  }, {})
}

const handleCheckCategories = (state, action) => {
  const newQuestion = state.scheme.byId[action.id]
  const base = {
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
  console.log(parentQuestion)
  console.log(state.userAnswers)


  if (parentQuestion.questionType === 2) {
    const selectedCategories = parentQuestion.possibleAnswers.filter(category => state.userAnswers[parentQuestion.id].answers.hasOwnProperty(category.id))
    const answers = selectedCategories.reduce((answerObj, cat) => {
      return {
        ...answerObj,
        [cat.id]: base.userAnswers[newQuestion.id].answers.hasOwnProperty(cat.id)
          ? { ...base.userAnswers[newQuestion.id].answers[cat.id] }
          : { answers: {} }
      }
    }, {})

    return {
      ...base,
      question: { ...base.question, isCategoryChild: true },
      categories: [...selectedCategories],
      selectedCategory: state.selectedCategory,
      userAnswers: { ...state.userAnswers, [newQuestion.id]: { ...base.userAnswers[newQuestion.id], answers } }
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
        scheme: {
          byId: normalizedQuestions,
          order: action.payload.questionOrder
        },
        question: action.payload.question,
        userAnswers: initializeUserAnswers(action.payload.codedQuestions, normalizedQuestions)
      }

    case types.ANSWER_QUESTION_REQUEST:
      let updatedUserAnswers = {}
      console.log(action)

      switch (state.question.questionType) {
        case questionTypes.BINARY:
        case questionTypes.MULTIPLE_CHOICE:
          updatedUserAnswers = {
            ...state.userAnswers,
            [action.questionId]: {
              ...state.userAnswers[action.questionId],
              answers:
                state.question.isCategoryChild
                  ? {
                    ...state.userAnswers[action.questionId].answers,
                    [state.categories[state.selectedCategory].id]: {
                      answers: {
                        [action.answerId]: {
                          answerId: action.answerId,
                          pincite: ''
                        }
                      }
                    }
                  }
                  : { [action.answerId]: { answerId: action.answerId, pincite: '' } }
            }
          }
          break

        case questionTypes.TEXT_FIELD:
          updatedUserAnswers = {
            ...state.userAnswers,
            [action.questionId]: {
              ...state.userAnswers[action.questionId],
              answers:
                state.question.isCategoryChild
                  ? {
                    ...state.userAnswers[action.questionId].answers,
                    [state.categories[state.selectedCategory].id]: {
                      answers: {
                        ...state.userAnswers[action.questionId][state.categories[state.selectedCategory].id].answers,
                        value: action.answerValue
                      }
                    }
                  }
                  : { ...state.userAnswers[action.questionId].answers, value: action.answerValue }
            }
          }
          break

        case questionTypes.CATEGORY:
        case questionTypes.CHECKBOXES:
          let currentAnswers = {}
          if (state.question.isCategoryChild) {
            currentAnswers = state.userAnswers[action.questionId].answers[state.categories[state.selectedCategory].id].answers
          } else {
            currentAnswers = state.userAnswers[action.questionId].answers
          }
          if (currentAnswers.hasOwnProperty(action.answerId)) delete currentAnswers[action.answerId]
          else currentAnswers = { ...currentAnswers, [action.answerId]: { answerId: action.answerId, pincite: '' } }

          updatedUserAnswers = {
            ...state.userAnswers,
            [action.questionId]: {
              ...state.userAnswers[action.questionId],
              answers: { ...currentAnswers }
            }
          }
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
          [action.questionId]: state.question.isCategoryChild
            ? {
              ...state.userAnswers[action.questionId],
              comment: { [state.categories[state.selectedCategory].id]: action.comment }
            }
            : {
              ...state.userAnswers[action.questionId],
              comment: action.comment
            }
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
            answers:
              state.question.questionType === 5
                ? state.question.isCategoryChild
                ? {
                  ...question.answers,
                  [state.categories[state.selectedCategory].id]: {
                    answers: {
                      ...question.answers[state.categories[state.selectedCategory]].answers,
                      pincite: action.pincite
                    }
                  }
                }
                : { ...question.answers, pincite: action.pincite }
                : state.question.isCategoryChild
                ? {
                  ...question.answers,
                  [state.categories[state.selectedCategory].id]: {
                    answers: {
                      [action.answerId]: {
                        ...question.answers[state.categories[state.selectedCategory]].answers[action.answerId],
                        pincite: action.pincite
                      }
                    }
                  }
                }
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