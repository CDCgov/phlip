import { normalize } from 'utils'
import { checkIfAnswered, checkIfExists } from 'utils/codingSchemeHelpers'
import sortList from 'utils/sortList'
import * as questionTypes from 'scenes/CodingScheme/scenes/AddEditQuestion/constants'

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
    return checkIfExists(question, userCodedAnswerObj, 'schemeQuestionId')
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
        }
      }
      : {
        schemeQuestionId: question.schemeQuestionId,
        answers: { [question.categoryId]: { answers: normalize.arrayToObject(question.codedAnswers, 'schemeAnswerId') } },
        comment: {
          [question.categoryId]: question.comment || ''
        }
      }
  } else {
    return {
      schemeQuestionId: question.schemeQuestionId,
      comment: question.comment,
      answers: normalize.arrayToObject(question.codedAnswers, 'schemeAnswerId')
    }
  }
}

export const normalizeCodedUserAnswers = (question, codingSchemeQuestion, userCodedAnswerObj) => {
  if (question.categoryId && question.categoryId !== 0) {
    return userCodedAnswerObj.hasOwnProperty(question.schemeQuestionId)
      ? {
        schemeQuestionId: question.schemeQuestionId,
        answers: {
          ...userCodedAnswerObj[question.schemeQuestionId].answers,
          [question.categoryId]: {
            answers: question.codedAnswers
          }
        },
        comment: {
          ...userCodedAnswerObj[question.schemeQuestionId].comment,
          [question.categoryId]: question.comment || ''
        }
      }
      : {
        schemeQuestionId: question.schemeQuestionId,
        answers: { [question.categoryId]: { answers: question.codedAnswers } },
        comment: {
          [question.categoryId]: question.comment || ''
        }
      }
  } else {
    return {
      schemeQuestionId: question.schemeQuestionId,
      comment: question.comment,
      answers: question.codedAnswers
    }
  }
}

/*
  Takes coded questions array and turns it into a object where each key is the question id.
 */
export const initializeUserAnswers = (userCodedQuestions, codingSchemeQuestions) => {
  return userCodedQuestions.reduce((codedQuestionObj, question) => {
    return ({
      ...codedQuestionObj,
      [question.schemeQuestionId]: {
        ...question,
        schemeQuestionId: question.schemeQuestionId,
        ...normalizeAnswers(question, codingSchemeQuestions[question.schemeQuestionId], codedQuestionObj)
      }
    })
  }, {})
}

/*
  Takes coded questions array and turns it into a object where each key is the question id
 */
export const initializeCodedUsers = (userCodedQuestions, codingSchemeQuestions) => {
  return userCodedQuestions.reduce((codedQuestionObj, question) => {
    return ({
      ...codedQuestionObj,
      [question.schemeQuestionId]: {
        schemeQuestionId: question.schemeQuestionId,
        ...normalizeCodedUserAnswers(question, codingSchemeQuestions[question.schemeQuestionId], codedQuestionObj)
      }
    })
  }, {})
}

export const findNextParentSibling = (scheme, question, currentIndex) => {
  const subArr = [...scheme.order].slice(currentIndex + 1)
  return subArr.find(id => scheme.byId[id].parentId !== question.id)
}

/*
  Handles determining whether or not to show the 'next question' button at the bottom of the screen. If the question is
  a category question and no categories have been selected, check if there are any remaining questions in the list that
  aren't a child of the category questions. If there are none, don't show button, if there are do.
 */
export const determineShowButton = state => {
  if (state.question.questionType === questionTypes.CATEGORY) {
    if (!checkIfAnswered(state.question, state.userAnswers)) {
      return findNextParentSibling(state.scheme, state.question, state.currentIndex) !== undefined
    } else {
      return state.question.id !== state.scheme.order[state.scheme.order.length - 1]
    }
  } else {
    return state.scheme.order && state.question.id !== state.scheme.order[state.scheme.order.length - 1]
  }
}

export const getSelectedCategories = (parentQuestion, userAnswers) =>
  parentQuestion.possibleAnswers.filter(category => checkIfExists(category, userAnswers[parentQuestion.id].answers))

/*
  Handles determining what the next question is, and updating state.userAnswers with question information
 */
