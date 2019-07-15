import { types } from './actions'
import {
  determineShowButton,
  handleCheckCategories,
  handleUpdateUserAnswers,
  handleUpdateUserCategoryChild,
  handleUpdateUserCodedQuestion,
  handleUpdateAnnotations,
  handleUserPinciteQuestion,
  initializeNavigator,
  generateError,
  updateCategoryCodedQuestion,
  updateCodedQuestion,
  handleRemoveAnnotation
} from 'utils/codingHelpers'

import documentListReducer, { INITIAL_STATE as docListInitialState } from './components/DocumentList/reducer'
import cardReducer, { INITIAL_STATE as cardInitialState } from './components/QuestionCard/reducer'

/**
 * Initial state for codingValidation reducer
 */
export const INITIAL_STATE = {
  question: {},
  answerSnapshot: {},
  scheme: null,
  outline: {},
  currentIndex: 0,
  categories: undefined,
  selectedCategory: 0,
  selectedCategoryId: null,
  userAnswers: {},
  showNextButton: true,
  mergedUserQuestions: null,
  isSchemeEmpty: false,
  areJurisdictionsEmpty: false,
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
  isChangingQuestion: false,
  unsavedChanges: false,
  messageQueue: [],
  saveFailed: false,
  objectExists: false,
  page: '',
  getRequestInProgress: true,
  gettingStartedText: ''
}

export const COMBINED_INITIAL_STATE = {
  coding: {
    ...INITIAL_STATE,
    card: cardInitialState
  },
  documentList: docListInitialState
}

/**
 * Removes any pending requests that are for the questionId and/or categoryId + questionId in the update question queue
 *
 * @param {Array} currentQueue
 * @param {(String|Number)} queueId
 * @param {Date} timeQueued
 * @returns {Array}
 */
const removeRequestsInQueue = (currentQueue, queueId, timeQueued) => {
  return currentQueue.filter(message => {
    return message.queueId !== queueId
      ? true
      : message.timeQueued > timeQueued
  })
}

/**
 * Determines the 'getting started' text based on whether scheme / jurisdictions are empty
 */
const getStartedText = (noScheme, noJurisdictions, role, isValidation) => {
  return !noScheme && !noJurisdictions
    ? ''
    : isValidation
      ? noScheme && !noJurisdictions
        ? 'This project doesn\'t have a coding scheme.'
        : !noScheme && noJurisdictions
          ? 'This project doesn\'t have jurisdictions.'
          : 'This project does not have a coding scheme or jurisdictions.'
      : role === 'Coder'
        ? 'The coordinator for this project has not created a coding scheme or added jurisdictions.'
        : noScheme && !noJurisdictions
          ? 'You must add questions to the coding scheme before coding.'
          : !noScheme && noJurisdictions
            ? 'You must add jurisdictions to the project before coding.'
            : 'You must add jurisdictions and questions to the coding scheme before coding.'
}

