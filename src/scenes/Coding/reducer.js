import * as types from './actionTypes'
import { normalize } from 'utils'
import * as questionTypes from 'scenes/CodingScheme/scenes/AddEditQuestion/constants'

const INITIAL_STATE = {
  question: {},
  scheme: {},
  outline: {},
  jurisdiction: {},
  currentIndex: 0,
  categories: undefined,
  selectedCategory: 0,
  userAnswers: {}
}

/*
 This function basically takes an array of user coded question answers: { answers: [{ answerId: 1, pincite: '' }] },
 and converts it to an object like: { answers: { 1: { answerId: 1, pincite: '' }}}.

 It accounts for category children. If the question object has a categoryId, then the final answers object, looks like
 this: { answers: { [categoryId]: { answers: { 1 : { answerId: 1, pincite: '' } } } }}. Comments are handled the same way
 for category question children.

 Text field type questions are handled different since there will only be one answer instead of multiple and doesn't have
 an ID. It looks like this: { answers: { value: '', pincite: '' } }
 */
const normalizeAnswers = (question, codingSchemeQuestion, userCodedAnswerObj) => {
  if (codingSchemeQuestion.questionType === questionTypes.CATEGORY) {
    return { answers: normalize.arrayToObject(question.answers, 'codingSchemeAnswerId') }
  } else if (question.categoryId) {
    return {
      answers: {
        ...userCodedAnswerObj[question.id].answers,
        [question.categoryId]: { answers: normalize.arrayToObject(question.answers, 'codingSchemeAnswerId') }
      },
      comment: {
        ...userCodedAnswerObj[question.id].comment,
        [question.categoryId]: ''
      }
    }
  } else if (codingSchemeQuestion.questionType === questionTypes.TEXT_FIELD) {
    return question.answers.length > 0
      ? {
        answers: {
          ...question.answers[0],
          pincite: question.answers[0].pincite || '',
          textAnswer: question.answers[0].textAnswer || ''
        }
      }
      : { answers: { pincite: '', textAnswer: '' } }
  } else {
    return { answers: normalize.arrayToObject(question.answers, 'codingSchemeAnswerId') }
  }
}

/*
  Takes coded questions array and turns it into a object where each key is the question id
 */
const initializeUserAnswers = (userCodedQuestions, codingSchemeQuestions) => {
  return userCodedQuestions.reduce((codedQuestionObj, question) => {
    return ({
      ...codedQuestionObj,
      [question.questionId]: {
        ...question,
        ...normalizeAnswers(question, codingSchemeQuestions[question.questionId], codedQuestionObj)
      }
    })
  }, {})
}

const handleCheckCategories = (state, action) => {
  const newQuestion = state.scheme.byId[action.id]

  const base = {
    question: newQuestion,
    currentIndex: action.newIndex,
    userAnswers: state.userAnswers[action.id]
      ? { ...state.userAnswers }
      : {
        ...state.userAnswers,
        [action.id]: {
          questionId: action.id,
          answers: {},
          comment: ''
        }
      }
  }

  if (newQuestion.parentId === 0) {
    return {
      ...base,
      categories: undefined,
      selectedCategory: 0
    }
  }

  const parentQuestion = state.scheme.byId[newQuestion.parentId]

  if (parentQuestion.questionType === questionTypes.CATEGORY) {
    const selectedCategories = Object.keys(state.userAnswers[parentQuestion.id].answers).length !== 0
      ? parentQuestion.possibleAnswers.filter(category => state.userAnswers[parentQuestion.id].answers.hasOwnProperty(category.id))
      : parentQuestion.possibleAnswers

    const answers = selectedCategories.reduce((answerObj, cat) => {
      return {
        ...answerObj,
        answers: {
          ...answerObj.answers,
          [cat.id]: base.userAnswers[newQuestion.id].answers.hasOwnProperty(cat.id)
            ? { ...base.userAnswers[newQuestion.id].answers[cat.id] }
            : { answers: {} }
        },
        comment: {
          ...answerObj.comment,
          [cat.id]: base.userAnswers[newQuestion.id].comment.hasOwnProperty(cat.id)
            ? base.userAnswers[newQuestion.id].comment[cat.id]
            : ''
        }
      }
    }, {})

    return {
      ...base,
      question: { ...base.question, isCategoryChild: true },
      categories: [...selectedCategories],
      selectedCategory: state.selectedCategory,
      userAnswers: { ...state.userAnswers, [newQuestion.id]: { ...base.userAnswers[newQuestion.id], ...answers } }
    }
  } else {
    return {
      ...base,
      categories: undefined,
      selectedCategory: 0
    }
  }
}

const handleUpdateUserAnswers = (questionType, action, currentUserAnswers = null) => {
  switch (questionType) {
    case questionTypes.BINARY:
    case questionTypes.MULTIPLE_CHOICE:
      return { [action.answerId]: { codingSchemeAnswerId: action.answerId, pincite: '' } }
    case questionTypes.TEXT_FIELD:
      return { ...currentUserAnswers, textAnswer: action.answerValue }
    case questionTypes.CATEGORY:
    case questionTypes.CHECKBOXES:
      if (currentUserAnswers.hasOwnProperty(action.answerId)) delete currentUserAnswers[action.answerId]
      else currentUserAnswers = { ...currentUserAnswers, [action.answerId]: { codingSchemeAnswerId: action.answerId, pincite: '' } }
      return { ...currentUserAnswers }
  }
}

/*
  Handles if the user updates the answer to a category question child
 */
