import * as types from './actionTypes'
import { normalize } from 'utils'
import { checkIfAnswered, checkIfExists } from 'utils/codingSchemeHelpers'
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
    return userCodedAnswerObj.hasOwnProperty(question.schemeQuestionId)
      ? {
        schemeQuestionId: question.schemeQuestionId,
        answers: {
          ...userCodedAnswerObj[question.schemeQuestionId].answers,
          [question.categoryId]: {
            answers: normalize.arrayToObject(question.codedAnswers, 'schemeAnswerId')
          }
        },
        comment: {
          ...userCodedAnswerObj[question.schemeQuestionId].comment,
          [question.categoryId]: question.comment || ''
        },
        flag: {
          ...userCodedAnswerObj[question.schemeQuestionId].flag,
          [question.categoryId]: question.flag || 0
        }
      }
      : {
        schemeQuestionId: question.schemeQuestionId,
        answers: { [question.categoryId]: { answers: normalize.arrayToObject(question.codedAnswers, 'schemeAnswerId') } },
        comment: {
          [question.categoryId]: question.comment || ''
        },
        flag: { [question.categoryId]: question.flag || 0 }
      }
  } else if (codingSchemeQuestion.questionType === questionTypes.TEXT_FIELD) {
    return question.codedAnswers.length > 0
      ? {
        schemeQuestionId: question.schemeQuestionId,
        flag: question.flag || 0,
        comment: question.comment,
        answers: {
          ...question.codedAnswers[0],
          pincite: question.codedAnswers[0].pincite || '',
          textAnswer: question.codedAnswers[0].textAnswer || ''
        }
      }
      : { schemeQuestionId: question.schemeQuestionId, flag: 0, comment: '', answers: { pincite: '', textAnswer: '' } }
  } else {
    return {
      schemeQuestionId: question.schemeQuestionId,
      flag: question.flag,
      comment: question.comment,
      answers: normalize.arrayToObject(question.codedAnswers, 'schemeAnswerId')
    }
  }
}

/*
  Takes coded questions array and turns it into a object where each key is the question id
 */
const initializeUserAnswers = (userCodedQuestions, codingSchemeQuestions) => {
  return userCodedQuestions.reduce((codedQuestionObj, question) => {
    return ({
      ...codedQuestionObj,
      [question.schemeQuestionId]: {
        schemeQuestionId: question.schemeQuestionId,
        ...normalizeAnswers(question, codingSchemeQuestions[question.schemeQuestionId], codedQuestionObj)
      }
    })
  }, {})
}

/*
  Handles determining whether or not to show the 'next question' button at the bottom of the screen
 */
