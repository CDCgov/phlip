import * as types from './actionTypes'
import {
  determineShowButton,
  handleUpdateUserAnswers,
  handleUpdateUserCodedQuestion,
  handleUpdateUserCategoryChild,
  handleClearAnswers,
  handleUserPinciteQuestion,
  initializeNavigator,
  handleCheckCategories
} from 'utils/codingHelpers'
import { sortList } from 'utils'

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
  mergedUserQuestions: null
}

const codingReducer = (state = INITIAL_STATE, action) => {
  const questionUpdater = state.question.isCategoryQuestion
    ? handleUpdateUserCategoryChild(state, action)
    : handleUpdateUserCodedQuestion(state, action)

  switch (action.type) {
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
        sortList(action.payload.question.possibleAnswers, 'order', 'asc')
        return {
          ...state,
          outline: action.payload.outline,
          scheme: action.payload.scheme,
          question: action.payload.question,
          userAnswers: action.payload.userAnswers,
          categories: undefined
        }
      }

    case types.GET_QUESTION_SUCCESS:
      return {
        ...action.payload.updatedState,
        ...handleCheckCategories(
          action.payload.question,
          action.payload.currentIndex,
          action.payload.updatedState
        )
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
        ...questionUpdater('comment', action.comment)
      }

    case types.ON_SAVE_RED_FLAG:
      const curQuestion = { ...state.scheme.byId[action.questionId] }
      return {
        ...state,
        question: {
          ...state.question,
          flags: [action.flagInfo]
        },
        scheme: {
          ...state.scheme,
          byId: {
            ...state.scheme.byId,
            [action.questionId]: {
              ...curQuestion,
              flags: [action.flagInfo]
            }
          }
        }
      }

    case types.ON_SAVE_FLAG:
      return {
        ...state,
        ...questionUpdater('flag', action.flagInfo)
      }

    case types.ON_CHANGE_PINCITE:
      return {
        ...state,
        ...questionUpdater('answers', handleUserPinciteQuestion)
      }

    case types.APPLY_ANSWER_TO_ALL:
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

    case types.ON_CLEAR_ANSWER:
      return {
        ...state,
        ...questionUpdater('answers', handleClearAnswers)
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
      return {
        ...state,
        userAnswers: action.payload.userAnswers,
        question: action.payload.question,
        scheme: action.payload.scheme,
        ...action.payload.otherUpdates,
        selectedCategory: 0,
        categories: undefined,
        selectedCategoryId: null
      }

    case types.ON_CLOSE_CODE_SCREEN:
      return INITIAL_STATE

    case types.GET_PREV_QUESTION:
    case types.GET_NEXT_QUESTION:
    case types.ON_QUESTION_SELECTED_IN_NAV:
      console.log(action.questionInfo)
      return {
        ...state,
        //...action.questionInfo
      }

    case types.GET_USER_CODED_QUESTIONS_REQUEST:
    case types.GET_CODING_OUTLINE_REQUEST:
    default:
      return state
  }
}

const codingSceneReducer = (state = INITIAL_STATE, action) => {
  if (Object.values(types).includes(action.type)) {
    const intermediateState = codingReducer(state, action)
    console.log('intermediate state', intermediateState)

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