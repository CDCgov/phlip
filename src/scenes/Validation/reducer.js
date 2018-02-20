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
  handleUserPinciteQuestion,
  initializeNavigator
} from 'utils/codingHelpers'

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
  mergedUserQuestions: [],
  selectedCategoryId: null
}

const validationReducer = (state = INITIAL_STATE, action) => {
  const questionUpdater = handleUpdateUserCodedQuestion(state, action)

  switch (action.type) {
    case types.GET_VALIDATION_NEXT_QUESTION:
      return {
        ...state,
        ...getNextQuestion(state, action)
      }

    case types.GET_VALIDATION_PREV_QUESTIONS:
      return {
        ...state,
        ...getPreviousQuestion(state, action)
      }

    case types.GET_VALIDATION_OUTLINE_SUCCESS:
      if (action.payload.isSchemeEmpty) {
        return {
          ...state,
          scheme: { order: [], byId: {}, tree: [] },
          outline: {},
          question: {},
          userAnswers: {},
          mergedUserQuestions: {}
        }
      } else {
        const normalizedQuestions = normalize.arrayToObject(action.payload.scheme)

        return {
          ...state,
          outline: action.payload.outline,
          scheme: {
            byId: normalizedQuestions,
            order: action.payload.questionOrder,
            tree: []
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
      }

    case types.UPDATE_USER_VALIDATION_REQUEST:
      return {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          ...handleUpdateUserAnswers(state, action, state.selectedCategoryId)
        }
      }

    case types.ON_CHANGE_VALIDATION_PINCITE:
      return {
        ...state,
        ...questionUpdater(
          'answers',
          state.question.isCategoryQuestion
            ? handleUserPinciteCategoryChild(state.selectedCategoryId, state.question.questionType, action, state.userAnswers[action.questionId].answers)
            : handleUserPinciteQuestion(state.question.questionType, action, state.userAnswers[action.questionId].answers)
        )
      }

    case types.ON_CLEAR_VALIDATION_ANSWER:
      return {
        ...state,
        ...questionUpdater(
          'answers',
          state.question.isCategoryChild
            ? handleClearCategoryAnswers(state.selectedCategoryId, state.question.questionType, state.userAnswers[action.questionId].answers)
            : handleClearAnswers(state.question.questionType, state.userAnswers[action.questionId].answers)
        )
      }

    case types.ON_CHANGE_VALIDATION_CATEGORY:
      return {
        ...state,
        selectedCategory: action.selection,
        selectedCategoryId: state.categories[action.selection].id
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
        categories: undefined,
        selectedCategoryId: null
      }

    case types.ON_CLOSE_VALIDATION_SCREEN:
      return INITIAL_STATE

    default:
      return state
  }
}

const validationSceneReducer = (state = INITIAL_STATE, action) => {
  if (Object.values(types).includes(action.type)) {
    const intermediateState = validationReducer(state, action)

    return {
      ...intermediateState,
      showNextButton: intermediateState.scheme === null ? false : determineShowButton(intermediateState),
      scheme: intermediateState.scheme === null ? null : {
        ...intermediateState.scheme,
        tree: initializeNavigator(intermediateState.scheme.tree, intermediateState.scheme.byId, intermediateState.userAnswers, intermediateState.question)
      }
    }
  } else {
    return state
  }
}

export default validationSceneReducer