const handleUserAnswerCategoryChild = (selectedCategoryId, questionType, action, currentUserAnswerObj) => ({
  ...currentUserAnswerObj,
  [selectedCategoryId]: {
    ...currentUserAnswerObj[selectedCategoryId],
    answers: {
      ...handleUpdateUserAnswers(questionType, action, currentUserAnswerObj[selectedCategoryId].answers)
    }
  }
})

/*
  Handles if a user updates the comment of a category question child
 */
const handleUserCommentCategoryChild = (selectedCategoryId, action, currentUserCommentObj) => ({
  ...currentUserCommentObj,
  [selectedCategoryId]: action.comment
})

/*
  Handles if a user updates the pincite of a question
*/
const handleUserPinciteQuestion = (questionType, action, currentUserAnswers) => {
  switch (questionType) {
    case questionTypes.BINARY:
    case questionTypes.MULTIPLE_CHOICE:
      return { [action.answerId]: { ...currentUserAnswers[action.answerId], pincite: action.pincite } }
    case questionTypes.TEXT_FIELD:
      return { ...currentUserAnswers, pincite: action.pincite }
    case questionTypes.CATEGORY:
    case questionTypes.CHECKBOXES:
      return {
        ...currentUserAnswers,
        [action.answerId]: { ...currentUserAnswers[action.answerId], pincite: action.pincite }
      }
  }
}

/*
  Handles if a user updated the pincite of a category question child
 */
const handleUserPinciteCategoryChild = (selectedCategoryId, questionType, action, currentUserAnswerObj) => ({
  ...currentUserAnswerObj,
  [selectedCategoryId]: {
    ...currentUserAnswerObj[selectedCategoryId],
    answers: {
      ...handleUserPinciteQuestion(questionType, action, currentUserAnswerObj[selectedCategoryId].answers)
    }
  }
})

/*
  Reusable function so I stop repeating everything but the fieldValue part
 */
const handleUpdateUserCodedQuestion = (state, action) => (fieldValue, getFieldValues) => ({
  userAnswers: {
    ...state.userAnswers,
    [action.questionId]: {
      ...state.userAnswers[action.questionId],
      [fieldValue]: getFieldValues
    }
  }
})

const handleClearAnswers = (questionType, currentAnswerObj) => {
  return questionType === questionTypes.TEXT_FIELD
    ? { textAnswer: '', pincite: '' }
    : {}
}

const handleClearCategoryAnswers = (selectedCategoryId, questionType, currentUserAnswerObj) => ({
  ...currentUserAnswerObj,
  [selectedCategoryId]: {
    ...currentUserAnswerObj[selectedCategoryId],
    answers: {
      ...handleClearAnswers(questionType, currentUserAnswerObj[selectedCategoryId].answers)
    }
  }
})

const codingReducer = (state = INITIAL_STATE, action) => {
  const questionUpdater = handleUpdateUserCodedQuestion(state, action)
  const selectedCategoryId = state.categories !== undefined ? state.categories[state.selectedCategory].id : 0

  switch (action.type) {
    case types.GET_NEXT_QUESTION:
    case types.GET_PREV_QUESTION:
      return {
        ...state,
        ...handleCheckCategories(state, action)
      }

    case types.GET_CODING_OUTLINE_SUCCESS:
      const normalizedQuestions = normalize.arrayToObject(action.payload.scheme)

      return {
        ...state,
        outline: action.payload.outline,
        scheme: {
          byId: normalizedQuestions,
          order: action.payload.questionOrder
        },
        question: action.payload.question,
        userAnswers: action.payload.codedQuestions.length !== 0
          ? initializeUserAnswers(action.payload.codedQuestions, normalizedQuestions)
          : {
            [action.payload.question.id]: {
              comment: '',
              answers: {}
            }
          }
      }

    case types.UPDATE_USER_ANSWER_REQUEST:
      console.log(action)
      return {
        ...state,
        ...questionUpdater(
          'answers',
          state.question.isCategoryChild
            ? handleUserAnswerCategoryChild(selectedCategoryId, state.question.questionType, action, state.userAnswers[action.questionId].answers)
            : handleUpdateUserAnswers(state.question.questionType, action, state.userAnswers[action.questionId].answers)
        )
      }

    case types.ON_CHANGE_COMMENT:
      return {
        ...state,
        ...questionUpdater(
          'comment',
          state.question.isCategoryChild
            ? handleUserCommentCategoryChild(selectedCategoryId, action, state.userAnswers[action.questionId].comment)
            : action.comment
        )
      }

    case types.ON_CHANGE_PINCITE:
      return {
        ...state,
        ...questionUpdater(
          'answers',
          state.question.isCategoryChild
            ? handleUserPinciteCategoryChild(selectedCategoryId, state.question.questionType, action, state.userAnswers[action.questionId].answers)
            : handleUserPinciteQuestion(state.question.questionType, action, state.userAnswers[action.questionId].answers)
        )
      }

    case types.ON_CLEAR_ANSWER:
      return {
        ...state,
        ...questionUpdater(
          'answers',
          state.question.isCategoryChild
            ? handleClearCategoryAnswers(selectedCategoryId, state.question.questionType, state.userAnswers[action.questionId].answers)
            : handleClearAnswers(state.question.questionType, state.userAnswers[action.questionId].answers)
        )
      }

    case types.ON_CHANGE_CATEGORY:
      return {
        ...state,
        selectedCategory: action.selection
      }

    case types.ON_CLOSE_CODE_SCREEN:
      return INITIAL_STATE

    case types.GET_CODING_OUTLINE_REQUEST:
    default:
      return state
  }
}
export default codingReducer