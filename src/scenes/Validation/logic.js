import { createLogic } from 'redux-logic'
import { sortQuestions, getQuestionNumbers } from 'utils/treeHelpers'
import { getTreeFromFlatData, getFlatDataFromTree, walk } from 'react-sortable-tree'
import {
  getFinalCodedObject, initializeAndCheckAnswered, getQuestionAndInitialize,
  getPreviousQuestion, getQuestionSelectedInNav, getNextQuestion
} from 'utils/codingHelpers'
import { createAvatarUrl } from 'utils/urlHelper'
import { checkIfExists } from 'utils/codingSchemeHelpers'
import { normalize } from 'utils'
import * as types from './actionTypes'

const addCoderToAnswers = (existingQuestion, question, coder) => {
  let flagComment = {}

  if (question.flag !== null) {
    flagComment = { ...question.flag, raisedBy: { ...coder } }
  }
  if (question.comment !== '') {
    flagComment = { ...flagComment, comment: question.comment, raisedBy: { ...coder } }
  }

  return {
    ...existingQuestion,
    answers: [...existingQuestion.answers, ...question.codedAnswers.map(answer => ({ ...answer, ...coder }))],
    flagsComments: Object.keys(flagComment).length > 0
      ? [...existingQuestion.flagsComments, flagComment]
      : [...existingQuestion.flagsComments]
  }
}

const mergeInUserCodedQuestions = (codedQuestions, codeQuestionsPerUser, coder) => {
  const baseQuestion = { flagsComments: [], answers: [] }
  return codeQuestionsPerUser.reduce((allCodedQuestions, question) => {
    const doesExist = checkIfExists(question, allCodedQuestions, 'schemeQuestionId')
    return {
      ...allCodedQuestions,
      [question.schemeQuestionId]: question.categoryId && question.categoryId !== 0
        ? {
          ...allCodedQuestions[question.schemeQuestionId],
          [question.categoryId]: {
            ...addCoderToAnswers(
              doesExist
                ? checkIfExists(question, allCodedQuestions[question.schemeQuestionId], 'categoryId')
                  ? allCodedQuestions[question.schemeQuestionId][question.categoryId]
                  : baseQuestion
                : baseQuestion, question, coder)
          }
        }
        : {
          ...addCoderToAnswers(doesExist
            ? allCodedQuestions[question.schemeQuestionId]
            : baseQuestion, question, coder)
        }
    }
  }, codedQuestions)
}

const getCoderInformation = async ({ api, action, questionId }) => {
  let codedQuestionObj = {}, allCodedQuestions = []

  try {
    allCodedQuestions = await api.getAllCodedQuestionsForQuestion(action.projectId, action.jurisdictionId, questionId)
  } catch (e) {
    throw { error: 'failed to get all coded questions' }
  }
  if (allCodedQuestions.length === 0) {
    codedQuestionObj = { [questionId]: { answers: [], flagsComments: [] } }
  }
  for (let coderUser of allCodedQuestions) {
    if (coderUser.codedQuestions.length > 0) {
      codedQuestionObj = { ...mergeInUserCodedQuestions(codedQuestionObj, coderUser.codedQuestions, coderUser.coder) }
    }
  }

  return { codedQuestionObj }
}

//TODO: const getAvatarForValidatedBy = async ({}) 

/*
  Some of the reusable functions need to know whether we're on the validation screen or not, so that's what this is for
 */
export const updateValidatorLogic = createLogic({
  type: [types.UPDATE_USER_ANSWER_REQUEST, types.ON_APPLY_ANSWER_TO_ALL],
  transform({ action, getState }, next) {
    next({
      ...action,
      otherProps: { validatedBy: { ...getState().data.user.currentUser } },
      isValidation: true
    })
  }
})

/*
  Logic for when the user first opens the validation screen
 */
