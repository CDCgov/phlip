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

  /*try {
    for (let question of codedQuestions) {
      try {
        let hasAvatarImage = await api.getUserPicture(question.validatedBy.userId)
        let avatarUrl = hasAvatarImage ? createAvatarUrl(question.validatedBy.userId) : null
        let validatedBy = { ...question.validatedBy, avatarUrl }
        updatedCodedQuestions = [...updatedCodedQuestions, { ...question, validatedBy }]
      } catch (e) {
        throw { error: 'failed to get avatar image for validator' }
      }
    }
  } catch (e) {
    throw { error: 'failed to get codedQuestions' }
  }*/

  try {
    allCodedQuestions = await api.getAllCodedQuestionsForQuestion(action.projectId, action.jurisdictionId, questionId)
  } catch (e) {
    throw { error: 'failed to get all coded questions' }
  }

  if (allCodedQuestions.length === 0) {
    codedQuestionObj = { [questionId]: { answers: [], flagsComments: [] } }
  }

  for (let coderUser of allCodedQuestions) {
    try {
      let hasAvatarImage = await api.getUserPicture(coderUser.coder.userId)
      let avatarUrl = hasAvatarImage ? createAvatarUrl(coderUser.coder.userId) : null
      coderUser.coder = { ...coderUser.coder, avatarUrl }
    } catch (e) {
      throw { error: 'failed to get avatar image' }
    }

    if (coderUser.codedQuestions.length > 0) {
      codedQuestionObj = { ...mergeInUserCodedQuestions(codedQuestionObj, coderUser.codedQuestions, coderUser.coder) }
    }
  }

  return { codedQuestionObj }
}

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
  async process({ action, getState, api }, dispatch, done) {
    let scheme = {}, validatedQuestions = [], errors = {}, payload = {}
    const userId = getState().data.user.currentUser.id

    try {
      // Try to get the project coding scheme
      scheme = await api.getScheme(action.projectId)

      // Get user coded questions for currently selected jurisdiction
      if (action.jurisdictionId) {
        if (scheme.schemeQuestions.length === 0) {
          payload = { isSchemeEmpty: true, areJurisdictionsEmpty: false }
        } else {
          try {
            validatedQuestions = await api.getValidatedQuestions(action.projectId, action.jurisdictionId)
          } catch (e) {
            errors = { ...errors, validatedQuestions: 'Failed to get validated questions' }
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

          payload = {
            outline: scheme.outline,
            scheme: { byId: questionsById, tree, order },
            userAnswers,
            question: firstQuestion,
            validatedQuestions,
            isSchemeEmpty: false,
            areJurisdictionsEmpty: false,
            userId,
            mergedUserQuestions: codedQuestionObj
          }
        }
      } else {
        // Check if the scheme is empty, if it is, there's nothing to do so send back empty status
        if (scheme.schemeQuestions.length === 0) {
          payload = { isSchemeEmpty: true, areJurisdictionsEmpty: true }
        }
        payload = { isSchemeEmpty: false, areJurisdictionsEmpty: true }
      }
      dispatch({
        type: types.GET_VALIDATION_OUTLINE_SUCCESS,
        payload: {
          ...payload,
          errors
        }
      })
    } catch (e) {
      dispatch({
        type: types.GET_VALIDATION_OUTLINE_FAIL,
        payload: 'Couldn\'t get outline',
        error: true
      })
    }
    done()
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

    const { updatedState, question, currentIndex, errors } = await getQuestionAndInitialize(
      state, action, userId, api, api.createEmptyValidatedQuestion, questionInfo
    )

    const { codedQuestionObj } = await getCoderInformation({ api, action, questionId: question.id })

    return {
      updatedState: { ...updatedState, mergedUserQuestions: { ...state.mergedUserQuestions, ...codedQuestionObj } },
      question,
      currentIndex,
      errors
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

    return {
      userAnswers,
      question: { ...state.scheme.byId[updatedSchemeQuestion.id], ...updatedSchemeQuestion },
      scheme: updatedScheme,
      otherUpdates,
      mergedUserQuestions: codedQuestionObj
    }
  }
})

/*
  Calls an api route to clear the flag based on the action.flagId, type 1 === red, type 2 === other
 */
export const clearFlagLogic = createLogic({
  type: [types.CLEAR_RED_FLAG, types.CLEAR_FLAG],
  processOptions: {
    dispatchReturn: true,
    successType: types.CLEAR_FLAG_SUCCESS,
    failType: types.CLEAR_FLAG_FAIL
  },
  async process({ action, api }) {
    const out = await api.clearFlag(action.flagId)
    return { ...out, type: action.type === types.CLEAR_RED_FLAG ? 1 : 2 }
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