export const handleCheckCategories = (newQuestion, newIndex, state) => {
  const base = {
    question: newQuestion,
    currentIndex: newIndex,
    userAnswers: checkIfExists(newQuestion, state.userAnswers)
      ? { ...state.userAnswers }
      : { ...state.userAnswers, [newQuestion.id]: initializeRegularQuestion(newQuestion.id) }
  }

  if (newQuestion.parentId === 0) {
    return {
      ...base,
      categories: undefined,
      selectedCategory: 0,
      selectedCategoryId: null
    }
  }

  if (newQuestion.isCategoryQuestion) {
    const parentQuestion = state.scheme.byId[newQuestion.parentId]
    const selectedCategories = getSelectedCategories(parentQuestion, state.userAnswers)
    const baseQuestion = base.userAnswers[newQuestion.id]

    const answers = selectedCategories.reduce((answerObj, cat) => {
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
      userAnswers: { ...state.userAnswers, [newQuestion.id]: { ...base.userAnswers[newQuestion.id], ...answers } },
      selectedCategoryId: selectedCategories[state.selectedCategory].id
    }
  } else {
    return {
      ...base,
      categories: undefined,
      selectedCategory: 0,
      selectedCategoryId: null
    }
  }
}

export const getNextQuestion = (state, action) => {
  let newQuestion = state.scheme.byId[action.id]
  let newIndex = action.newIndex

  // Check to make sure newQuestion is correct. If the newQuestion is a category child, but the user hasn't selected
  // any categories, then find the next parent question
  if (newQuestion.isCategoryQuestion) {
    if (!checkIfAnswered(state.scheme.byId[newQuestion.parentId], state.userAnswers)) {
      const p = findNextParentSibling(state.scheme, state.question, state.currentIndex)
      if (p !== undefined) {
        newQuestion = state.scheme.byId[p]
        newIndex = state.scheme.order.indexOf(p)
      }
    }
  }

  return handleCheckCategories(newQuestion, newIndex, state)
}

export const getPreviousQuestion = (state, action) => {
  let newQuestion = state.scheme.byId[action.id]
  let newIndex = action.newIndex

  if (newQuestion.isCategoryQuestion) {
    if (!checkIfAnswered(state.scheme.byId[newQuestion.parentId], state.userAnswers)) {
      newQuestion = state.scheme.byId[newQuestion.parentId]
      newIndex = state.scheme.order.indexOf(newQuestion.id)
    }
  }

  return handleCheckCategories(newQuestion, newIndex, state)
}

/*
  Handles updating state.userAnswers with the user's new answer
 */
export const handleUpdateUserAnswers = (state, action, selectedCategoryId, isValidation = false) => {
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
      if (action.answerValue === '') currentUserAnswers = {}
      else {
        currentUserAnswers = {
          [action.answerId]: {
            ...currentUserAnswers[action.answerId],
            schemeAnswerId: action.answerId,
            textAnswer: action.answerValue
          }
        }
      }

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
      ... action.isValidation ? { validatedBy: action.validatedBy } : {},
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
    case questionTypes.TEXT_FIELD:
      return { [action.answerId]: { ...currentUserAnswers[action.answerId], pincite: action.pincite } }
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
export const handleClearAnswers = questionType => ({})

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

export const initializeRegularQuestion = id => ({
  schemeQuestionId: id,
  answers: {},
  comment: ''
})

export const initializeNavigator = (tree, scheme, codedQuestions, currentQuestion) => {
  tree.map(item => {
    item.isAnswered = checkIfAnswered(item, codedQuestions) && !item.isCategoryQuestion

    if (item.children) {
      item.children = item.questionType === questionTypes.CATEGORY
        ? checkIfAnswered(item, codedQuestions)
          ? initializeNavigator(
            sortList(Object.values(scheme)
            .filter(question => question.parentId === item.id), 'positionInParent', 'asc'),
            { ...scheme },
            codedQuestions,
            currentQuestion
          ) : []
        : initializeNavigator(item.children, { ...scheme }, codedQuestions, currentQuestion)
    }

    if ((item.id === currentQuestion.id || currentQuestion.parentId === item.id) && item.children) {
      item.expanded = true
    }

    if (item.isCategoryQuestion) {
      let countAnswered = 0

      item.children = checkIfExists(scheme[item.parentId], codedQuestions)
        ? Object.values(codedQuestions[item.parentId].answers).map((category, index) => {
          const isAnswered =
            checkIfAnswered(item, codedQuestions) &&
            checkIfAnswered(category, codedQuestions[item.id].answers, 'schemeAnswerId')

          countAnswered = isAnswered ? countAnswered += 1 : countAnswered

          return {
            schemeAnswerId: category.schemeAnswerId,
            text: scheme[item.parentId].possibleAnswers.find(answer => answer.id === category.schemeAnswerId).text,
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
      } else {
        if (checkIfExists(item, 'completedProgress')) delete item.completedProgress
      }
    }

    return item
  })
  return tree
}

export const getQuestionSelectedInNav = (state, action) => {
  let q = {}, categories = undefined, selectedCategory = 0, selectedCategoryId = null

  if (action.question.isCategory || action.question.isCategoryQuestion) {
    q = action.question.isCategory
      ? state.scheme.byId[action.question.schemeQuestionId]
      : state.scheme.byId[action.question.id]
    categories = getSelectedCategories(state.scheme.byId[q.parentId], state.userAnswers)
    selectedCategory = action.question.isCategory ? action.question.positionInParent : 0
    selectedCategoryId = categories[selectedCategory].id
  } else {
    q = state.scheme.byId[action.question.id]
  }

  return {
    ...state,
    ...handleCheckCategories(q, state.scheme.order.findIndex(id => q.id === id), {
      ...state,
      categories,
      selectedCategory,
      selectedCategoryId
    })
  }
}
