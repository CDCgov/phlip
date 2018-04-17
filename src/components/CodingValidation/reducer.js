import * as types from './actionTypes'
import {
  determineShowButton, handleCheckCategories,
  handleClearAnswers,
  handleUpdateUserAnswers, handleUpdateUserCategoryChild, handleUpdateUserCodedQuestion,
  handleUserPinciteQuestion, initializeNavigator, generateError
} from 'utils/codingHelpers'

const errorTypes = {
  1: 'We couldn\'t save the answer for this question.',
  2: 'We couldn\'t save the comment for this question.',
  3: 'We couldn\'t save the pincite for this answer choice.',
  4: 'We couldn\'t clear the answer for this question.',
  5: 'We couldn\'t save your flag for this question.'
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
  answerErrorContent: null,
  schemeError: null,
  saveFlagErrorContent: null,
  getQuestionErrors: null,
  codedQuestionsError: null,
  isApplyAllError: null,
  isLoadingPage: false,
  pageLoaderMessage: '',
  questionChangeLoader: false,
  showPageLoader: false,
  questionChangeLoader: false,
  isChangingQuestion: false
}

const codingValidationReducer = (state = INITIAL_STATE, action, name) => {
  const questionUpdater = state.question.isCategoryQuestion
    ? handleUpdateUserCategoryChild(state, action)
    : handleUpdateUserCodedQuestion(state, action)

  switch (action.type) {
    case `${types.UPDATE_USER_ANSWER}_${name}`:
      return {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          ...handleUpdateUserAnswers(state, action)
        }
      }

    case `${types.SAVE_USER_ANSWER_SUCCESS}_${name}`:
      return {
        ...state,
        ...questionUpdater('id', action.payload.id),
        answerErrorContent: null
      }

    case `${types.SAVE_USER_ANSWER_FAIL}_${name}`:
      return {
        ...state,
        answerErrorContent: 'We couldn\'t save your answer for this question.'
      }

    case `${types.ON_CHANGE_PINCITE}_${name}`:
      return {
        ...state,
        ...questionUpdater('answers', handleUserPinciteQuestion)
      }

    case `${types.ON_CHANGE_COMMENT}_${name}`:
      return {
        ...state,
        ...questionUpdater('comment', action.comment)
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
      const errors = generateError(action.payload.errors)
      return {
        ...action.payload.updatedState,
        ...handleCheckCategories(action.payload.question, action.payload.currentIndex, action.payload.updatedState),
        getQuestionErrors: errors.length > 0 ? errors : null,
        questionChangeLoader: false,
        isChangingQuestion: false
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
                id: state.userAnswers[state.question.id][category.id].id || undefined
              }
            }), {})
          }
        },
        answerErrorContent: errorTypes[1]
      }

    case `${types.ON_CLEAR_ANSWER}_${name}`:
      return { ...state, ...questionUpdater('answers', {}) }

    case `${types.DISMISS_API_ALERT}_${name}`:
      return { ...state, [action.errorType]: null }

    case `${types.ON_SHOW_PAGE_LOADER}_${name}`:
      return { ...state, showPageLoader: true }

    case `${types.ON_SHOW_QUESTION_LOADER}_${name}`:
      return { ...state, questionChangeLoader: true }

    case `${types.ON_CLOSE_SCREEN}_${name}`:
      return INITIAL_STATE

    case `${types.GET_NEXT_QUESTION}_${name}`:
    case `${types.GET_PREV_QUESTION}_${name}`:
    case `${types.ON_QUESTION_SELECTED_IN_NAV}_${name}`:
      return {
        ...state,
        isChangingQuestion: true
      }

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
      tree: initializeNavigator(
        intermediateState.scheme.tree, intermediateState.scheme.byId, intermediateState.userAnswers, intermediateState.question
      )
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