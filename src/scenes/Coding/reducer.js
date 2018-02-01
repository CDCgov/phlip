import * as types from './actionTypes'
import { normalize } from 'utils'
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
  showNextButton: true
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
  if (question.categoryId && question.categoryId !== 0) {
    return userCodedAnswerObj.hasOwnProperty(question.codingSchemeQuestionId)
      ? {
        codingSchemeQuestionId: question.codingSchemeQuestionId,
        answers: {
          ...userCodedAnswerObj[question.codingSchemeQuestionId].answers,
          [question.categoryId]: {
            answers: normalize.arrayToObject(question.answers, 'codingSchemeAnswerId')
          }
        },
        comment: {
          ...userCodedAnswerObj[question.codingSchemeQuestionId].comment,
          [question.categoryId]: question.comment || ''
        }
      }
      : {
        answers: { [question.categoryId]: { answers: normalize.arrayToObject(question.answers, 'codingSchemeAnswerId') } },
        comment: {
          [question.categoryId]: question.comment || ''
        }
      }
  } else if (codingSchemeQuestion.questionType === questionTypes.TEXT_FIELD) {
    return question.answers.length > 0
      ? {
        ...question,
        answers: {
          ...question.answers[0],
          pincite: question.answers[0].pincite || '',
          textAnswer: question.answers[0].textAnswer || ''
        }
      }
      : { ...question, answers: { pincite: '', textAnswer: '' } }
  } else {
    return { ...question, answers: normalize.arrayToObject(question.answers, 'codingSchemeAnswerId') }
  }
}

/*
  Takes coded questions array and turns it into a object where each key is the question id
 */
const initializeUserAnswers = (userCodedQuestions, codingSchemeQuestions) => {
  return userCodedQuestions.reduce((codedQuestionObj, question) => {
    return ({
      ...codedQuestionObj,
      [question.codingSchemeQuestionId]: {
        codingSchemeQuestionId: question.codingSchemeQuestionId,
        ...normalizeAnswers(question, codingSchemeQuestions[question.codingSchemeQuestionId], codedQuestionObj)
      }
    })
  }, {})
}

/*
  Handles determining whether or not to show the 'next question' button at the bottom of the screen
 */
