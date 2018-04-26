import { createLogic } from 'redux-logic'
import { sortQuestions, getQuestionNumbers } from 'utils/treeHelpers'
import { getTreeFromFlatData } from 'react-sortable-tree'
import {
  getFinalCodedObject,
  initializeUserAnswers,
  getSelectedQuestion,
  checkIfExists,
  initializeNextQuestion,
  initializeValues,
  getSchemeAndInitialize,
  getCodedValidatedQuestions,
  getSchemeQuestionAndUpdate
} from 'utils/codingHelpers'
import { normalize, sortList } from 'utils'
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
  let codedQuestionObj = {}, allCodedQuestions = [], coderErrors = {}

  try {
    allCodedQuestions = await api.getAllCodedQuestionsForQuestion(action.projectId, action.jurisdictionId, questionId)
  } catch (e) {
    coderErrors = { allCodedQuestions: 'Failed to get all the user coded answers for this question.' }
  }

  if (allCodedQuestions.length === 0) {
    codedQuestionObj = { [questionId]: { answers: [], flagsComments: [] } }
  }
  for (let coderUser of allCodedQuestions) {
    if (coderUser.codedQuestions.length > 0) {
      codedQuestionObj = { ...mergeInUserCodedQuestions(codedQuestionObj, coderUser.codedQuestions, coderUser.coder) }
    }
  }

  return { codedQuestionObj, coderErrors }
}

/*
  Some of the reusable functions need to know whether we're on the validation screen or not, so that's what this is for
 */
