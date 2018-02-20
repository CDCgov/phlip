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
  handleUserPinciteCategoryChild,
  handleUserPinciteQuestion,
  initializeNavigator,
  getQuestionSelectedInNav,
  handleUserCommentCategoryChild
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
  selectedCategoryId: null,
  userAnswers: {},
  showNextButton: true
}

const codingReducer = (state = INITIAL_STATE, action) => {
  const questionUpdater = handleUpdateUserCodedQuestion(state, action)

  switch (action.type) {
    case types.GET_NEXT_QUESTION:
      return {
        ...state,
        ...getNextQuestion(state, action)
      }

    case types.GET_PREV_QUESTION:
      return {
        ...state,
        ...getPreviousQuestion(state, action)
      }

    case types.GET_CODING_OUTLINE_SUCCESS:
      if (action.payload.isSchemeEmpty) {
        return {
          ...state,
          scheme: { order: [], byId: {}, tree: [] },
          outline: {},
          question: {},
          userAnswers: {},
          categories: undefined
        }
      } else {
        const normalizedQuestions = normalize.arrayToObject(action.payload.scheme)

        return {
          ...state,
          outline: action.payload.outline,
          scheme: {
            byId: normalizedQuestions,
            order: action.payload.questionOrder,
            tree: action.payload.tree
          },
          question: action.payload.question,
          userAnswers: initializeUserAnswers(
            [
              { schemeQuestionId: action.payload.question.id, comment: '', codedAnswers: [] },
              ...action.payload.codedQuestions
            ], normalizedQuestions
          ),
          categories: undefined
        }
      }

    case types.UPDATE_USER_ANSWER_REQUEST:
      return {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          ...handleUpdateUserAnswers(state, action, state.selectedCategoryId)
        }
      }

    case types.ON_CHANGE_COMMENT:
      return {
        ...state,
        ...questionUpdater(
          'comment',
          state.question.isCategoryQuestion
            ? handleUserCommentCategoryChild(state.selectedCategoryId, action, state.userAnswers[action.questionId].comment)
            : action.comment
        )
      }

    case types.ON_CHANGE_PINCITE:
      return {
        ...state,
        ...questionUpdater(
          'answers',
          state.question.isCategoryQuestion
            ? handleUserPinciteCategoryChild(state.selectedCategoryId, state.question.questionType, action, state.userAnswers[action.questionId].answers)
            : handleUserPinciteQuestion(state.question.questionType, action, state.userAnswers[action.questionId].answers)
        )
      }

    case types.APPLY_ANSWER_TO_ALL:
      const answer = state.userAnswers[state.question.id].answers[state.selectedCategoryId]
      return {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          [state.question.id]: {
            ...state.userAnswers[state.question.id],
            ...state.categories.reduce((obj, category) => ({
              ...obj,
              answers: {
                ...obj.answers,
                [category.id]: { ...answer }
              },
              comment: {
                ...obj.comment,
                [category.id]: ''
              }
            }), {})
          }
        }
      }

    case types.ON_CLEAR_ANSWER:
      return {
        ...state,
        ...questionUpdater(
          'answers',
          state.question.isCategoryQuestion
            ? handleClearCategoryAnswers(state.selectedCategoryId, state.question.questionType, state.userAnswers[action.questionId].answers)
            : handleClearAnswers(state.question.questionType, state.userAnswers[action.questionId].answers)
        )
      }

    case types.ON_CHANGE_CATEGORY:
      return {
        ...state,
        selectedCategory: action.selection,
        selectedCategoryId: state.categories[action.selection].id
      }

    case types.ON_JURISDICTION_CHANGE:
      return {
        ...state,
        jurisdictionId: action.event,
        jurisdiction: action.jurisdictionsList.find(jurisdiction => jurisdiction.id === action.event)
      }

    case types.GET_USER_CODED_QUESTIONS_SUCCESS:
      let userAnswers = {}, question = { ...state.question }, other = {}

      if (state.question.isCategoryQuestion) {
        question = state.scheme.byId[question.parentId]
        other = {
          currentIndex: state.scheme.order.findIndex(id => id === question.id)
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
        question,
        ...other,
        selectedCategory: 0,
        categories: undefined,
        selectedCategoryId: null
      }

    case types.ON_QUESTION_SELECTED_IN_NAV:
      return getQuestionSelectedInNav(state, action)

    case types.ON_CLOSE_CODE_SCREEN:
      return INITIAL_STATE

    case types.GET_USER_CODED_QUESTIONS_REQUEST:
    case types.GET_CODING_OUTLINE_REQUEST:
    default:
      return state
  }
}

const codingSceneReducer = (state = INITIAL_STATE, action) => {
  if (Object.values(types).includes(action.type)) {
    const intermediateState = codingReducer(state, action)

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

export default codingSceneReducer