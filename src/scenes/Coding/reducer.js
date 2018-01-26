import * as types from './actionTypes'
import { normalize } from 'utils'
import * as questionTypes from 'scenes/CodingScheme/scenes/AddEditQuestion/constants'

const INITIAL_STATE = {
  question: {},
  scheme: {},
  outline: {},
  jurisdiction: {},
  currentIndex: 0,
  categories: undefined,
  selectedCategory: 0,
  userAnswers: {}
}

/*
 This function basically takes an array of user coded question answers: { answers: [{ answerId: 1, pincite: '' }] },
 and converts it to an object like: { answers: { 1: { answerId: 1, pincite: '' }}}.

 It accounts for category children. If the question object has a categoryId, then the final answers object, looks like
 this: { answers: { [categoryId]: { answers: { 1 : { answerId: 1, pincite: '' } } } }}. Comments are handled the same way
 for category question children.

 Text field type questions are handled different since there will only be one answer instead of multiple and doesn't have
 an ID. It looks like this: { answers: { value: '', pincite: '' } }
 */
const normalizeAnswers = (question, codingSchemeQuestion, userCodedAnswerObj) => {
  if (codingSchemeQuestion.questionType === questionTypes.CATEGORY) {
    return { answers: normalize.arrayToObject(question.answers, 'answerId') }
  } else if (question.categoryId) {
    return {
      answers: {
        ...userCodedAnswerObj[question.id].answers,
        [question.categoryId]: { answers: normalize.arrayToObject(question.answers, 'answerId') }
      },
      comment: {
        ...userCodedAnswerObj[question.id].comment,
        [question.categoryId]: ''
      }
    }
  } else if (codingSchemeQuestion.questionType === questionTypes.TEXT_FIELD) {
    return question.answers.length > 0
      ? {
        answers: {
          ...question.answers[0],
          pincite: question.answers[0].pincite || '',
          value: question.answers[0].value || ''
        }
      }
      : { answers: { pincite: '', value: '' } }
  } else {
    return { answers: normalize.arrayToObject(question.answers, 'answerId') }
  }
}

const initializeUserAnswers = (userCodedQuestions, codingSchemeQuestions) => {
  return userCodedQuestions.reduce((codedQuestionObj, question) => {
    return ({
      ...codedQuestionObj,
      [question.questionId]: {
        ...question,
        ...normalizeAnswers(question, codingSchemeQuestions[question.questionId], codedQuestionObj)
      }
    })
  }, {})
}

const handleCheckCategories = (state, action) => {
  const newQuestion = state.scheme.byId[action.id]

  const base = {
    question: newQuestion,
    currentIndex: action.newIndex,
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
    const selectedCategories = Object.keys(state.userAnswers[parentQuestion.id].answers).length !== 0
      ? parentQuestion.possibleAnswers.filter(category => state.userAnswers[parentQuestion.id].answers.hasOwnProperty(category.id))
      : parentQuestion.possibleAnswers

    const answers = selectedCategories.reduce((answerObj, cat) => {
      return {
        ...answerObj,
        answers: {
          ...answerObj.answers,
          [cat.id]: base.userAnswers[newQuestion.id].answers.hasOwnProperty(cat.id)
            ? { ...base.userAnswers[newQuestion.id].answers[cat.id] }
            : { answers: {} }
        },
        comment: {
          ...answerObj.comment,
          [cat.id]: base.userAnswers[newQuestion.id].comment.hasOwnProperty(cat.id)
            ? base.userAnswers[newQuestion.id].comment[cat.id]
            : ''
        }
      }
    }, {})

    return {
      ...base,
      question: { ...base.question, isCategoryChild: true },
      categories: [...selectedCategories],
      selectedCategory: state.selectedCategory,
      userAnswers: { ...state.userAnswers, [newQuestion.id]: { ...base.userAnswers[newQuestion.id], ...answers } }
    }
  } else {
    return {
      ...base,
      categories: undefined,
      selectedCategory: 0
    }
  }
}

const updateUserAnswers = (questionType, action, currentUserAnswers = null) => {
  switch (questionType) {
    case questionTypes.BINARY:
    case questionTypes.MULTIPLE_CHOICE:
      return { [action.answerId]: { answerId: action.answerId, pincite: '' } }
    case questionTypes.TEXT_FIELD:
      return { ...currentUserAnswers, value: action.value }
    case questionTypes.CATEGORY:
    case questionTypes.CHECKBOXES:
      if (currentUserAnswers.hasOwnProperty(action.answerId)) delete currentUserAnswers[action.answerId]
      else currentUserAnswers = { ...currentUserAnswers, [action.answerId]: { answerId: action.answerId, pincite: '' } }
      return { ...currentUserAnswers }
  }
}

const handleUserAnswerCategoryChild = (selectedCategoryId, questionType, action, currentUserAnswerObj) => {
  return {
    ...currentUserAnswerObj,
    [selectedCategoryId]: {
      ...currentUserAnswerObj[selectedCategoryId],
      answers: {
        ...updateUserAnswers(questionType, action, currentUserAnswerObj[selectedCategoryId].answers)
      }
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
        userAnswers: action.payload.codedQuestions.length !== 0
          ? initializeUserAnswers(action.payload.codedQuestions, normalizedQuestions)
          : {
            [action.payload.question.id]: {
              comment: '',
              answers: {}
            }
          }
      }

    case types.UPDATE_USER_ANSWER_REQUEST:
      let updatedUserAnswers = {}

      updatedUserAnswers = {
        answers: {
          ... state.question.isCategoryChild
            ? handleUserAnswerCategoryChild([state.categories[state.selectedCategory].id], state.question.questionType, action, state.userAnswers[action.questionId].answers)
            : updateUserAnswers(state.question.questionType, action, state.userAnswers[action.questionId].answers)
        }
      }

      return {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          [action.questionId]: {
            ...state.userAnswers[action.questionId],
            ...updatedUserAnswers
          }
        }
      }


    case types.ON_CHANGE_COMMENT:
      return {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          [action.questionId]: state.question.isCategoryChild
            ? {
              ...state.userAnswers[action.questionId],
              comment: {
                ...state.userAnswers[action.questionId].comment,
                [state.categories[state.selectedCategory].id]: action.comment
              }
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
              state.question.questionType === 5 ? state.question.isCategoryChild ? {
                  ...question.answers,
                  [state.categories[state.selectedCategory].id]: {
                    answers: {
                      ...question.answers[state.categories[state.selectedCategory].id].answers,
                      pincite: action.pincite
                    }
                  }
                } : { ...question.answers, pincite: action.pincite }
                : state.question.isCategoryChild
                ? {
                  ...question.answers,
                  [state.categories[state.selectedCategory].id]: {
                    answers: {
                      [action.answerId]: {
                        ...question.answers[state.categories[state.selectedCategory].id].answers[action.answerId],
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

    case types.GET_CODING_OUTLINE_REQUEST:
    default:
      return state
  }
}
export default codingReducer