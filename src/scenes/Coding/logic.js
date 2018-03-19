import { createLogic } from 'redux-logic'
import * as types from './actionTypes'
import { sortQuestions, getQuestionNumbers } from 'utils/treeHelpers'
import { getTreeFromFlatData, getFlatDataFromTree, walk } from 'react-sortable-tree'
import {
  getFinalCodedObject,
  initializeUserAnswers,
  getQuestionSelectedInNav,
  getNextQuestion,
  getPreviousQuestion
} from 'utils/codingHelpers'
import { checkIfAnswered, checkIfExists } from 'utils/codingSchemeHelpers'
import { normalize } from 'utils'
import sortList from 'utils/sortList'

const initializeAndCheckAnswered = async (question, codedQuestions, schemeById, userId, action, api) => {
  // Initialize object for holding user answers
  const userAnswers = initializeUserAnswers(
    [
      {
        schemeQuestionId: question.id,
        comment: '',
        codedAnswers: [],
        flag: { notes: '', type: 0, raisedBy: {} }
      }, ...codedQuestions
    ],
    schemeById
  )

  console.log(question)

  // Check if the first question is answered, if it's not, then send a request to create an empty coded question
  // on the backend. This fixes issues with duplication of text fields answer props
  const answered = checkIfAnswered(question, userAnswers)
  console.log(answered)
  if (!answered) {
    const q = await api.createEmptyCodedQuestion(question.id, action.projectId, action.jurisdictionId, userId, userAnswers[question.id])
    userAnswers[question.id] = { ...userAnswers[question.id], id: q.id }
  }

  console.log(userAnswers)

  return { userAnswers }
}

// TODO: use returned object from creating a coded question, because codedQuestionId is needed
export const getOutlineLogic = createLogic({
  type: types.GET_CODING_OUTLINE_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_CODING_OUTLINE_SUCCESS,
    failType: types.GET_CODING_OUTLINE_FAIL
  },
  async process({ action, getState, api }) {
    let scheme = {}
    let codedQuestions = []
    const userId = getState().data.user.currentUser.id

    try {
      scheme = await api.getScheme(action.projectId)
    } catch (e) {
      throw { error: 'failed to get outline' }
    }

    if (action.jurisdictionId) {
      try {
        codedQuestions = await api.getUserCodedQuestions(userId, action.projectId, action.jurisdictionId)
      } catch (e) {
        throw { error: 'failed to get codedQuestions' }
      }
    }

    // Check if the scheme is empty, if it is, there's nothing to do so send back empty status
    if (scheme.schemeQuestions.length === 0) {
      return { isSchemeEmpty: true }
    } else {
      const merge = scheme.schemeQuestions.reduce((arr, q) => {
        return [...arr, { ...q, ...scheme.outline[q.id] }]
      }, [])

      // Create a sorted question tree with sorted children with question numbering and order
      const { questionsWithNumbers, order, tree } = getQuestionNumbers(sortQuestions(getTreeFromFlatData({ flatData: merge })))
      const questionsById = normalize.arrayToObject(questionsWithNumbers)
      const firstQuestion = questionsWithNumbers[0]
      const { userAnswers } = await initializeAndCheckAnswered(firstQuestion, codedQuestions, questionsById, userId, action, api)

      return {
        outline: scheme.outline,
        scheme: { byId: questionsById, tree, order },
        userAnswers,
        question: firstQuestion,
        codedQuestions,
        isSchemeEmpty: false,
        userId
      }
    }
  }
})

