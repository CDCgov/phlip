import * as types from './actionTypes'
import {
  determineShowButton, handleCheckCategories,
  handleClearAnswers,
  handleUpdateUserAnswers, handleUpdateUserCategoryChild, handleUpdateUserCodedQuestion,
  handleUserPinciteQuestion, initializeNavigator
} from 'utils/codingHelpers'

const errorTypes = {
  1: 'We couldn\'t save the answer for this question. Your answer will be reset to the previous state.',
  2: 'We couldn\'t save the comment for this question. Your comment will be reset to the previous state.',
  3: 'We couldn\'t save the pincite for this answer choice. Your pincite will be reset to the previous state.',
  4: 'We couldn\'t clear the answer for this question. Your answer will be reset to the previous state.',
  5: 'We couldn\'t save your flag for this question. Your flag will be reset to the previous state.'
}

const INITIAL_STATE = {
  question: {},
  scheme: null,
  outline: {},
  jurisdiction: undefined,
  jurisdictionId: undefined,
  currentIndex: 0,
  categories: undefined,
  selectedCategory: 0,
  selectedCategoryId: null,
  userAnswers: {},
  showNextButton: true,
  mergedUserQuestions: null,
  isSchemeEmpty: null,
  areJurisdictionsEmpty: null,
  snapshotUserAnswer: {},
  updateAnswerError: null,
  errorTypeMsg: '',
  schemeError: null,
  saveFlagErrorContent: null
}

const codingValidationReducer = (state = INITIAL_STATE, action, name) => {
  const questionUpdater = state.question.isCategoryQuestion
    ? handleUpdateUserCategoryChild(state, action)
    : handleUpdateUserCodedQuestion(state, action)

  switch (action.type) {
    case `${types.UPDATE_USER_ANSWER_REQUEST}_${name}`:
      return {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          ...handleUpdateUserAnswers(state, action, state.selectedCategoryId)
        },
        snapshotUserAnswer: state.question.isCategoryQuestion
          ? state.userAnswers[action.questionId][state.selectedCategoryId]
          : state.userAnswers[action.questionId],
        errorTypeMsg: errorTypes[1]
      }

    case types.DISMISS_API_ALERT:
      return {
        ...state,
        [action.alertType]: null
      }

    case `${types.UPDATE_USER_ANSWER_SUCCESS}_${name}`:
      return {
        ...state,
        snapshotUserAnswer: {},
        updateAnswerError: null,
        errorTypeMsg: ''
      }

    case `${types.UPDATE_USER_ANSWER_FAIL}_${name}`:
      return {
        ...state,
        updateAnswerError: true
      }

    case `${types.CLEAR_ANSWER_ERROR}_${name}`:
      return {
        ...state,
        updateAnswerError: null,
        snapshotUserAnswer: {},
        userAnswers: {
          ...state.userAnswers,
          [state.question.id]: state.question.isCategoryQuestion
            ? { [state.selectedCategoryId]: { ...state.snapshotUserAnswer } }
            : { ...state.snapshotUserAnswer }
        },
        errorTypeMsg: ''
      }

    case `${types.ON_CHANGE_PINCITE}_${name}`:
      return {
        ...state,
        ...questionUpdater('answers', handleUserPinciteQuestion),
        snapshotUserAnswer: state.question.isCategoryQuestion
          ? state.userAnswers[action.questionId][state.selectedCategoryId]
          : state.userAnswers[action.questionId],
        errorTypeMsg: errorTypes[3]
      }

    case `${types.ON_CHANGE_COMMENT}_${name}`:
      return {
        ...state,
        ...questionUpdater('comment', action.comment),
        snapshotUserAnswer: state.question.isCategoryQuestion
          ? state.userAnswers[action.questionId][state.selectedCategoryId]
          : state.userAnswers[action.questionId],
        errorTypeMsg: errorTypes[2]
      }

    case `${types.ON_CHANGE_CATEGORY}_${name}`:
      return {
        ...state,
        selectedCategory: action.selection,
        selectedCategoryId: state.categories[action.selection].id
      }

    case `${types.ON_CHANGE_JURISDICTION}_${name}`:
      return {
        ...state,
        jurisdictionId: action.event,
        jurisdiction: action.jurisdictionsList.find(jurisdiction => jurisdiction.id === action.event)
      }

    case `${types.GET_QUESTION_SUCCESS}_${name}`:
      return {
        ...action.payload.updatedState,
        ...handleCheckCategories(
          action.payload.question,
          action.payload.currentIndex,
          action.payload.updatedState
        )
      }

    case `${types.ON_APPLY_ANSWER_TO_ALL}_${name}`:
      const catQuestion = state.userAnswers[state.question.id][state.selectedCategoryId]
      return {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          [state.question.id]: {
            ...state.categories.reduce((obj, category) => ({
              ...obj,
              [category.id]: {
                ...catQuestion,
                categoryId: category.id,
                id: state.userAnswers[state.question.id][category.id].id
              }
            }), {})
          }
        }
      }

    case `${types.ON_CLEAR_ANSWER}_${name}`:
      return {
        ...state,
        ...questionUpdater('answers', handleClearAnswers),
        snapshotUserAnswer: state.question.isCategoryQuestion
          ? state.userAnswers[action.questionId][state.selectedCategoryId]
          : state.userAnswers[action.questionId],
        errorTypeMsg: errorTypes[4]
      }

    case `${types.ON_CLOSE_SCREEN}_${name}`:
      return INITIAL_STATE

    default:
      return state
  }
}

const treeAndButton = intermediateState => {
  return {
    ...intermediateState,
    showNextButton: intermediateState.scheme === null ? false : determineShowButton(intermediateState),
    scheme: intermediateState.scheme === null ? null : {
      ...intermediateState.scheme,
      tree: initializeNavigator(intermediateState.scheme.tree, intermediateState.scheme.byId, intermediateState.userAnswers, intermediateState.question)
    }
  }
}

export const createCodingValidationReducer = (uniqueReducer, handlers, name) => {
  return function reducer(state = INITIAL_STATE, action) {
    if (handlers.includes(action.type)) {
      return treeAndButton(uniqueReducer(state, action))
    } else {
      return treeAndButton(codingValidationReducer(state, action, name))
    }
  }
}