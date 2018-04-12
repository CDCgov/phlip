import * as types from './actionTypes'
import {
  determineShowButton, handleCheckCategories,
  handleClearAnswers,
  handleUpdateUserAnswers, handleUpdateUserCategoryChild, handleUpdateUserCodedQuestion,
  handleUserPinciteQuestion, initializeNavigator, generateError
} from 'utils/codingHelpers'
import { combineReducers } from 'redux'
import questionCardReducer from './QuestionCard/reducer'
import * as questionTypes from 'scenes/CodingScheme/scenes/AddEditQuestion/constants'
import { checkIfExists } from 'utils/codingSchemeHelpers'

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

const updateAnswers = (state, action) => {
  let currentUserAnswers = { ...state.answers }
  switch (state.question.questionType) {
    case questionTypes.BINARY:
    case questionTypes.MULTIPLE_CHOICE:
      currentUserAnswers = { [action.answerId]: { schemeAnswerId: action.answerId, pincite: '' } }
      break

    case questionTypes.TEXT_FIELD:
      if (action.answerValue === '') currentUserAnswers = {}
      else {
        currentUserAnswers = {
          [action.answerId]: {
            ...currentUserAnswers[action.answerId],
            schemeAnswerId: action.answerId,
            textAnswer: action.answerValue,
            pincite: currentUserAnswers[action.answerId] ? currentUserAnswers[action.answerId].pincite || '' : ''
          }
        }
      }
      break

    case questionTypes.CATEGORY:
      // If they uncheck a category, then delete all other answers that have been associated with that category
      if (checkIfExists(action, currentUserAnswers, 'answerId')) {
        delete currentUserAnswers[action.answerId]
      } else {
        currentUserAnswers = {
          ...currentUserAnswers,
          [action.answerId]: { schemeAnswerId: action.answerId, pincite: '' }
        }
      }
      break

    case questionTypes.CHECKBOXES:
      if (currentUserAnswers.hasOwnProperty(action.answerId)) delete currentUserAnswers[action.answerId]
      else currentUserAnswers = {
        ...currentUserAnswers,
        [action.answerId]: { schemeAnswerId: action.answerId, pincite: '' }
      }

      return currentUserAnswers
  }
}

const currentQuestionReducer = (state = {}, action, name) => {
  switch (action.type) {
    case `${types.UPDATE_USER_ANSWER_REQUEST}_${name}`:
      return {
        ...state,
        answers: updateAnswers(state, action)
      }

    default:
      return state
  }
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
        updateAnswerError: true,
        isApplyAllError: action.payload.isApplyAll
      }

    case `${types.CLEAR_ANSWER_ERROR}_${name}`:
      return {
        ...state,
        updateAnswerError: null,
        snapshotUserAnswer: {},
        userAnswers: {
          ...state.userAnswers,
          [state.question.id]: state.isApplyAllError
            ? { ...state.snapshotUserAnswer }
            : state.question.isCategoryQuestion
              ? { ...state.userAnswers[state.question.id], [state.selectedCategoryId]: { ...state.snapshotUserAnswer } }
              : { ...state.snapshotUserAnswer }
        },
        errorTypeMsg: '',
        isApplyAllError: null
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
      const errors = generateError(action.payload.errors)
      return {
        ...action.payload.updatedState,
        ...handleCheckCategories(
          action.payload.question,
          action.payload.currentIndex,
          action.payload.updatedState
        ),
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
                id: state.userAnswers[state.question.id][category.id].id
              }
            }), {})
          }
        },
        snapshotUserAnswer: { ...state.userAnswers[state.question.id] },
        errorTypeMsg: errorTypes[1]
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

    case `${types.DISMISS_API_ALERT}_${name}`:
      return {
        ...state,
        [action.errorType]: null
      }

    case `${types.ON_CLOSE_SCREEN}_${name}`:
      return INITIAL_STATE

    case `${types.ON_SHOW_PAGE_LOADER}_${name}`:
      return {
        ...state,
        showPageLoader: true
      }

    case `${types.ON_SHOW_QUESTION_LOADER}_${name}`:
      return {
        ...state,
        questionChangeLoader: true
      }

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
  return function reducer (state = INITIAL_STATE, action) {
    if (handlers.includes(action.type)) {
      return treeAndButton(uniqueReducer(state, action))
    } else {
      return treeAndButton(codingValidationReducer(state, action, name))
    }
  }
  /*const main = (state = INITIAL_STATE, action) => {
    if (handlers.includes(action.type)) {
      return treeAndButton(uniqueReducer(state, action))
    } else {
      return treeAndButton(codingValidationReducer(state, action, name))
    }
  }

  return combineReducers({
    main,
    current: questionCardReducer
  })*/
}