// TODO: make sure to create an empty coded question when a user changes categories, handle previous question and selecting question in nav
export const getQuestionLogic = createLogic({
  type: [types.ON_QUESTION_SELECTED_IN_NAV, types.GET_NEXT_QUESTION, types.GET_PREV_QUESTION],
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_QUESTION_SUCCESS,
    failType: types.GET_QUESTION_FAIL
  },
  latest: true,
  async process({ getState, action, api }) {
    const state = getState().scenes.coding
    const userId = getState().data.user.currentUser.id
    let questionInfo = {}, answered = false, unanswered = [],
      updatedAnswers = { ...state.userAnswers }

    switch (action.type) {
      case types.ON_QUESTION_SELECTED_IN_NAV:
        questionInfo = getQuestionSelectedInNav(state, action)
        break
      case types.GET_NEXT_QUESTION:
        questionInfo = getNextQuestion(state, action)
        break
      case types.GET_PREV_QUESTION:
        questionInfo = getPreviousQuestion(state, action)
        break
    }

    // Get the scheme question from the db in case it has changed
    const newSchemeQuestion = await api.getSchemeQuestion(questionInfo.question.id, action.projectId)
    sortList(newSchemeQuestion.possibleAnswers, 'order', 'asc')
    const combinedQuestion = { ...state.scheme.byId[questionInfo.question.id], ...newSchemeQuestion }

    // Check if question is answered
    if (combinedQuestion.isCategoryQuestion) {
      unanswered = questionInfo.categories.filter(category => {
        return checkIfExists(combinedQuestion, state.userAnswers)
          ? !checkIfExists(category, state.userAnswers[combinedQuestion.id])
          : true
      })
      answered = unanswered.length === 0
    } else {
      answered = checkIfAnswered(state.scheme.byId[combinedQuestion.id], state.userAnswers)
    }

    // If it's not answered create an empty coded question object
    if (!answered) {
      const question = await api.createEmptyCodedQuestion(
        combinedQuestion.id, action.projectId, action.jurisdictionId, userId, {
          categories: questionInfo.selectedCategoryId === null ? [] : [...unanswered.map(cat => cat.id)],
          flag: { notes: '', type: 0 },
          codedAnswers: [],
          comment: '',
          schemeQuestionId: combinedQuestion.id,
          answers: {}
        })
      updatedAnswers = initializeUserAnswers(combinedQuestion.isCategoryQuestion ? [...question] : [question], {
        ...state.scheme.byId,
        [combinedQuestion.id]: combinedQuestion
      }, userId, updatedAnswers)
    }

    const updatedState = {
      userAnswers: updatedAnswers,
      scheme: {
        ...state.scheme,
        byId: {
          ...state.scheme.byId,
          [combinedQuestion.id]: combinedQuestion
        }
      },
      selectedCategory: questionInfo.selectedCategory,
      selectedCategoryId: questionInfo.selectedCategoryId,
      categories: questionInfo.categories
    }

    return {
      question: combinedQuestion,
      currentIndex: questionInfo.index,
      updatedState
    }
  }
})

// TODO: make sure the codedQuestionId is not removed when answering a question
export const answerQuestionLogic = createLogic({
  type: [
    types.UPDATE_USER_ANSWER_REQUEST, types.ON_CHANGE_COMMENT, types.ON_CHANGE_PINCITE, types.ON_CLEAR_ANSWER,
    types.APPLY_ANSWER_TO_ALL, types.ON_SAVE_FLAG
  ],
  processOptions: {
    dispatchReturn: true,
    successType: types.UPDATE_USER_ANSWER_SUCCESS,
    failType: types.UPDATE_USER_ANSWER_FAIL
  },
  latest: true,
  async process({ getState, action, api }) {
    const userId = getState().data.user.currentUser.id
    const codingState = getState().scenes.coding
    const answerObject = getFinalCodedObject(codingState, action, action.type === types.APPLY_ANSWER_TO_ALL)
    return await api.answerQuestion(action.projectId, action.jurisdictionId, userId, action.questionId, answerObject)
  }
})

// TODO: update the tree item when a scheme question is updated
export const getUserCodedQuestionsLogic = createLogic({
  type: types.GET_USER_CODED_QUESTIONS_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_USER_CODED_QUESTIONS_SUCCESS,
    failType: types.GET_USER_CODED_QUESTIONS_FAIL
  },
  async process({ action, api, getState }) {
    let codedQuestions = []
    const userId = getState().data.user.currentUser.id
    const state = getState().scenes.coding
    let question = { ...state.question }
    let otherUpdates = {}

    // Get user coded questions for a project and jurisdiction
    try {
      codedQuestions = await api.getUserCodedQuestions(userId, action.projectId, action.jurisdictionId)
    } catch (e) {
      throw { error: 'failed to get codedQuestions' }
    }

    // If the current question is a category question, then change the current question to parent
    if (state.question.isCategoryQuestion) {
      question = state.scheme.byId[question.parentId]
      otherUpdates = {
        currentIndex: state.scheme.order.findIndex(id => id === question.id)
      }
    }

    // Get scheme question in case there are changes
    const updatedSchemeQuestion = await api.getSchemeQuestion(question.id, action.projectId)

    // Update scheme with new scheme question
    const updatedScheme = {
      ...state.scheme,
      byId: {
        ...state.scheme.byId,
        [updatedSchemeQuestion.id]: { ...state.scheme.byId[updatedSchemeQuestion.id], ...updatedSchemeQuestion }
      }
    }

    const { userAnswers } = await initializeAndCheckAnswered(updatedSchemeQuestion, codedQuestions, updatedScheme.byId, userId, action, api)

    return {
      userAnswers,
      question: { ...state.scheme.byId[updatedSchemeQuestion.id], ...updatedSchemeQuestion },
      scheme: updatedScheme,
      otherUpdates
    }
  }
})

// Save red flag logic
export const saveRedFlagLogic = createLogic({
  type: types.ON_SAVE_RED_FLAG,
  async process({ action, api }) {
    const flag = { ...action.flagInfo, raisedBy: action.flagInfo.raisedBy.userId }
    return await api.saveRedFlag(action.questionId, flag)
  }
})

export default [
  getOutlineLogic,
  getQuestionLogic,
  getUserCodedQuestionsLogic,
  answerQuestionLogic,
  saveRedFlagLogic
]