export const getValidationOutlineLogic = createLogic({
  type: types.GET_VALIDATION_OUTLINE_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_VALIDATION_OUTLINE_SUCCESS,
    failType: types.GET_VALIDATION_OUTLINE_FAIL
  },
  async process({ action, getState, api }) {
    let scheme = {}, validatedQuestions = []
    const userId = getState().data.user.currentUser.id

    // Try to get the project coding scheme
    try {
      scheme = await api.getScheme(action.projectId)
    } catch (e) {
      throw { error: 'failed to get outline' }
    }

    // Get user coded questions for currently selected jurisdiction
    if (action.jurisdictionId) {
      try {
        validatedQuestions = await api.getValidatedQuestions(action.projectId, action.jurisdictionId)
      } catch (e) {
        throw { error: 'failed to get validated questions' }
      }
    } else {
      // Check if the scheme is empty, if it is, there's nothing to do so send back empty status
      if (scheme.schemeQuestions.length === 0) {
        return { isSchemeEmpty: true, areJurisdictionsEmpty: true }
      }
      return { isSchemeEmpty: false, areJurisdictionsEmpty: true }
    }

    // Create one array with the outline information in the question information
    const merge = scheme.schemeQuestions.reduce((arr, q) => {
      return [...arr, { ...q, ...scheme.outline[q.id] }]
    }, [])

    // Create a sorted question tree with sorted children with question numbering and order
    const { questionsWithNumbers, order, tree } = getQuestionNumbers(sortQuestions(getTreeFromFlatData({ flatData: merge })))
    const questionsById = normalize.arrayToObject(questionsWithNumbers)
    const firstQuestion = questionsWithNumbers[0]

    // Check if the first question has answers, if it doesn't send a request to create an empty coded question
    const { userAnswers } = await initializeAndCheckAnswered(
      firstQuestion, validatedQuestions, questionsById, userId, action, api.createEmptyValidatedQuestion
    )

    // Get all the coded questions for this question
    const { codedQuestionObj } = await getCoderInformation({
      api,
      action,
      questionId: firstQuestion.id
    })

    const uniqueValidatedUsersIds = validatedQuestions.map((validatedQuestion) => {
      return validatedQuestion.validatedBy.userId
    }).filter((elem, pos, arr) => {
      return arr.indexOf(elem) == pos;
    })


    let uniqueUsersWithAvatar = []
    for (let userId of uniqueValidatedUsersIds) {
      try {
        const avatar = await api.getUserImage(userId)
        let userWithId = { id: userId, avatar }
        uniqueUsersWithAvatar = [...uniqueUsersWithAvatar, { ...userWithId }]

      } catch (e) {
        throw { error: 'failed to get validatedBy avatar image' }
      }
    }
    const validatedByUserImagesById = normalize.arrayToObject(uniqueUsersWithAvatar)

    return {
      outline: scheme.outline,
      scheme: { byId: questionsById, tree, order },
      userAnswers,
      question: firstQuestion,
      validatedQuestions,
      isSchemeEmpty: false,
      areJurisdictionsEmpty: false,
      userId,
      mergedUserQuestions: codedQuestionObj,
      validatedByUserImagesById
    }
  }
})

/*
  Logic for when the user navigates to a question
 */
export const getQuestionLogicValidation = createLogic({
  type: [types.ON_QUESTION_SELECTED_IN_NAV, types.GET_NEXT_QUESTION, types.GET_PREV_QUESTION],
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_QUESTION_SUCCESS,
    failType: types.GET_QUESTION_FAIL
  },
  latest: true,
  async process({ getState, action, api }) {
    const state = getState().scenes.validation
    const userId = getState().data.user.currentUser.id
    let questionInfo = {}

    // How did the user navigate to the currently selected question
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

    const { updatedState, question, currentIndex } = await getQuestionAndInitialize(
      state, action, userId, api, api.createEmptyValidatedQuestion, questionInfo
    )

    const { codedQuestionObj } = await getCoderInformation({ api, action, questionId: question.id })


    return {
      updatedState: { ...updatedState, mergedUserQuestions: { ...state.mergedUserQuestions, ...codedQuestionObj } },
      question,
      currentIndex
    }
  }
})

