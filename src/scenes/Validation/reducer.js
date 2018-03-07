import * as types from './actionTypes'
import { normalize } from 'utils'
import {
  getNextQuestion,
  getPreviousQuestion,
  determineShowButton,
  handleUpdateUserAnswers,
  handleUpdateUserCodedQuestion,
  handleUpdateUserCategoryChild,
  handleClearAnswers,
  initializeUserAnswers,
  handleUserPinciteQuestion,
  initializeNavigator,
  getQuestionSelectedInNav,
  initializeCodedUsers
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
  const questionUpdater = state.question.isCategoryQuestion
    ? handleUpdateUserCategoryChild(state, action)
    : handleUpdateUserCodedQuestion(state, action)

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
            tree: action.payload.tree
          },
          question: action.payload.question,
          userAnswers: initializeUserAnswers(
            [
              { schemeQuestionId: action.payload.question.id, comment: '', codedAnswers: [] },
              ...action.payload.codedQuestions
            ], normalizedQuestions, action.payload.userId
          ),
          mergedUserQuestions: action.payload.mergedUserQuestions
        }
      }

    case types.UPDATE_USER_VALIDATION_REQUEST:
      return {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          ...handleUpdateUserAnswers(state, action, state.selectedCategoryId, true)
        }
      }

    case types.ON_CHANGE_VALIDATION_PINCITE:
      return {
        ...state,
        ...questionUpdater('answers', handleUserPinciteQuestion)
      }

    case types.ON_CHANGE_VALIDATION_COMMENT:
      return {
        ...state,
        ...questionUpdater('comment', action.comment)
      }

    case types.ON_CLEAR_VALIDATION_ANSWER:
      return {
        ...state,
        ...questionUpdater('answers', handleClearAnswers)
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

    case types.CLEAR_FLAG:
      let flagIndex = null

      const flagComments = state.question.isCategoryQuestion
        ? state.mergedUserQuestions[action.questionId][state.selectedCategoryId].flagsComments
        : state.mergedUserQuestions[action.questionId].flagsComments

      const { id, type, notes, ...flag } = flagComments.find((item, i) => {
        if (item.id === action.flagId) {
          flagIndex = i
        }
        return item.id === action.flagId
      })

      if (Object.keys(flag).length === 1) {
        flagComments.splice(flagIndex, 1)
      } else {
        flagComments.splice(flagIndex, 1, flag)
      }

      return {
        ...state,
        mergedUserQuestions: {
          ...state.mergedUserQuestions,
          [action.questionId]: {
            ...state.mergedUserQuestions[action.questionId],
            ...state.question.isCategoryQuestion
              ? {
                [state.selectedCategoryId]: {
                  ...state.mergedUserQuestions[action.questionId][state.selectedCategoryId],
                  flagComments
                }
              }
              : {
                flagComments
              }
          }
        }
      }

    case types.CLEAR_RED_FLAG:
      return {
        ...state,
        question: { ...state.question, flags: [] },
        scheme: {
          ...state.scheme,
          byId: {
            ...state.scheme.byId,
            [action.questionId]: {
              ...state.scheme.byId[action.questionId],
              flags: []
            }
          }
        }
      }

    case types.GET_USER_VALIDATED_QUESTIONS_SUCCESS:
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
        mergedUserQuestions: action.payload.mergedUserQuestions,
        question,
        ...other,
        selectedCategory: 0,
        categories: undefined,
        selectedCategoryId: null
      }

    case types.ON_APPLY_VALIDATION_TO_ALL:
      const catQuestion = state.userAnswers[state.question.id][state.selectedCategoryId]
      return {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          [state.question.id]: {
            ...state.categories.reduce((obj, category) => ({
              ...obj,
              [category.id]: { ...catQuestion, categoryId: category.id }
            }), {})
          }
        }
      }

    case types.ON_QUESTION_SELECTED_IN_VAL_NAV:
      return getQuestionSelectedInNav(state, action)

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