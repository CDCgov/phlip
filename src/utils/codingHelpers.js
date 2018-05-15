import { normalize } from 'utils'
import sortList from 'utils/sortList'
import * as questionTypes from 'components/CodingValidation/constants'
import { getTreeFromFlatData } from 'react-sortable-tree'
import { getQuestionNumbers, sortQuestions } from 'utils/treeHelpers'

export const initializeValues = question => {
  const { codedAnswers, ...initializedQuestion } = {
    ...question.id ? { id: question.id } : {},
    ...question,
    comment: question.comment || '',
    flag: question.flag !== null ? question.flag : { notes: '', type: 0, raisedBy: {} },
    answers: normalize.arrayToObject(question.codedAnswers, 'schemeAnswerId'),
    schemeQuestionId: question.schemeQuestionId,
    isNewCodedQuestion: !question.hasOwnProperty('id'),
    hasMadePost: false
  }
  return initializedQuestion
}

/*
 This function basically takes an array of user coded question answers: { answers: [{ answerId: 1, pincite: '' }] },
 and converts it to an object like: { answers: { 1: { answerId: 1, pincite: '' }}}.

 It accounts for category children. If the question object has a categoryId, then the final answers object, looks like
 this: { [categoryId]: { answers: { 1 : { answerId: 1, pincite: '' } } }}. Comments are handled the same way
 for category question children.

 Text field type questions are handled different since there will only be one answer instead of multiple and doesn't have
 an ID. It looks like this: { answers: { value: '', pincite: '' } }
 */
export const initializeUserAnswers = (userCodedQuestions, codingSchemeQuestions, userId, initialObj = {}) => {
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
  }, initialObj)
}

/**
 * Finds the next question that is a parent question in case of category questions having not been answered
 */
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
  Initializes an object to be used for creating entry in user answers
 */
export const initializeNextQuestion = question => ({
  comment: '',
  flag: { notes: '', type: 0, raisedBy: {} },
  codedAnswers: [],
  schemeQuestionId: question.id
})

/*
 Sends back an initialized object for a question in userAnswers
 */
