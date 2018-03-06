import { createLogic } from 'redux-logic'
import * as types from './actionTypes'
import { sortQuestions, getQuestionNumbers } from 'utils/treeHelpers'
import { getTreeFromFlatData, getFlatDataFromTree, walk } from 'react-sortable-tree'
import { getFinalCodedObject } from 'utils/codingHelpers'
import { createAvatarUrl } from 'utils/urlHelper'
import { checkIfExists } from 'utils/codingSchemeHelpers'

const addCoderToAnswers = (existingQuestion, question, coder) => {
  let flagComment = {}

  if (question.flag !== null) {
    flagComment = { ...question.flag, raisedBy: { ...coder } }
  }
  if (question.comment !== '') {
    flagComment = { ...flagComment, comment: question.comment, raisedBy: { ...coder }}
  }

  return {
    ...existingQuestion,
    answers: [...existingQuestion.answers, ...question.codedAnswers.map(answer => ({ ...answer, ...coder }))],
    flagsComments: [...existingQuestion.flagsComments, flagComment]
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

export const updateValidatorLogic = createLogic({
  type: [types.UPDATE_USER_VALIDATION_REQUEST, types.ON_APPLY_VALIDATION_TO_ALL],
  transform({ action, getState }, next) {

    next({
      ...action,
      validatedBy: { ...getState().data.user.currentUser },
      isValidation: true
    })
  }
})

export const getValidationOutlineLogic = createLogic({
  type: types.GET_VALIDATION_OUTLINE_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_VALIDATION_OUTLINE_SUCCESS,
    failType: types.GET_VALIDATION_OUTLINE_FAIL
  },
  async process({ action, getState, api }) {
    let scheme = {}, codedQuestions = [], projectCoders = [],
      codeQuestionsPerUser = [], updatedCodedQuestions = [], codedQuestionObj = {}

    const userId = getState().data.user.currentUser.id

    try {
      scheme = await api.getScheme(action.projectId)
    } catch (e) {
      throw { error: 'failed to get outline' }
    }

    try {
      projectCoders = await api.getProjectCoders(action.projectId)
    } catch (e) {
      throw { error: 'failed to get project coders' }
    }

    if (action.jurisdictionId) {
      try {
        codedQuestions = await api.getValidatedQuestions(action.projectId, action.jurisdictionId)
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
      }
    }

    if (projectCoders.length !== 0) {
      for (let coder of projectCoders) {
        try {
          let hasAvatarImage = await api.getUserPicture(coder.userId)
          let avatarUrl = hasAvatarImage ? createAvatarUrl(coder.userId) : null
          coder = { ...coder, avatarUrl }
        } catch (e) {
          throw { error: 'failed to get avatar image' }
        }

        try {
          codeQuestionsPerUser = await api.getUserCodedQuestions(coder.userId, action.projectId, action.jurisdictionId)
          codedQuestionObj = { ...mergeInUserCodedQuestions(codedQuestionObj, codeQuestionsPerUser, coder) }
        } catch (e) {
          throw { error: 'failed to get codedQuestions for user' }
        }
      }
    }

    if (scheme.schemeQuestions.length === 0) {
      return {
        isSchemeEmpty: true
      }
    } else {
      const merge = scheme.schemeQuestions.reduce((arr, q) => {
        return [...arr, { ...q, ...scheme.outline[q.id] }]
      }, [])

      const { questionsWithNumbers, order, tree } = getQuestionNumbers(sortQuestions(getTreeFromFlatData({ flatData: merge })))

      return {
        outline: scheme.outline,
        scheme: questionsWithNumbers,
        tree,
        questionOrder: order,
        question: questionsWithNumbers[0],
        mergedUserQuestions: codedQuestionObj,
        codedQuestions: updatedCodedQuestions,
        isSchemeEmpty: false,
        userId
      }
    }
  }
})

export const validateQuestionLogic = createLogic({
  type: [
    types.UPDATE_USER_VALIDATION_REQUEST, types.ON_CHANGE_VALIDATION_PINCITE, types.ON_CLEAR_VALIDATION_ANSWER,
    types.ON_APPLY_VALIDATION_TO_ALL, types.ON_CHANGE_VALIDATION_COMMENT
  ],
  processOptions: {
    dispatchReturn: true,
    successType: types.UPDATE_USER_VALIDATION_SUCCESS,
    failType: types.UPDATE_USER_VALIDATION_FAIL
  },
  latest: true,
  async process({ getState, action, api }) {
    const validationState = getState().scenes.validation
    const validatorId = getState().data.user.currentUser.id
    const answerObject = getFinalCodedObject(validationState, action, action.type === types.ON_APPLY_VALIDATION_TO_ALL)
    return await api.validateQuestion(action.projectId, action.jurisdictionId, action.questionId, {
      ...answerObject,
      validatedBy: validatorId
    })
  }
})

export const getUserValidatedQuestionsLogic = createLogic({
  type: types.GET_USER_VALIDATED_QUESTIONS_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_USER_VALIDATED_QUESTIONS_SUCCESS,
    failType: types.GET_USER_VALIDATED_QUESTIONS_FAIL
  },
  async process({ action, api, getState }) {
    let codedQuestions = [], projectCoders = [], codeQuestionsPerUser = [], codedQuestionObj = {}

    try {
      codedQuestions = await api.getValidatedQuestions(action.projectId, action.jurisdictionId)
    } catch (e) {
      throw { error: 'failed to get codedQuestions' }
    }

    try {
      projectCoders = await api.getProjectCoders(action.projectId)
    } catch (e) {
      throw { error: 'failed to get project coders' }
    }

    if (projectCoders.length === 0) {

    } else {
      for (let coder of projectCoders) {
        try {
          codeQuestionsPerUser = await api.getUserCodedQuestions(coder.userId, action.projectId, action.jurisdictionId)
          codedQuestionObj = { ...mergeInUserCodedQuestions(codedQuestionObj, codeQuestionsPerUser, coder) }
          console.log(codedQuestionObj)
        } catch (e) {
          throw { error: 'failed to get codedQuestions for user' }
        }
      }
    }

    const output = consolidateAnswers(combinedCodedQuestions)

    return {
      codedQuestions,
      mergedUserQuestions: codedQuestionObj
    }
  }
})

export default [
  updateValidatorLogic,
  // getUserValidatedQuestionsLogic,
  validateQuestionLogic,
  getValidationOutlineLogic
]