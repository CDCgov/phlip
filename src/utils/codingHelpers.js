import { normalize } from 'utils'
import * as questionTypes from 'scenes/CodingScheme/scenes/AddEditQuestion/constants'
import { checkIfAnswered, checkIfExists } from 'utils/codingSchemeHelpers'

/*
 This function basically takes an array of user coded question answers: { answers: [{ answerId: 1, pincite: '' }] },
 and converts it to an object like: { answers: { 1: { answerId: 1, pincite: '' }}}.

 It accounts for category children. If the question object has a categoryId, then the final answers object, looks like
 this: { answers: { [categoryId]: { answers: { 1 : { answerId: 1, pincite: '' } } } }}. Comments are handled the same way
 for category question children.

 Text field type questions are handled different since there will only be one answer instead of multiple and doesn't have
 an ID. It looks like this: { answers: { value: '', pincite: '' } }
 */
export const normalizeAnswers = (question, codingSchemeQuestion, userCodedAnswerObj) => {
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
export const initializeUserAnswers = (userCodedQuestions, codingSchemeQuestions) => {
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
export const determineShowButton = state => {
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

export const initializeRegularQuestion = id => ({
  schemeQuestionId: id,
  answers: {},
  comment: ''
})

export const getSelectedCategories = (parentQuestion, userAnswers) =>
  parentQuestion.possibleAnswers.filter(category => checkIfExists(category, userAnswers[parentQuestion.id].answers))

/*
  Handles determining what the next question is, and updating state.userAnswers with question information
 */
export const handleCheckCategories = (newQuestion, newIndex, state) => {
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

export const getNextQuestion = (state, action) => {
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

export const getPreviousQuestion = (state, action) => {
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
export const handleUpdateUserAnswers = (state, action, selectedCategoryId) => {
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
export const handleUserCommentCategoryChild = (selectedCategoryId, action, currentUserCommentObj) => ({
  ...currentUserCommentObj,
  [selectedCategoryId]: action.comment
})

/*
  Handles if a user updates the pincite of a question
*/
export const handleUserPinciteQuestion = (questionType, action, currentUserAnswers) => {
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
export const handleUserPinciteCategoryChild = (selectedCategoryId, questionType, action, currentUserAnswerObj) => ({
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
export const handleUpdateUserCodedQuestion = (state, action) => (fieldValue, getFieldValues) => ({
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
export const handleClearAnswers = questionType => {
  return questionType === questionTypes.TEXT_FIELD
    ? { textAnswer: '', pincite: '' }
    : {}
}

/*
  Clears the category for current question from state.userAnswers
 */
export const handleClearCategoryAnswers = (selectedCategoryId, questionType, currentUserAnswerObj) => ({
  ...currentUserAnswerObj,
  [selectedCategoryId]: {
    ...currentUserAnswerObj[selectedCategoryId],
    answers: {
      ...handleClearAnswers(questionType, currentUserAnswerObj[selectedCategoryId].answers)
    }
  }
})

export const initializeEmptyCategoryQuestion = categories => {
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

export const initializeQuestionPart = (categories, prop, initial) => {
  return categories.reduce((obj, category) => ({
    [prop]: {
      ...obj[prop],
      [category.id]: { [prop]: initial }
    }
  }), {})
}

export const initializeQuestion = (question, userAnswers, categories) => {
  let answers = { ...userAnswers }
  if (!checkIfExists(question, userAnswers)) {
    answers = {
      ...answers,
      [question.id]: {
        schemeQuestionId: question.id,
        ...question.isCategoryQuestion ? initializeEmptyCategoryQuestion(categories) : { answers: {}, comment: '' }
      }
    }
  }

  return answers
}

export const initializeNavigator = (tree, scheme, codedQuestions) => {
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