const determineShowButton = (state) => {
  if (state.question.questionType === questionTypes.CATEGORY) {
    if (Object.keys(state.userAnswers[state.question.id].answers).length === 0) {
      let subArr = [...state.scheme.order].slice(state.currentIndex + 1)
      let p = subArr.find(id => state.scheme.byId[id].parentId !== state.question.id)
      if (p !== undefined) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  } else {
    return state.scheme.order && state.question.id !== state.scheme.order[state.scheme.order.length - 1]
  }
}

/*
  Handles determining what the next question is, and updating state.userAnswers with question information
 */
const handleCheckCategories = (newQuestion, newIndex, state, action) => {

  const base = {
    question: newQuestion,
    currentIndex: newIndex,
    userAnswers: state.userAnswers[newQuestion.id]
      ? { ...state.userAnswers }
      : {
        ...state.userAnswers,
        [newQuestion.id]: {
          codingSchemeQuestionId: newQuestion.id,
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

const getNextQuestion = (state, action) => {
  let newQuestion = state.scheme.byId[action.id]
  let newIndex = action.newIndex

  // Check to make sure newQuestion is correct. If the newQuestion is a category child, but the user hasn't selected
  // any categories, then find the next parent question
  if (newQuestion.isCategoryQuestion) {
    if (Object.keys(state.userAnswers[state.scheme.byId[action.id].parentId].answers).length === 0) {
      let subArr = [...state.scheme.order].slice(action.newIndex)
      newQuestion = subArr.find(id => {
        if (state.scheme.byId[id].parentId !== state.question.id) {
          newIndex = state.scheme.order.indexOf(id)
          return true
        }
      })
      newQuestion = state.scheme.byId[newQuestion]
    }
  }

  return handleCheckCategories(newQuestion, newIndex, state, action)
}

const getPreviousQuestion = (state, action) => {
  let newQuestion = state.scheme.byId[action.id]
  let newIndex = action.newIndex

  if (newQuestion.isCategoryQuestion) {
    if (Object.keys(state.userAnswers[newQuestion.parentId].answers).length === 0) {
      newQuestion = state.scheme.byId[newQuestion.parentId]
      newIndex = state.scheme.order.indexOf(newQuestion.id)
    }
  }

  return handleCheckCategories(newQuestion, newIndex, state, action)
}

/*
  Handles updating state.userAnswers with the user's new answer
 */
const handleUpdateUserAnswers = (state, action, selectedCategoryId) => {
  let currentUserAnswers = state.question.isCategoryChild
    ? state.userAnswers[action.questionId].answers[selectedCategoryId].answers
    : state.userAnswers[action.questionId].answers

  let otherAnswerUpdates = { ...state.userAnswers }

  switch (state.question.questionType) {
    case questionTypes.BINARY:
    case questionTypes.MULTIPLE_CHOICE:
      currentUserAnswers = { [action.answerId]: { codingSchemeAnswerId: action.answerId, pincite: '' } }
      break

    case questionTypes.TEXT_FIELD:
      currentUserAnswers = { ...currentUserAnswers, textAnswer: action.answerValue }
      break

    case questionTypes.CATEGORY:
      if (currentUserAnswers.hasOwnProperty(action.answerId)) {
        Object.values(state.scheme.byId).forEach(question => {
          if (question.parentId === action.questionId) {
            if (otherAnswerUpdates[question.id]) {
              delete otherAnswerUpdates[question.id].answers[action.answerId]
              delete otherAnswerUpdates[question.id].comment[action.answerId]
            }
          }
        })
        delete currentUserAnswers[action.answerId]
      } else {
        currentUserAnswers = {
          ...currentUserAnswers,
          [action.answerId]: { codingSchemeAnswerId: action.answerId, pincite: '' }
        }
      }
      break

    case questionTypes.CHECKBOXES:
      if (currentUserAnswers.hasOwnProperty(action.answerId)) delete currentUserAnswers[action.answerId]
      else currentUserAnswers = {
        ...currentUserAnswers,
        [action.answerId]: { codingSchemeAnswerId: action.answerId, pincite: '' }
      }
  }

  return {
    ...otherAnswerUpdates,
    [action.questionId]: {
      ...state.userAnswers[action.questionId],
      answers: state.question.isCategoryChild
        ? {
          ...state.userAnswers[action.questionId].answers,
          [selectedCategoryId]: {
            ...state.userAnswers[action.questionId].answers[selectedCategoryId],
            answers: { ...currentUserAnswers }
          }
        }
        : { ...currentUserAnswers }
    }
  }
}

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
  Updating pincite and comment use this method
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

/*
  Clears answers when user clicks sweep button
 */
const handleClearAnswers = questionType => {
  return questionType === questionTypes.TEXT_FIELD
    ? { textAnswer: '', pincite: '' }
    : {}
}

/*
  Clears the category for current question from state.userAnswers
 */
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
      const updatedState = { ...state, ...getNextQuestion(state, action) }

      return {
        ...updatedState,
        showNextButton: determineShowButton(updatedState)
      }

    case types.GET_PREV_QUESTION:
      const update = { ...state, ...getPreviousQuestion(state, action) }
      return {
        ...update,
        showNextButton: determineShowButton(update)
      }

    case types.GET_CODING_OUTLINE_SUCCESS:
      if (action.payload.isSchemeEmpty) {
        return {
          ...state,
          scheme: { order: [], byId: {} },
          outline: {},
          question: {},
          userAnswers: {}
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
          userAnswers: action.payload.codedQuestions.length !== 0
            ? initializeUserAnswers(action.payload.codedQuestions, normalizedQuestions)
            : {
              [action.payload.question.id]: {
                codingSchemeQuestionId: action.payload.question.id,
                comment: '',
                answers: {}
              }
            }
        }

        if (!updatedState.userAnswers.hasOwnProperty(action.payload.question.id)) {
          updatedState = {
            ...updatedState,
            userAnswers: {
              ...updatedState.userAnswers,
              [action.payload.question.id]: {
                codingSchemeQuestionId: action.payload.question.id,
                comment: '',
                answers: {}
              }
            }
          }
        }

        return {
          ...updatedState,
          showNextButton: determineShowButton(updatedState)
        }
      }

    case types.UPDATE_USER_ANSWER_REQUEST:
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

    case types.ON_JURISDICTION_CHANGE:
      return {
        ...state,
        jurisdictionId: action.event,
        jurisdiction: action.jurisdictionsList.find(jurisdiction => jurisdiction.id === action.event)
      }

    case types.GET_USER_CODED_QUESTIONS_SUCCESS:
      let userAnswers = {}, question = { ...state.question }, other = {}

      if (action.payload.codedQuestions.length !== 0) {
        userAnswers = initializeUserAnswers(action.payload.codedQuestions, state.scheme.byId)
      }

      if (state.question.isCategoryQuestion) {
        question = state.scheme.byId[question.parentId]
        other = {
          currentIndex: state.scheme.order.findIndex(id => id === question.id)
        }
      }

      if (!userAnswers.hasOwnProperty(question.id)) {
        userAnswers = {
          ...userAnswers,
          [question.id]: {
            codingSchemeQuestionId: question.id,
            comment: '',
            answers: {}
          }
        }
      }

      const newState = { ...state, userAnswers, question, ...other }

      return {
        ...newState,
        selectedCategory: 0,
        categories: undefined,
        showNextButton: determineShowButton(newState)
      }

    case types.GET_USER_CODED_QUESTIONS_REQUEST:
    case types.GET_CODING_OUTLINE_REQUEST:
    default:
      return state
  }
}
export default codingReducer