/**
 * Main reducer for the Coding and Validation scenes --- withCodingValidation HOC
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
export const codingReducer = (state = INITIAL_STATE, action) => {
  const questionUpdater = state.question.isCategoryQuestion
    ? handleUpdateUserCategoryChild(state, action)
    : handleUpdateUserCodedQuestion(state, action)
  
  console.log()
  
  switch (action.type) {
    case types.UPDATE_USER_ANSWER:
      return {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          ...handleUpdateUserAnswers(state, action)
        },
        unsavedChanges: true
      }
    
    case types.SAVE_USER_ANSWER_SUCCESS:
      return {
        ...state,
        ...state.scheme.byId[action.payload.questionId].isCategoryQuestion
          ? updateCategoryCodedQuestion(
            state,
            action.payload.questionId,
            action.payload.selectedCategoryId,
            { id: action.payload.id }
          )
          : updateCodedQuestion(state, action.payload.questionId, { id: action.payload.id }),
        answerErrorContent: null,
        saveFailed: false,
        unsavedChanges: state.messageQueue.length > 0
      }
    
    case types.SAVE_USER_ANSWER_REQUEST:
      return {
        ...state,
        ...state.scheme.byId[action.payload.questionId].isCategoryQuestion
          ? updateCategoryCodedQuestion(
            state,
            action.payload.questionId,
            action.payload.selectedCategoryId,
            { hasMadePost: true }
          )
          : updateCodedQuestion(state, action.payload.questionId, { hasMadePost: true }),
        saveFailed: false,
        unsavedChanges: true
      }
    
    case types.ADD_REQUEST_TO_QUEUE:
      const cleanQueue = removeRequestsInQueue(
        [...state.messageQueue],
        action.payload.queueId,
        action.payload.timeQueued
      )
      
      return {
        ...state,
        messageQueue: [...cleanQueue, action.payload],
        unsavedChanges: true
      }
    
    case types.REMOVE_REQUEST_FROM_QUEUE:
      const queue = removeRequestsInQueue(
        [...state.messageQueue],
        action.payload.queueId,
        action.payload.timeQueued
      )
      
      return {
        ...state,
        messageQueue: queue,
        unsavedChanges: queue.length > 0
      }
    
    case types.SEND_QUEUE_REQUESTS:
      return {
        ...state,
        unsavedChanges: true
      }
    
    case types.SAVE_USER_ANSWER_FAIL:
      return {
        ...state,
        answerErrorContent: 'We couldn\'t save your answer for this question.',
        saveFailed: true,
        ...state.scheme.byId[action.payload.questionId].isCategoryQuestion
          ? updateCategoryCodedQuestion(
            state,
            action.payload.questionId,
            action.payload.selectedCategoryId,
            { hasMadePost: false }
          )
          : updateCodedQuestion(state, action.payload.questionId, { hasMadePost: false })
      }
    
    case types.OBJECT_EXISTS:
      return {
        ...state,
        answerErrorContent: 'Something about this question has changed since you loaded the page. We couldn\'t save your answer.',
        saveFailed: true,
        objectExists: true,
        ...state.scheme.byId[action.payload.questionId].isCategoryQuestion
          ? updateCategoryCodedQuestion(
            state,
            action.payload.questionId,
            action.payload.selectedCategoryId,
            { hasMadePost: false, ...action.payload.object }
          )
          : updateCodedQuestion(state, action.payload.questionId, { hasMadePost: false, ...action.payload.object })
      }
    
    case types.ON_CHANGE_PINCITE:
      return {
        ...state,
        ...questionUpdater('answers', handleUserPinciteQuestion),
        unsavedChanges: true
      }
    
    case types.ON_SAVE_ANNOTATION:
      return {
        ...state,
        ...questionUpdater('answers', handleUpdateAnnotations),
        unsavedChanges: true
      }
    
    case types.ON_REMOVE_ANNOTATION:
      return {
        ...state,
        ...questionUpdater('answers', handleRemoveAnnotation),
        unsavedChanges: true
      }
    
    case types.ON_CHANGE_COMMENT:
      return {
        ...state,
        ...questionUpdater('comment', action.comment),
        unsavedChanges: true
      }
    
    case types.ON_CHANGE_CATEGORY:
      return {
        ...state,
        selectedCategory: action.selection,
        selectedCategoryId: state.categories[action.selection].id,
        answerSnapshot: state.userAnswers[state.question.id][state.categories[action.selection].id]
      }
    
    case types.RESET_ANSWER:
      return {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          [action.questionId]: state.question.isCategoryQuestion
            ? { ...state.userAnswers[action.questionId], [state.selectedCategoryId]: state.answerSnapshot }
            : state.answerSnapshot
        }
      }
    
    case types.ON_APPLY_ANSWER_TO_ALL:
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
    
    case types.SET_UNSAVED_CHANGES:
      return {
        ...state,
        unsavedChanges: action.unsavedChanges
      }
    
    case types.ON_CLEAR_ANSWER:
      return {
        ...state,
        ...questionUpdater('answers', {}),
        unsavedChanges: true
      }
    
    case types.GET_NEXT_QUESTION:
    case types.GET_PREV_QUESTION:
    case types.ON_QUESTION_SELECTED_IN_NAV:
      return {
        ...state,
        isChangingQuestion: true
      }
    
    case types.GET_QUESTION_SUCCESS:
      errors = generateError(action.payload.errors)
      return {
        ...action.payload.updatedState,
        ...handleCheckCategories(action.payload.question, action.payload.currentIndex, action.payload.updatedState),
        getQuestionErrors: errors.length > 0 ? errors : null,
        questionChangeLoader: false,
        isChangingQuestion: false,
        unsavedChanges: false,
        saveFailed: false
      }
    
    case types.GET_CODING_OUTLINE_REQUEST:
    case types.GET_VALIDATION_OUTLINE_REQUEST:
      return {
        ...state,
        isLoadingPage: true,
        getRequestInProgress: true,
        schemeError: null
      }
    
    case types.GET_VALIDATION_OUTLINE_SUCCESS:
    case types.GET_CODING_OUTLINE_SUCCESS:
      let error = generateError(action.payload.errors)
      const {
        outline, scheme, question, userAnswers, areJurisdictionsEmpty, currentIndex, isSchemeEmpty, mergedUserQuestions,
        user
      } = action.payload
      
      const upState = {
        ...state,
        outline,
        scheme,
        question,
        userAnswers,
        gettingStartedText: getStartedText(
          isSchemeEmpty,
          areJurisdictionsEmpty,
          user.role,
          state.page === 'validation'
        ),
        areJurisdictionsEmpty,
        mergedUserQuestions,
        isSchemeEmpty,
        schemeError: null,
        getQuestionErrors: error.length > 0 ? error : null,
        codedQuestionsError: action.payload.errors.hasOwnProperty('codedValQuestions') ? true : null,
        isLoadingPage: false,
        showPageLoader: false,
        getRequestInProgress: false,
        currentIndex,
        categories: undefined
      }
      
      return {
        ...upState,
        ...handleCheckCategories(action.payload.question, action.payload.currentIndex, upState)
      }
    
    case types.GET_CODING_OUTLINE_FAIL:
    case types.GET_VALIDATION_OUTLINE_FAIL:
      return {
        ...state,
        schemeError: action.payload,
        isLoadingPage: false,
        showPageLoader: false,
        getRequestInProgress: false
      }
    
    case types.ON_SAVE_RED_FLAG_SUCCESS:
      const curQuestion = { ...state.scheme.byId[state.question.id] }
      return {
        ...state,
        question: {
          ...state.question,
          flags: [action.payload]
        },
        scheme: {
          ...state.scheme,
          byId: {
            ...state.scheme.byId,
            [state.question.id]: {
              ...curQuestion,
              flags: [action.payload]
            }
          }
        },
        unsavedChanges: false
      }
    
    case types.ON_SAVE_RED_FLAG_FAIL:
      return {
        ...state,
        saveFlagErrorContent: 'We couldn\'t save the flag for this question.',
        saveFailed: true
      }
    
    case types.ON_SAVE_FLAG:
      return {
        ...state,
        ...questionUpdater('flag', action.flagInfo),
        unsavedChanges: true
      }
    
    case types.GET_USER_CODED_QUESTIONS_REQUEST:
    case types.GET_USER_VALIDATED_QUESTIONS_REQUEST:
      return {
        ...state,
        codedQuestionsError: null,
        isLoadingPage: true,
        questionChangeLoader: false
      }
    
    case types.GET_USER_CODED_QUESTIONS_SUCCESS:
    case types.GET_USER_VALIDATED_QUESTIONS_SUCCESS:
      let errors = generateError(action.payload.errors)
      return {
        ...state,
        userAnswers: action.payload.userAnswers,
        question: action.payload.question,
        scheme: action.payload.scheme,
        getQuestionErrors: errors.length > 0 ? errors : null,
        mergedUserQuestions: action.payload.mergedUserQuestions || null,
        codedQuestionsError: action.payload.errors.hasOwnProperty('codedValQuestions') ? true : null,
        isLoadingPage: false,
        showPageLoader: false,
        unsavedChanges: false,
        ...action.payload.otherUpdates
      }
    
    case types.GET_USER_CODED_QUESTIONS_FAIL:
    case types.GET_USER_VALIDATED_QUESTIONS_FAIL:
      return {
        ...state,
        getQuestionsError: '',
        isLoadingPage: false,
        showPageLoader: false
      }
    
    case types.ON_SAVE_RED_FLAG_REQUEST:
      return {
        ...state,
        unsavedChanges: true,
        saveFailed: false
      }
    
    case types.CLEAR_FLAG_SUCCESS:
      if (action.payload.type === 1) {
        return {
          ...state,
          question: { ...state.question, flags: [] },
          scheme: {
            ...state.scheme,
            byId: {
              ...state.scheme.byId,
              [state.question.id]: {
                ...state.scheme.byId[state.question.id],
                flags: []
              }
            }
          }
        }
      } else {
        let flagIndex = null
        
        const flagComments = state.question.isCategoryQuestion
          ? state.mergedUserQuestions[state.question.id][state.selectedCategoryId].flagsComments
          : state.mergedUserQuestions[state.question.id].flagsComments
        
        const { id, type, notes, raisedAt, ...flag } = flagComments.find((item, i) => {
          if (item.id === action.payload.flagId) {
            flagIndex = i
          }
          return item.id === action.payload.flagId
        })
        
        if (Object.keys(flag).length === 1) {
          flagComments.splice(flagIndex, 1)
        } else {
          if (flag.comment.length === 0) {
            flagComments.splice(flagIndex, 1)
          } else {
            flagComments.splice(flagIndex, 1, flag)
          }
        }
        
        return {
          ...state,
          mergedUserQuestions: {
            ...state.mergedUserQuestions,
            [state.question.id]: {
              ...state.mergedUserQuestions[state.question.id],
              ...state.question.isCategoryQuestion
                ? {
                  [state.selectedCategoryId]: {
                    ...state.mergedUserQuestions[state.question.id][state.selectedCategoryId],
                    flagComments
                  }
                }
                : {
                  flagComments
                }
            }
          }
        }
      }
    
    case types.CLEAR_FLAG_FAIL:
      return {
        ...state,
        saveFlagErrorContent: 'We couldn\'t clear this flag.'
      }
    
    case types.SET_PAGE:
      return {
        ...state,
        page: action.page
      }
    
    case types.DISMISS_API_ALERT:
      return { ...state, [action.errorType]: null, objectExists: false }
    
    case types.ON_SHOW_PAGE_LOADER:
      return { ...state, showPageLoader: true }
    
    case types.ON_SHOW_QUESTION_LOADER:
      return { ...state, questionChangeLoader: true }
    
    case types.ON_CLOSE_SCREEN:
      return INITIAL_STATE
    
    case types.CLEAR_RED_FLAG:
    case types.CLEAR_FLAG:
    default:
      return state
  }
}

/**
 * Updates the Code Navigator by updating scheme.tree and sets whether or not to show the 'next button.' All redux
 * actions passed to the codingValidation reducer go through the function since almost every action affects the
 * navigator and whether or not to show the next button. Returns the updated state.
 *
 * @param {Object} intermediateState
 * @returns {Object}
 */
const treeAndButton = intermediateState => {
  return {
    ...intermediateState,
    showNextButton: intermediateState.scheme === null ? false : determineShowButton(intermediateState),
    scheme: intermediateState.scheme === null ? null : {
      ...intermediateState.scheme,
      tree: initializeNavigator(
        intermediateState.scheme.tree,
        intermediateState.scheme.byId,
        intermediateState.userAnswers,
        intermediateState.question
      )
    }
  }
}

const codingValidationReducer = (state = COMBINED_INITIAL_STATE, action) => {
  return {
    documentList: documentListReducer(state.documentList, action),
    coding: {
      ...treeAndButton(codingReducer(state.coding, action)),
      card: cardReducer(state.coding.card, action)
    }
  }
}

export default codingValidationReducer