export const initializeRegularQuestion = id => ({
  schemeQuestionId: id,
  answers: {},
  comment: '',
  flag: { notes: '', type: 0, raisedBy: {} },
  hasMadePost: false,
  isNewCodedQuestion: true
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
  let categories = state.categories, selectedCategoryId = state.selectedCategoryId,
    selectedCategory = state.selectedCategory

  // Check to make sure newQuestion is correct. If the newQuestion is a category child, but the user hasn't selected
  // any categories, then find the next parent question
  if (newQuestion.isCategoryQuestion) {
    if (!checkIfAnswered(state.scheme.byId[newQuestion.parentId], state.userAnswers)) {
      const p = findNextParentSibling(state.scheme, state.question, state.currentIndex)
      if (p !== undefined) {
        newQuestion = state.scheme.byId[p]
        newIndex = state.scheme.order.indexOf(p)
        categories = undefined
        selectedCategoryId = null
        selectedCategory = 0
      }
    } else {
      categories = getSelectedCategories(state.scheme.byId[newQuestion.parentId], state.userAnswers)
      selectedCategory = state.selectedCategory
      selectedCategoryId = categories[selectedCategory].id
    }
  }
  return { index: newIndex, question: newQuestion, categories, selectedCategoryId, selectedCategory }
}

export const getPreviousQuestion = (state, action) => {
  let newQuestion = state.scheme.byId[action.id]
  let newIndex = action.newIndex
  let categories = state.categories, selectedCategoryId = state.selectedCategoryId,
    selectedCategory = state.selectedCategory

  if (newQuestion.isCategoryQuestion) {
    if (!checkIfAnswered(state.scheme.byId[newQuestion.parentId], state.userAnswers)) {
      newQuestion = state.scheme.byId[newQuestion.parentId]
      newIndex = state.scheme.order.indexOf(newQuestion.id)
      categories = undefined
      selectedCategoryId = null
      selectedCategory = 0
    } else {
      categories = getSelectedCategories(state.scheme.byId[newQuestion.parentId], state.userAnswers)
      selectedCategory = state.selectedCategory
      selectedCategoryId = categories[selectedCategory].id
    }
  }
  return { index: newIndex, question: newQuestion, categories, selectedCategoryId, selectedCategory }
}

/*
  Handles updating state.userAnswers with the user's new answer
 */
export const handleUpdateUserAnswers = (state, action) => {
  let currentUserAnswers = state.question.isCategoryQuestion
    ? state.userAnswers[action.questionId][state.selectedCategoryId].answers
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
          [state.selectedCategoryId]: {
            ...state.userAnswers[action.questionId][state.selectedCategoryId],
            answers: { ...currentUserAnswers },
            ...action.isValidation ? { validatedBy: action.otherProps.validatedBy } : {}
          }
        }
        : {
          answers: { ...currentUserAnswers }, ...action.isValidation
            ? { validatedBy: action.otherProps.validatedBy }
            : {}
        }

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
  Handles any updates for 'fieldValue' in state.userAnswers that are for regular questions
 */
export const handleUpdateUserCodedQuestion = (state, action) => (fieldValue, getFieldValues) => ({
  userAnswers: {
    ...state.userAnswers,
    [state.question.id]: {
      ...state.userAnswers[state.question.id],
      [fieldValue]: typeof getFieldValues === 'function' ? getFieldValues(state, action) : getFieldValues
    }
  }
})

export const updateCodedQuestion = (state, questionId, updatedQuestion) => ({
  userAnswers: {
    ...state.userAnswers,
    [questionId]: {
      ...state.userAnswers[questionId],
      ...updatedQuestion
    }
  }
})

export const updateCategoryCodedQuestion = (state, questionId, categoryId, updatedQuestion) => {
  let update = { [categoryId]: { ...updatedQuestion } }

  if (state.userAnswers.hasOwnProperty(questionId)) {
    if (state.userAnswers[questionId].hasOwnProperty(categoryId)) {
      update = {
        [categoryId]: {
          ...state.userAnswers[questionId][categoryId],
          ...updatedQuestion
        }
      }
    }
  }

  return {
    userAnswers: {
      ...state.userAnswers,
      [questionId]: {
        ...state.userAnswers[questionId],
        ...update
      }
    }
  }
}

/*
  Handles any updates for 'fieldValue' in state.userAnswers that are for category child questions
 */
export const handleUpdateUserCategoryChild = (state, action) => (fieldValue, getFieldValues) => ({
  userAnswers: {
    ...state.userAnswers,
    [state.question.id]: {
      ...state.userAnswers[state.question.id],
      [state.selectedCategoryId]: {
        ...state.userAnswers[state.question.id][state.selectedCategoryId],
        [fieldValue]: typeof getFieldValues === 'function' ? getFieldValues(state, action) : getFieldValues
      }
    }
  }
})

/*
 Initializes and updates the navigator
 */
export const initializeNavigator = (tree, scheme, codedQuestions, currentQuestion) => {
  return tree.map(item => {
    if (!item.isCategory) {
      item.text = scheme[item.id].text
      item.hint = scheme[item.id].hint
      item.possibleAnswers = scheme[item.id].possibleAnswers
      item.flags = scheme[item.id].flags
    }

    item.isAnswered = item.isCategoryQuestion ? false : checkIfAnswered(item, codedQuestions)
    if (item.children) {
      item.children = item.questionType === questionTypes.CATEGORY
        ? item.isAnswered
          ? initializeNavigator(sortList(Object.values(scheme)
              .filter(question => question.parentId === item.id), 'positionInParent', 'asc'),
            { ...scheme },
            codedQuestions,
            currentQuestion
          ) : []
        : initializeNavigator(item.children, { ...scheme }, codedQuestions, currentQuestion)
    }

    if (item.isCategoryQuestion) {
      let countAnswered = 0

      /*
       item: category question children
       */
      if (checkIfExists(scheme[item.parentId], codedQuestions)) {
        item.children = Object.values(codedQuestions[item.parentId].answers).map((category, index) => {
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
            positionInParent: schemeAnswer.order - 1,
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

    if ((item.id === currentQuestion.id || currentQuestion.parentId === item.id) && item.children) {
      item.expanded = true
    }

    return item
  })
}

/*
  Determines what question was selected in the navigator, and updates the state accordingly, even if the user selects a
  a category
 */
export const getQuestionSelectedInNav = (state, action) => {
  let q = {}, categories = undefined, selectedCategory = 0, selectedCategoryId = null

  if (action.question.isCategory || action.question.isCategoryQuestion) {
    q = action.question.isCategory
      ? state.scheme.byId[action.question.schemeQuestionId]
      : state.scheme.byId[action.question.id]
    categories = getSelectedCategories(state.scheme.byId[q.parentId], state.userAnswers)
    selectedCategory = action.question.isCategory ? action.question.treeIndex : 0
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
}

/*
  Delete any 'ids' in answer objects in userAnswers because it fails on the backend with them
 */
const deleteAnswerIds = (answer) => {
  let ans = { ...answer }
  if (ans.id) delete ans.id
  return ans
}

/*
 Used to retrieve the request object body for updating a question answer, pincite, comment, flag, etc.
 */
export const getFinalCodedObject = (state, action, isValidation, selectedCategoryId = state.selectedCategoryId) => {
  const { ...questionObject } = state.scheme.byId[action.questionId].isCategoryQuestion
    ? state.userAnswers[action.questionId][selectedCategoryId]
    : state.userAnswers[action.questionId]

  const { answers, schemeQuestionId, ...answerObject } = {
    ...questionObject,
    codedAnswers: Object.values(questionObject.answers).map(deleteAnswerIds),
    ...isValidation ? { validatedBy: action.userId } : {}
  }

  return answerObject
}

/*
  Gets a specific scheme question, checks if it's answered and initializes it by sending a post if it's not. Sends back
  the updated user answers object. Called in Validation/logic and Coding/logic
 */
export const getSelectedQuestion = async (state, action, api, userId, questionInfo, apiGetMethod, userImages) => {
  let errors = {}, newSchemeQuestion = {},
    combinedQuestion = { ...state.scheme.byId[questionInfo.question.id] },
    updatedScheme = { ...state.scheme }, codedQuestion = {}, updatedState = { ...state }, initialize = true,
    newImages = {}

  // Get the scheme question from the db in case it has changed
  try {
    newSchemeQuestion = await api.getSchemeQuestion({}, {}, {
      questionId: questionInfo.question.id,
      projectId: action.projectId
    })
    sortList(newSchemeQuestion.possibleAnswers, 'order', 'asc')
    combinedQuestion = { ...state.scheme.byId[questionInfo.question.id], ...newSchemeQuestion }
    updatedScheme = {
      ...state.scheme,
      byId: {
        ...state.scheme.byId,
        [combinedQuestion.id]: { ...state.scheme.byId[combinedQuestion.id], ...combinedQuestion }
      }
    }

    if (action.page === 'validation') {
      if (combinedQuestion.flags.length > 0) {
        if (!checkIfExists(newSchemeQuestion.flags[0].raisedBy, userImages, 'userId')) {
          newImages = {
            ...newImages,
            [newSchemeQuestion.flags[0].raisedBy.userId]: { ...newSchemeQuestion.flags[0].raisedBy }
          }
        }
      }
    }
  } catch (error) {
    // Couldn't get the updated scheme question so use the old one
    errors = {
      newSchemeQuestion: 'We couldn\'t retrieve this scheme question. You still have access to the previous scheme question content, but any updates that have been made since the time you started coding are not available.'
    }
  }

  try {
    codedQuestion = await apiGetMethod({}, {}, {
      userId: userId,
      projectId: action.projectId,
      questionId: questionInfo.question.id,
      jurisdictionId: action.jurisdictionId
    })

    if (Array.isArray(codedQuestion) && codedQuestion.length > 0) {
      initialize = codedQuestion.length > 0
    } else if (typeof codedQuestion === 'object') {
      initialize = Object.keys(codedQuestion).length > 0
    } else {
      initialize = false
    }
  } catch (error) {
    errors = {
      ...errors,
      updatedCodedQuestion: 'We couldn\'t retrieve your updated answers. You still have access to the previous answers, but any changes that have been made since the time you started coding are not available.'
    }
    initialize = false
  }

  if (initialize === true) {
    if (combinedQuestion.isCategoryQuestion === true) {
      for (let question of codedQuestion) {
        if (question.hasOwnProperty('validatedBy')) {
          if (!checkIfExists(question.validatedBy, userImages, 'userId') &&
            !checkIfExists(question.validatedBy, newImages, 'userId')) {
            newImages = { ...newImages, [question.validatedBy.userId]: { ...question.validatedBy } }
          }
        }
        if (combinedQuestion.questionType === questionTypes.TEXT_FIELD && question.codedAnswers.length > 0) {
          question.codedAnswers[0].textAnswer = question.codedAnswers[0].textAnswer === null
            ? ''
            : question.codedAnswers[0].textAnswer
        }
        const updatedAnswers = updateCategoryCodedQuestion(updatedState, combinedQuestion.id, question.categoryId, initializeValues(question))
        updatedState = {
          ...updatedState,
          ...updatedAnswers
        }
      }
    } else {
      if (combinedQuestion.questionType === questionTypes.TEXT_FIELD && codedQuestion.codedAnswers.length > 0) {
        codedQuestion.codedAnswers[0].textAnswer = codedQuestion.codedAnswers[0].textAnswer === null
          ? ''
          : codedQuestion.codedAnswers[0].textAnswer
      }
      if (codedQuestion.hasOwnProperty('validatedBy')) {
        if (!checkIfExists(codedQuestion.validatedBy, userImages, 'userId') && !checkIfExists(codedQuestion.validatedBy, newImages, 'userId')) {
          newImages = { ...newImages, [codedQuestion.validatedBy.userId]: { ...codedQuestion.validatedBy } }
        }
      }
      updatedState = {
        ...updatedState,
        ...updateCodedQuestion(updatedState, combinedQuestion.id, initializeValues(codedQuestion))
      }
    }
  }

  updatedState = {
    ...updatedState,
    scheme: updatedScheme,
    selectedCategory: questionInfo.selectedCategory,
    selectedCategoryId: questionInfo.selectedCategoryId,
    categories: questionInfo.categories
  }

  return {
    question: combinedQuestion,
    currentIndex: questionInfo.index,
    updatedState,
    errors,
    newImages
  }
}

export const getSchemeAndInitialize = async (projectId, api) => {
  let scheme = {}, payload = { firstQuestion: {}, tree: [], order: [], questionsById: {} }
  try {
    scheme = await api.getScheme({}, {}, { projectId })

    if (scheme.schemeQuestions.length === 0) {
      return { isSchemeEmpty: true, ...payload }
    }

    // Create one array with the outline information in the question information
    const merge = scheme.schemeQuestions.reduce((arr, q) => {
      return [...arr, { ...q, ...scheme.outline[q.id] }]
    }, [])

    // Create a sorted question tree with sorted children with question numbering and order
    const { questionsWithNumbers, order, tree } = getQuestionNumbers(sortQuestions(getTreeFromFlatData({ flatData: merge })))
    const questionsById = normalize.arrayToObject(questionsWithNumbers)
    const firstQuestion = questionsWithNumbers[0]
    sortList(firstQuestion.possibleAnswers, 'order', 'asc')

    return { order, tree, questionsById, firstQuestion, outline: scheme.outline, isSchemeEmpty: false }

  } catch (error) {
    throw { error: 'Failed to get coding scheme.' }
  }
}

export const getCodedValidatedQuestions = async (projectId, jurisdictionId, userId, apiMethod) => {
  let codedValQuestions = [], codedValErrors = {}
  try {
    codedValQuestions = await apiMethod({}, {}, { userId, projectId, jurisdictionId })
    return { codedValQuestions, codedValErrors }
  } catch (e) {
    return {
      codedValQuestions: [],
      codedValErrors: {
        codedValQuestions: 'We couldn\'t get your answered questions for this project and jurisdiction, so you won\'t be able to answer questions.'
      }
    }
  }
}

export const getSchemeQuestionAndUpdate = async (projectId, state, question, api) => {
  let updatedSchemeQuestion = {}, schemeErrors = {}

  // Get scheme question in case there are changes
  try {
    updatedSchemeQuestion = await api.getSchemeQuestion({}, {}, { questionId: question.id, projectId })
  } catch (error) {
    updatedSchemeQuestion = { ...question }
    schemeErrors = {
      updatedSchemeQuestion: 'We couldn\'t get retrieve this scheme question. You still have access to the previous scheme question content, but any updates that have been made since the time you started coding are not available.'
    }
  }

  sortList(updatedSchemeQuestion.possibleAnswers, 'order', 'asc')

  // Update scheme with new scheme question
  const updatedScheme = {
    ...state.scheme,
    byId: {
      ...state.scheme.byId,
      [updatedSchemeQuestion.id]: { ...state.scheme.byId[updatedSchemeQuestion.id], ...updatedSchemeQuestion }
    }
  }

  return { updatedScheme, schemeErrors, updatedSchemeQuestion }
}

export const generateError = errorsObj => {
  return Object.values(errorsObj).join('\n\n')
}

export const checkIfAnswered = (item, userAnswers, id = 'id') => {
  return userAnswers.hasOwnProperty(item[id]) &&
    Object.keys(userAnswers[item[id]].answers).length > 0
}

export const checkIfExists = (item, obj, id = 'id') => {
  return obj.hasOwnProperty(item[id])
}