export const updateValidatorLogic = createLogic({
  type: [types.UPDATE_USER_ANSWER, types.ON_APPLY_ANSWER_TO_ALL],
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
    let errors = {}, payload = action.payload, uniqueUsersWithAvatar = [], codersForProject = []
    const userId = action.userId

    try {
      // Try to get the project coding scheme
      const { firstQuestion, tree, order, questionsById, outline, isSchemeEmpty } = await getSchemeAndInitialize(action.projectId, api)

      // Get user coded questions for currently selected jurisdiction
      if (action.payload.areJurisdictionsEmpty || isSchemeEmpty) {
        payload = { ...payload, isSchemeEmpty }
      } else {
        const { codedValQuestions, codedValErrors } = await getCodedValidatedQuestions(
          action.projectId, action.jurisdictionId, userId, api.getValidatedQuestions
        )

        // Initialize the user answers object
        const userAnswers = initializeUserAnswers(
          [initializeNextQuestion(firstQuestion), ...codedValQuestions], questionsById, userId
        )
        // Get all the coded questions for this question
        const { codedQuestionObj, coderErrors } = await getCoderInformation({
          api,
          action,
          questionId: firstQuestion.id
        })

        try {
          codersForProject = await api.getCodersForProject(action.projectId)
        } catch (e) {
          errors = { ...errors, getCoders: 'failed to load coders for project' }
        }
        const uniqueUserIds = codersForProject.map(coders => coders.userId)

        const uniqueValidatedUsersIds = codedValQuestions
          .map((validatedQuestion) => validatedQuestion.validatedBy.userId)
          .filter((elem, pos, arr) => arr.indexOf(elem) == pos)

        const combinedUsersOnProject = [...uniqueUserIds, ...uniqueValidatedUsersIds]

        const combinedUniqueUsersOnProject = combinedUsersOnProject
          .filter((elem, pos, arr) => arr.indexOf(elem) == pos)

        for (let userId of combinedUniqueUsersOnProject) {
          try {
            const avatar = await api.getUserImage(userId)
            let userWithId = { id: userId, avatar }
            uniqueUsersWithAvatar = [...uniqueUsersWithAvatar, { ...userWithId }]
          } catch (e) {
            errors = { ...errors, valImage: 'failed to get validatedBy avatar image' }
          }
        }

        const userImages = normalize.arrayToObject(uniqueUsersWithAvatar)

        payload = {
          ...payload,
          outline,
          scheme: { byId: questionsById, tree, order },
          userAnswers,
          mergedUserQuestions: codedQuestionObj,
          userImages,
          question: firstQuestion,
          errors: { ...errors, ...codedValErrors, ...coderErrors }
        }
      }

      dispatch({
        type: types.GET_VALIDATION_OUTLINE_SUCCESS,
        payload
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
    const {
      updatedState,
      question,
      currentIndex,
      errors
    } = await getSelectedQuestion(state, action, api, action.userId, action.questionInfo, api.getUserValidatedQuestion)
    const { codedQuestionObj, coderErrors } = await getCoderInformation({ api, action, questionId: question.id })

    return {
      updatedState: { ...updatedState, mergedUserQuestions: { ...state.mergedUserQuestions, ...codedQuestionObj } },
      question,
      currentIndex,
      errors: { ...errors, ...coderErrors }
    }
  }
})

/*
  Logic for when the validator changes jurisdictions on the validation screen
 */
export const getUserValidatedQuestionsLogic = createLogic({
  type: types.GET_USER_VALIDATED_QUESTIONS_REQUEST,
  async process({ action, api, getState }, dispatch, done) {
    const userId = getState().data.user.currentUser.id
    const state = getState().scenes.validation
    const question = action.question, otherUpdates = action.otherUpdates
    let errors = {}, payload = {}, codersForProject = [], uniqueUsersWithAvatar = []

    const { codedValQuestions, codedValErrors } = await getCodedValidatedQuestions(
      action.projectId, action.jurisdictionId, userId, api.getValidatedQuestions
    )

    const { updatedScheme, schemeErrors, updatedSchemeQuestion } = await getSchemeQuestionAndUpdate(action.projectId, state, question, api)

    const userAnswers = initializeUserAnswers(
      [initializeNextQuestion(updatedSchemeQuestion), ...codedValQuestions], updatedScheme.byId, userId
    )

    const { codedQuestionObj, coderErrors } = await getCoderInformation({
      api,
      action,
      questionId: updatedSchemeQuestion.id
    })

    try {
      codersForProject = await api.getCodersForProject(action.projectId)
    } catch (e) {
      errors = { ...errors, getCoder: 'failed to load coders for project' }
    }

    const uniqueUserIds = codersForProject.map((coders) => coders.userId)
    const uniqueValidatedUsersIds = codedValQuestions
      .map((validatedQuestion) => validatedQuestion.validatedBy.userId)
      .filter((elem, pos, arr) => arr.indexOf(elem) == pos)

    const combinedUsersOnProject = [...uniqueUserIds, ...uniqueValidatedUsersIds]
    const combinedUniqueUsersOnProject = combinedUsersOnProject.filter((elem, pos, arr) => arr.indexOf(elem) == pos)

    for (let userId of combinedUniqueUsersOnProject) {
      try {
        const avatar = await api.getUserImage(userId)
        let userWithId = { id: userId, avatar }
        uniqueUsersWithAvatar = [...uniqueUsersWithAvatar, { ...userWithId }]
      } catch (e) {
        errors = { ...errors, valImage: 'failed to get validatedBy avatar image' }
      }
    }
    const userImages = normalize.arrayToObject(uniqueUsersWithAvatar)

    payload = {
      userAnswers,
      question: { ...state.scheme.byId[updatedSchemeQuestion.id], ...updatedSchemeQuestion },
      scheme: updatedScheme,
      otherUpdates,
      mergedUserQuestions: codedQuestionObj,
      errors: { ...errors, ...coderErrors, ...schemeErrors, ...codedValErrors },
      userImages
    }

    dispatch({
      type: types.GET_USER_VALIDATED_QUESTIONS_SUCCESS,
      payload
    })
    done()
  }
})

/*
  Calls an api route to clear the flag based on the action.flagId, type 1 === red, type 2 === other
 */
export const clearFlagLogic = createLogic({
  type: [types.CLEAR_RED_FLAG, types.CLEAR_FLAG],
  async process({ action, api }, dispatch, done) {
    try {
      const out = await api.clearFlag(action.flagId)
      dispatch({
        type: types.CLEAR_FLAG_SUCCESS,
        payload: {
          ...out, flagId: action.flagId, type: action.type === types.CLEAR_RED_FLAG ? 1 : 2
        }
      })
      dispatch({ type: types.UPDATE_EDITED_FIELDS, projectId: action.projectId })
    } catch (error) {
      dispatch({
        type: types.CLEAR_FLAG_FAIL,
        payload: 'We couldn\'t clear this flag.'
      })
    }
    done()
  }
})

export default [
  updateValidatorLogic,
  getUserValidatedQuestionsLogic,
  getQuestionLogicValidation,
  getValidationOutlineLogic,
  clearFlagLogic
]