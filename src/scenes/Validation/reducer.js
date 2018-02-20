import * as types from './actionTypes'
import { normalize } from 'utils'
import {
  getNextQuestion,
  getPreviousQuestion,
  determineShowButton,
  handleUpdateUserAnswers,
  handleUpdateUserCodedQuestion,
  handleClearAnswers,
  handleClearCategoryAnswers,
  initializeUserAnswers,
  initializeCodedUsers,
  handleUserPinciteCategoryChild,
  handleUserPinciteQuestion
} from 'utils/codingHelpers'
import * as questionTypes from 'scenes/CodingScheme/scenes/AddEditQuestion/constants'

const INITIAL_STATE = {
  question: {},
  scheme: null,
  outline: {},
  jurisdiction: undefined,
  jurisdictionId: undefined,
  currentIndex: 0,
  categories: undefined,
  selectedCategory: 0,
  userAnswers: {},
  showNextButton: true,
  mergedUserQuestions: []
}

const validationReducer = (state = INITIAL_STATE, action) => {
  const selectedCategoryId = state.categories !== undefined ? state.categories[state.selectedCategory].id : 0
  const questionUpdater = handleUpdateUserCodedQuestion(state, action)

  switch (action.type) {
    case types.GET_VALIDATION_NEXT_QUESTION:
      const updatedState = { ...state, ...getNextQuestion(state, action) }

      return {
        ...updatedState,
        showNextButton: determineShowButton(updatedState)
      }

    case types.GET_VALIDATION_PREV_QUESTIONS:
      const update = { ...state, ...getPreviousQuestion(state, action) }
      return {
        ...update,
        showNextButton: determineShowButton(update)
      }

    case types.GET_VALIDATION_OUTLINE_SUCCESS:
      if (action.payload.isSchemeEmpty) {
        return {
          ...state,
          scheme: { order: [], byId: {} },
          outline: {},
          question: {},
          userAnswers: {},
          mergedUserQuestions: {}
        }
      } else {
        const normalizedQuestions = normalize.arrayToObject(action.payload.scheme)

        let updatedState = {
          ...state,
          outline: action.payload.outline,
          scheme: {
            byId: normalizedQuestions,
            order: action.payload.questionOrder
          },
          question: action.payload.question,
          userAnswers: initializeUserAnswers(
            [
              { schemeQuestionId: action.payload.question.id, comment: '', codedAnswers: [] },
              ...action.payload.codedQuestions
            ], normalizedQuestions
          ),
          mergedUserQuestions: action.payload.mergedUserQuestions.length !== 0
            ? initializeCodedUsers(action.payload.mergedUserQuestions, normalizedQuestions)
            : {
              [action.payload.question.id]: {
                schemeQuestionId: action.payload.question.id,
                comment: '',
                answers: []
              }
            }
        }

        return {
          ...updatedState,
          showNextButton: determineShowButton(updatedState)
        }
      }

    case types.UPDATE_USER_VALIDATION_REQUEST:
      const updated = {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          ...handleUpdateUserAnswers(state, action, selectedCategoryId)
        }
      }
      return {
        ...updated,
        showNextButton: determineShowButton(updated)
      }

    case types.ON_CHANGE_VALIDATION_PINCITE:
      return {
        ...state,
        ...questionUpdater(
          'answers',
          state.question.isCategoryQuestion
            ? handleUserPinciteCategoryChild(selectedCategoryId, state.question.questionType, action, state.userAnswers[action.questionId].answers)
            : handleUserPinciteQuestion(state.question.questionType, action, state.userAnswers[action.questionId].answers)
        )
      }

    case types.ON_CLEAR_VALIDATION_ANSWER:
      return {
        ...state,
        ...questionUpdater(
          'answers',
          state.question.isCategoryChild
            ? handleClearCategoryAnswers(selectedCategoryId, state.question.questionType, state.userAnswers[action.questionId].answers)
            : handleClearAnswers(state.question.questionType, state.userAnswers[action.questionId].answers)
        )
      }

    case types.ON_CHANGE_VALIDATION_CATEGORY:
      return {
        ...state,
        selectedCategory: action.selection
      }

    case types.ON_VALIDATION_JURISDICTION_CHANGE:
      return {
        ...state,
        jurisdictionId: action.event,
        jurisdiction: action.jurisdictionList.find(jurisdiction => jurisdiction.id === action.event)
      }

    case types.GET_USER_VALIDATED_QUESTIONS_SUCCESS:
      let userAnswers = {}, question = { ...state.question }, other = {}, mergedUserQuestions = {}

      if (action.payload.mergedUserQuestions.length !== 0) {
        mergedUserQuestions = initializeCodedUsers(action.payload.mergedUserQuestions, state.scheme.byId)
      }

      if (state.question.isCategoryQuestion) {
        question = state.scheme.byId[question.parentId]
        other = {
          currentIndex: state.scheme.order.findIndex(id => id === question.id)
        }
      }

      if (!mergedUserQuestions.hasOwnProperty(question.id)) {
        mergedUserQuestions = {
          ...mergedUserQuestions,
          [question.id]: {
            schemeQuestionId: question.id,
            comment: '',
            answers: []
          }
        }
      }

      userAnswers = initializeUserAnswers(
        [
          {
            schemeQuestionId: question.id,
            comment: '',
            codedAnswers: []
          }, ...action.payload.codedQuestions
        ],
        state.scheme.byId
      )

      return {
        ...state,
        userAnswers,
        mergedUserQuestions,
        question,
        ...other,
        selectedCategory: 0,
        categories: undefined
      }

    case types.ON_CLOSE_VALIDATION_SCREEN:
      return INITIAL_STATE

    default:
      return state
  }
}

export default validationReducer