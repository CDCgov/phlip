import * as types from './actionTypes'
import {
  determineShowButton, handleCheckCategories,
  handleUpdateUserAnswers, handleUpdateUserCategoryChild, handleUpdateUserCodedQuestion,
  handleUserPinciteQuestion, initializeNavigator, generateError, updateCategoryCodedQuestion, updateCodedQuestion
} from 'utils/codingHelpers'

export const INITIAL_STATE = {
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
  questionChangeLoader: false,
  showPageLoader: false,
  questionChangeLoader: false,
  isChangingQuestion: false,
  unsavedChanges: false,
  messageQueue: [],
  saveFailed: false,
  hasTouchedQuestion: false
}

const removeRequestsInQueue = (questionId, categoryId, currentQueue) => {
  return currentQueue.filter(message => {
    if (message.questionId !== questionId) {
      return true
    } else if (message.questionId === questionId) {
      if (message.hasOwnProperty('categoryId')) {
        return message.categoryId !== categoryId
      } else {
        return false
      }
    }
  })
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
        },
        unsavedChanges: true
      }

    case `${types.CHANGE_TOUCHED_STATUS}_${name}`:
      return {
        ...state,
        hasTouchedQuestion: !state.hasTouchedQuestion
      }

    case `${types.SAVE_USER_ANSWER_SUCCESS}_${name}`:
      return {
        ...state,
        ...state.scheme.byId[action.payload.questionId].isCategoryQuestion
          ? updateCategoryCodedQuestion(state, action.payload.questionId, action.payload.selectedCategoryId, { id: action.payload.id })
          : updateCodedQuestion(state, action.payload.questionId, { id: action.payload.id }),
        answerErrorContent: null,
        unsavedChanges: false,
        saveFailed: false
      }

    case `${types.SAVE_USER_ANSWER_REQUEST}_${name}`:
      return {
        ...state,
        ...state.scheme.byId[action.payload.questionId].isCategoryQuestion
          ? updateCategoryCodedQuestion(state, action.payload.questionId, action.payload.selectedCategoryId, { hasMadePost: true })
          : updateCodedQuestion(state, action.payload.questionId, { hasMadePost: true }),
        unsavedChanges: true,
        saveFailed: false
      }

    case `${types.ADD_REQUEST_TO_QUEUE}_${name}`:
      const currentQueue = removeRequestsInQueue(action.payload.questionId, action.payload.categoryId, [...state.messageQueue])
      return {
        ...state,
        messageQueue: [...currentQueue, action.payload]
      }

    case `${types.REMOVE_REQUEST_FROM_QUEUE}_${name}`:
      return {
        ...state,
        messageQueue: removeRequestsInQueue(action.payload.questionId, action.payload.categoryId, [...state.messageQueue])
      }

    case `${types.SAVE_USER_ANSWER_FAIL}_${name}`:
      return {
        ...state,
        answerErrorContent: 'We couldn\'t save your answer for this question.',
        saveFailed: true,
        ...state.scheme.byId[action.payload.questionId].isCategoryQuestion
          ? updateCategoryCodedQuestion(state, action.payload.questionId, action.payload.selectedCategoryId, { hasMadePost: false })
          : updateCodedQuestion(state, action.payload.questionId, { hasMadePost: false })
      }

    case `${types.OBJECT_EXISTS}_${name}`:
      return {
        ...state,
        answerErrorContent: 'Someone else has already validated this question.',
        saveFailed: true,
        ...state.scheme.byId[action.payload.questionId].isCategoryQuestion
          ? updateCategoryCodedQuestion(state, action.payload.questionId, action.payload.selectedCategoryId, { hasMadePost: false, ...action.payload.object })
          : updateCodedQuestion(state, action.payload.questionId, { hasMadePost: false, ...action.payload.object })
      }

    case `${types.ON_CHANGE_PINCITE}_${name}`:
      return {
        ...state,
        ...questionUpdater('answers', handleUserPinciteQuestion),
        unsavedChanges: true
      }

    case `${types.ON_CHANGE_COMMENT}_${name}`:
      return {
        ...state,
        ...questionUpdater('comment', action.comment),
        unsavedChanges: true
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
        jurisdiction: action.jurisdictionsList.find(jurisdiction => jurisdiction.id === action.event),
        hasTouchedQuestion: false
      }

    case `${types.GET_QUESTION_SUCCESS}_${name}`:
      const errors = generateError(action.payload.errors)
      return {
        ...action.payload.updatedState,
        ...handleCheckCategories(action.payload.question, action.payload.currentIndex, action.payload.updatedState),
        getQuestionErrors: errors.length > 0 ? errors : null,
        questionChangeLoader: false,
        isChangingQuestion: false,
        unsavedChanges: false,
        savedFailed: false,
        hasTouchedQuestion: false
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
        unsavedChanges: true
      }

    case `${types.ON_CLEAR_ANSWER}_${name}`:
      return {
        ...state,
        ...questionUpdater('answers', {}),
        unsavedChanges: true
      }

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