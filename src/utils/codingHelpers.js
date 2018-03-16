import { normalize } from 'utils'
import { checkIfAnswered, checkIfExists, checkIfCategoryAnswered } from 'utils/codingSchemeHelpers'
import sortList from 'utils/sortList'
import * as questionTypes from 'scenes/CodingScheme/scenes/AddEditQuestion/constants'

const initializeValues = question => {
  return {
    ... question.id ? { id: question.id } : {},
    comment: question.comment || '',
    flag: question.flag || { notes: '', type: 0 },
    answers: normalize.arrayToObject(question.codedAnswers, 'schemeAnswerId'),
    schemeQuestionId: question.schemeQuestionId
  }
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
export const initializeUserAnswers = (userCodedQuestions, codingSchemeQuestions, userId) => {
  return userCodedQuestions.reduce((codedQuestionObj, question) => {
    return ({
      ...codedQuestionObj,
      [question.schemeQuestionId]: question.categoryId && question.categoryId !== 0
        ? {
          ...codedQuestionObj[question.schemeQuestionId],
          [question.categoryId]: { ...initializeValues(question, codingSchemeQuestions[question.schemeQuestionId], userId) }
        }
        : { ...initializeValues(question, codingSchemeQuestions[question.schemeQuestionId], userId) }
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

const initializeNextQuestion = (question, questionId) => ({
  comment: '',
  flag: { notes: '', type: 0 },
  answers: {},
  schemeQuestionId: questionId,
  ...question
})

/*
  Handles determining what the next question is, and updating state.userAnswers with question information
 */
export const handleCheckCategories = (newQuestion, newIndex, state) => {
  const base = {
    question: newQuestion,
    currentIndex: newIndex,
    userAnswers: checkIfExists(newQuestion, state.userAnswers)
      ? { ...state.userAnswers }
      : newQuestion.isCategoryQuestion
        ? { ...state.userAnswers }
        : {
          ...state.userAnswers,
          [newQuestion.id]: initializeRegularQuestion(newQuestion.id)
        }
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
    const selectedCategories = sortList(getSelectedCategories(parentQuestion, state.userAnswers), 'order', 'asc')
    const baseQuestion = base.userAnswers[newQuestion.id]

    const answers = selectedCategories.reduce((answerObj, cat) => {
      return {
        ...answerObj,
        [cat.id]: {
          ...initializeRegularQuestion(base.question.id),
          categoryId: cat.id,
          schemeQuestionId: base.question.id
        }
      }
    }, {})

    return {
      ...base,
      question: { ...base.question },
      categories: [...selectedCategories],
      selectedCategory: state.selectedCategory,
      userAnswers: { ...state.userAnswers, [newQuestion.id]: { ...answers, ...baseQuestion } },
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
  let categories = state.categories, selectedCategoryId = state.selectedCategoryId, selectedCategory = state.selectedCategory

  // Check to make sure newQuestion is correct. If the newQuestion is a category child, but the user hasn't selected
  // any categories, then find the next parent question
  if (newQuestion.isCategoryQuestion) {
    if (!checkIfAnswered(state.scheme.byId[newQuestion.parentId], state.userAnswers)) {
      const p = findNextParentSibling(state.scheme, state.question, state.currentIndex)
      if (p !== undefined) {
        newQuestion = state.scheme.byId[p]
        newIndex = state.scheme.order.indexOf(p)
        categories = null
        selectedCategoryId = undefined
        selectedCategory = 0
      }
    }
  }
  return { index: newIndex, question: newQuestion, categories, selectedCategoryId, selectedCategory }
}

export const getPreviousQuestion = (state, action) => {
  let newQuestion = state.scheme.byId[action.id]
  let newIndex = action.newIndex
  let categories = state.categories, selectedCategoryId = state.selectedCategoryId, selectedCategory = state.selectedCategory

  if (newQuestion.isCategoryQuestion) {
    if (!checkIfAnswered(state.scheme.byId[newQuestion.parentId], state.userAnswers)) {
      newQuestion = state.scheme.byId[newQuestion.parentId]
      newIndex = state.scheme.order.indexOf(newQuestion.id)
      categories = null
      selectedCategoryId = undefined
      selectedCategory = 0
    }
  }
  return { index: newIndex, question: newQuestion, categories, selectedCategoryId, selectedCategory }
}

/*
  Handles updating state.userAnswers with the user's new answer
 */
export const handleUpdateUserAnswers = (state, action, selectedCategoryId, isValidation = false) => {
  let currentUserAnswers = state.question.isCategoryQuestion
    ? state.userAnswers[action.questionId][selectedCategoryId].answers
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
            textAnswer: action.answerValue,
            pincite: currentUserAnswers[action.answerId] ? currentUserAnswers[action.answerId].pincite || '' : ''
          }
        }
      }

      break

    case questionTypes.CATEGORY:
      // If they uncheck a category, then delete all other answers that have been associated with that category
      if (checkIfExists(action, currentUserAnswers, 'answerId')) {
        Object.values(state.scheme.byId).forEach(question => {
          if (question.parentId === action.questionId) {
            if (otherAnswerUpdates[question.id]) {
              delete otherAnswerUpdates[question.id][action.answerId]
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
      ...state.question.isCategoryQuestion
        ? {
          [selectedCategoryId]: {
            ...state.userAnswers[action.questionId][selectedCategoryId],
            answers: { ...currentUserAnswers },
            ...isValidation ? { validatedBy: action.validatedBy } : {}
          }
        }
        : { answers: { ...currentUserAnswers }, ...isValidation ? { validatedBy: action.validatedBy } : {} }

    }
  }
}

/*
  Handles if a user updates the pincite of a question
*/
export const handleUserPinciteQuestion = (state, action) => {
  let currentUserAnswers = state.question.isCategoryQuestion
    ? state.userAnswers[action.questionId][state.selectedCategoryId].answers
    : state.userAnswers[action.questionId].answers

  switch (state.question.questionType) {
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
  Updating pincite and comment use this method
 */
export const handleUpdateUserCodedQuestion = (state, action) => (fieldValue, getFieldValues) => ({
  userAnswers: {
    ...state.userAnswers,
    [action.questionId]: {
      ...state.userAnswers[action.questionId],
      [fieldValue]: typeof getFieldValues === 'function' ? getFieldValues(state, action) : getFieldValues
    }
  }
})

export const handleUpdateUserCategoryChild = (state, action) => (fieldValue, getFieldValues) => ({
  userAnswers: {
    ...state.userAnswers,
    [action.questionId]: {
      ...state.userAnswers[action.questionId],
      [state.selectedCategoryId]: {
        ...state.userAnswers[action.questionId][state.selectedCategoryId],
        [fieldValue]: typeof getFieldValues === 'function' ? getFieldValues(state, action) : getFieldValues
      }
    }
  }
})

/*
  Clears answers when user clicks sweep button
 */
export const handleClearAnswers = () => ({})

export const initializeRegularQuestion = id => ({
  schemeQuestionId: id,
  answers: {},
  comment: '',
  flag: { notes: '', type: 0 }
})

export const initializeNavigator = (tree, scheme, codedQuestions, currentQuestion) => {
  tree.map(item => {
    item.isAnswered = item.isCategoryQuestion ? false : checkIfAnswered(item, codedQuestions)
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

      /*
       item: category question children
       */
      if (checkIfExists(scheme[item.parentId], codedQuestions)) {
        const sortedSelectedCategories = sortList(Object.values(codedQuestions[item.parentId].answers), 'order', 'asc')
        item.children = sortedSelectedCategories.map((category, index) => {
          const isAnswered =
            checkIfExists(item, codedQuestions) &&
            checkIfAnswered(category, codedQuestions[item.id], 'schemeAnswerId')

          countAnswered = isAnswered ? countAnswered += 1 : countAnswered

          const schemeAnswer = scheme[item.parentId].possibleAnswers.find(answer => answer.id ===
            category.schemeAnswerId)

          return {
            schemeAnswerId: category.schemeAnswerId,
            text: schemeAnswer.text,
            order: schemeAnswer.order,
            indent: item.indent + 1,
            positionInParent: index,
            isAnswered,
            schemeQuestionId: item.id,
            isCategory: true
          }
        })
      } else {
        item.children = []
      }

      item.children = sortList([...item.children], 'order', 'asc')

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
  sortList(q.possibleAnswers, 'order', 'asc')
  return {
    question: q,
    index: state.scheme.order.findIndex(id => q.id === id),
    categories,
    selectedCategoryId,
    selectedCategory
  }
  /*
  return {
    ...state,
    ...handleCheckCategories(q, state.scheme.order.findIndex(id => q.id === id), {
      ...state,
      categories,
      selectedCategory,
      selectedCategoryId
    })
  }*/
}

const deleteAnswerIds = (answer) => {
  let ans = { ...answer }
  if (ans.id) delete ans.id
  return ans
}

export const getFinalCodedObject = (state, action, applyAll = false) => {
  const questionObject = state.question.isCategoryQuestion
    ? state.userAnswers[action.questionId][state.selectedCategoryId]
    : state.userAnswers[action.questionId]

  const { answers, categoryId, schemeQuestionId, ...answerObject } = {
    ...questionObject,
    codedAnswers: Object.values(questionObject.answers).map(deleteAnswerIds),
    ...state.question.isCategoryQuestion
      ? { categories: applyAll ? [...state.categories.map(cat => cat.id)] : [state.selectedCategoryId] }
      : {}
  }

  return answerObject
}