const determineShowButton = state => {
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

const initializeRegularQuestion = id => ({
  schemeQuestionId: id,
  answers: {},
  comment: ''
})

const getSelectedCategories = (parentQuestion, userAnswers) =>
  parentQuestion.possibleAnswers.filter(category => checkIfExists(category, userAnswers[parentQuestion.id].answers))

/*
  Handles determining what the next question is, and updating state.userAnswers with question information
 */
const handleCheckCategories = (newQuestion, newIndex, state) => {
  const base = {
    question: newQuestion,
    currentIndex: newIndex,
    userAnswers: state.userAnswers[newQuestion.id]
      ? { ...state.userAnswers }
      : { ...state.userAnswers, [newQuestion.id]: initializeRegularQuestion(newQuestion.id) }
  }

  if (newQuestion.parentId === 0) {
    return {
      ...base,
      categories: undefined,
      selectedCategory: 0
    }
  }

  if (newQuestion.isCategoryQuestion) {
    const parentQuestion = state.scheme.byId[newQuestion.parentId]
    const selectedCategories = getSelectedCategories(parentQuestion, state.userAnswers)
    const baseQuestion = base.userAnswers[newQuestion.id]

    const answers = selectedCategories.reduce((answerObj, cat) => {
      checkIfExists(cat, baseQuestion.answers)

      return {
        answers: {
          ...answerObj.answers,
          [cat.id]: checkIfExists(cat, baseQuestion.answers)
            ? { ...baseQuestion.answers[cat.id] }
            : { answers: {} }
        },
        comment: {
          ...answerObj.comment,
          [cat.id]: checkIfExists(cat, baseQuestion.comment)
            ? baseQuestion.comment[cat.id]
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
  let currentUserAnswers = state.question.isCategoryQuestion
    ? state.userAnswers[action.questionId].answers[selectedCategoryId].answers
    : state.userAnswers[action.questionId].answers

  let otherAnswerUpdates = { ...state.userAnswers }

  switch (state.question.questionType) {
    case questionTypes.BINARY:
    case questionTypes.MULTIPLE_CHOICE:
      currentUserAnswers = { [action.answerId]: { schemeAnswerId: action.answerId, pincite: '' } }
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
  }

  return {
    ...otherAnswerUpdates,
    [action.questionId]: {
      ...state.userAnswers[action.questionId],
      answers: state.question.isCategoryQuestion
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

const initializeEmptyCategoryQuestion = categories => {
  return categories.reduce((obj, category) => ({
    answers: {
      ...obj.answers,
      [category.id]: { answers: {} }
    },
    comment: {
      ...obj.comment,
      [category.id]: ''
    },
    flag: {
      ...obj.flag,
      [category.id]: 0
    }
  }), {})
}

const initializeQuestionPart = (categories, prop, initial) => {
  return categories.reduce((obj, category) => ({
    [prop]: {
      ...obj[prop],
      [category.id]: { [prop]: initial }
    }
  }), {})
}

const initializeQuestion = (question, userAnswers, categories) => {
  let answers = { ...userAnswers }
  if (!checkIfExists(question, userAnswers)) {
    answers = {
      ...answers,
      [question.id]: {
        schemeQuestionId: question.id,
        ... question.isCategoryQuestion ? initializeEmptyCategoryQuestion(categories) : { answers: {}, comment: '' }
      }
    }
  }

  return answers
}

const initializeNavigator = (tree, scheme, codedQuestions) => {
  tree.map(item => {
    item.isAnswered = codedQuestions.hasOwnProperty(item.id)
      ? Object.keys(codedQuestions[item.id].answers).length > 0 && !item.isCategoryQuestion
      : false

    if (item.children) {
      item.children = item.questionType === questionTypes.CATEGORY
        ? checkIfAnswered(item, codedQuestions) ? initializeNavigator(Object.values(scheme)
          .filter(question => question.parentId === item.id), { ...scheme }, codedQuestions) : []
        : initializeNavigator(item.children, { ...scheme }, codedQuestions)
    }

    if (item.isCategoryQuestion) {
      let countAnswered = 0

      item.children = codedQuestions[item.parentId]
        ? Object.values(codedQuestions[item.parentId].answers).map((cat, index) => {
          const isAnswered = codedQuestions.hasOwnProperty(item.id)
            ? codedQuestions[item.id].answers.hasOwnProperty(cat.schemeAnswerId)
              ? Object.keys(codedQuestions[item.id].answers[cat.schemeAnswerId].answers).length > 0
              : false
            : false

          countAnswered = isAnswered ? countAnswered += 1 : countAnswered

          return {
            schemeAnswerId: cat.schemeAnswerId,
            text: scheme[item.parentId].possibleAnswers.find(answer => answer.id === cat.schemeAnswerId).text,
            indent: item.indent + 1,
            positionInParent: index,
            isAnswered,
            schemeQuestionId: item.id,
            isCategory: true
          }
        })
        : []

      if (item.children.length > 0) {
        item.completedProgress = (countAnswered / item.children.length) * 100
        if ((countAnswered / item.children.length) * 100 === 100) {
          delete item.completedProgress
          item.isAnswered = true
        }
      } else {
        if (item.hasOwnProperty('completedProgress')) delete item.completedProgress
      }
    }

    return item
  })
  return tree
}

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
          scheme: { order: [], byId: {}, tree: [] },
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
                schemeQuestionId: action.payload.question.id,
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
                schemeQuestionId: action.payload.question.id,
                comment: '',
                answers: {}
              }
            }
          }
        }

        return {
          ...updatedState,
          scheme: {
            ...updatedState.scheme,
            tree: initializeNavigator(action.payload.tree, normalizedQuestions, updatedState.userAnswers)
          },
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
        showNextButton: determineShowButton(updated),
        scheme: {
          ...updated.scheme,
          tree: initializeNavigator(state.scheme.tree, updated.scheme.byId, updated.userAnswers)
        }
      }

    case types.ON_CHANGE_COMMENT:
      return {
        ...state,
        ...questionUpdater(
          'comment',
          state.question.isCategoryQuestion
            ? handleUserCommentCategoryChild(selectedCategoryId, action, state.userAnswers[action.questionId].comment)
            : action.comment
        )
      }

    case types.ON_CHANGE_PINCITE:
      return {
        ...state,
        ...questionUpdater(
          'answers',
          state.question.isCategoryQuestion
            ? handleUserPinciteCategoryChild(selectedCategoryId, state.question.questionType, action, state.userAnswers[action.questionId].answers)
            : handleUserPinciteQuestion(state.question.questionType, action, state.userAnswers[action.questionId].answers)
        )
      }

    case types.ON_CLEAR_ANSWER:
      const upState = {
        ...state,
        ...questionUpdater(
          'answers',
          state.question.isCategoryQuestion
            ? handleClearCategoryAnswers(selectedCategoryId, state.question.questionType, state.userAnswers[action.questionId].answers)
            : handleClearAnswers(state.question.questionType, state.userAnswers[action.questionId].answers)
        )
      }

      return {
        ...upState,
        scheme: {
          ...upState.scheme,
          tree: initializeNavigator(state.scheme.tree, upState.scheme.byId, upState.userAnswers)
        }
      }

    case types.ON_CHANGE_CATEGORY:
      return {
        ...state,
        selectedCategory: action.selection
      }

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
            schemeQuestionId: question.id,
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
        showNextButton: determineShowButton(newState),
        scheme: {
          ...newState.scheme,
          tree: initializeNavigator(state.scheme.tree, state.scheme.byId, newState.userAnswers)
        }
      }

    case types.ON_QUESTION_SELECTED_IN_NAV:
      let q = {}, categories = undefined, selectedCategory = 0, answers = { ...state.userAnswers }

      if (action.question.isCategory) {
        q = state.scheme.byId[action.question.schemeQuestionId]
        categories = state.scheme.byId[q.parentId].possibleAnswers.filter(category => state.userAnswers[q.parentId].answers.hasOwnProperty(category.id))
        selectedCategory = action.question.positionInParent
      } else if (action.question.isCategoryQuestion) {
        q = state.scheme.byId[action.question.id]
        categories = state.scheme.byId[q.parentId].possibleAnswers.filter(category => state.userAnswers[q.parentId].answers.hasOwnProperty(category.id))
        selectedCategory = 0
      } else {
        q = state.scheme.byId[action.question.id]
      }

      const freshState = {
        ...state,
        question: q,
        categories,
        selectedCategory,
        userAnswers: initializeQuestion(q, { ...state.userAnswers }, categories)
      }

      return {
        ...freshState,
        showNextButton: determineShowButton(freshState)
      }

    case types.ON_CLOSE_CODE_SCREEN:
      return INITIAL_STATE

    case types.GET_USER_CODED_QUESTIONS_REQUEST:
    case types.GET_CODING_OUTLINE_REQUEST:
    default:
      return state
  }
}

export default codingReducer