/*
  Logic for when a validator does anything to a validation question
 */
export const validateQuestionLogic = createLogic({
  type: [
    types.UPDATE_USER_ANSWER_REQUEST, types.ON_CHANGE_PINCITE, types.ON_CLEAR_ANSWER,
    types.ON_APPLY_ANSWER_TO_ALL, types.ON_CHANGE_COMMENT
  ],
  processOptions: {
    dispatchReturn: true,
    successType: types.UPDATE_USER_ANSWER_SUCCESS,
    failType: types.UPDATE_USER_ANSWER_FAIL
  },
  latest: true,
  async process({ getState, action, api }) {
    const validationState = getState().scenes.validation
    const validatorId = getState().data.user.currentUser.id
    const answerObject = getFinalCodedObject(validationState, action, action.type === types.ON_APPLY_ANSWER_TO_ALL)
    return await api.validateQuestion(action.projectId, action.jurisdictionId, action.questionId, {
      ...answerObject,
      validatedBy: validatorId
    })
  }
})

/*
  Logic for when the validator changes jurisdictions on the validation screen
 */
export const getUserValidatedQuestionsLogic = createLogic({
  type: types.GET_USER_VALIDATED_QUESTIONS_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_USER_VALIDATED_QUESTIONS_SUCCESS,
    failType: types.GET_USER_VALIDATED_QUESTIONS_FAIL
  },
  async process({ action, api, getState }) {
    let validatedQuestions = []
    const userId = getState().data.user.currentUser.id
    const state = getState().scenes.validation
    let question = { ...state.question }
    let otherUpdates = {}

    // Get user coded questions for a project and jurisdiction
    try {
      validatedQuestions = await api.getValidatedQuestions(action.projectId, action.jurisdictionId)
    } catch (e) {
      throw { error: 'failed to get codedQuestions' }
    }

    // If the current question is a category question, then change the current question to parent
    if (state.question.isCategoryQuestion) {
      question = state.scheme.byId[question.parentId]
      otherUpdates = {
        currentIndex: state.scheme.order.findIndex(id => id === question.id),
        categories: undefined,
        selectedCategory: 0,
        selectedCategoryId: null
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

    const { userAnswers } = await initializeAndCheckAnswered(
      updatedSchemeQuestion, validatedQuestions, updatedScheme.byId, userId, action, api.createEmptyValidatedQuestion
    )

    const { codedQuestionObj } = await getCoderInformation({ api, action, questionId: updatedSchemeQuestion.id })

    const uniqueValidatedUsersIds = validatedQuestions.map((validatedQuestion) => {
      return validatedQuestion.validatedBy.userId
    }).filter((elem, pos, arr) => {
      return arr.indexOf(elem) == pos;
    })


    let uniqueUsersWithAvatar = []
    for (let userId of uniqueValidatedUsersIds) {
      try {
        const avatar = await api.getUserImage(userId)
        let userWithId = { id: userId, avatar }
        uniqueUsersWithAvatar = [...uniqueUsersWithAvatar, { ...userWithId }]

      } catch (e) {
        throw { error: 'failed to get validatedBy avatar image' }
      }
    }
    const validatedByUserImagesById = normalize.arrayToObject(uniqueUsersWithAvatar)

    return {
      userAnswers,
      question: { ...state.scheme.byId[updatedSchemeQuestion.id], ...updatedSchemeQuestion },
      scheme: updatedScheme,
      otherUpdates,
      mergedUserQuestions: codedQuestionObj,
      validatedByUserImagesById
    }
  }
})

/*
  Calls an api route to clear the flag based on the action.flagId
 */
export const clearFlagLogic = createLogic({
  type: [types.CLEAR_RED_FLAG, types.CLEAR_FLAG],
  async process({ action, api }) {
    return await api.clearFlag(action.flagId)
  }
})

export default [
  updateValidatorLogic,
  getUserValidatedQuestionsLogic,
  validateQuestionLogic,
  getQuestionLogicValidation,
  getValidationOutlineLogic,
  clearFlagLogic
]