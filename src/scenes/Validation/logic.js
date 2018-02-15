import { createLogic } from 'redux-logic'
import * as types from './actionTypes'
import { sortQuestions, getQuestionNumbers } from 'utils/treeHelpers'
import { getTreeFromFlatData, getFlatDataFromTree, walk } from 'react-sortable-tree'
import * as questionTypes from 'scenes/CodingScheme/scenes/AddEditQuestion/constants'


const mergeUserAnswers = (combinedCodedQuestions) => {
  let mergedUserQuestions = []

  for (let item of combinedCodedQuestions) {
    for (let codedQuestion of item.codeQuestionsPerUser) {
      for (let codedAnswer of codedQuestion.codedAnswers) {
        mergedUserQuestions = [...mergedUserQuestions, { ...codedQuestion, codedAnswers: { ...codedAnswer, ...item.coder } }]
      }
    }
  }
  return mergedUserQuestions
}

export const getValidationOutlineLogic = createLogic({
  type: types.GET_VALIDATION_OUTLINE_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_VALIDATION_OUTLINE_SUCCESS,
    failType: types.GET_VALIDATION_OUTLINE_FAIL
  },
  async process({ action, getState, api }) {
    let scheme = {}
    let codedQuestions = []
    let projectCoders = []
    let codeQuestionsPerUser = []
    let combinedCodedQuestions = {}

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
      } catch (e) {
        throw { error: 'failed to get codedQuestions' }
      }
    }

    if (projectCoders.length === 0) {

    } else {

      for (let coder of projectCoders) {
        try {
          codeQuestionsPerUser = await api.getUserCodedQuestions(coder.userId, action.projectId, action.jurisdictionId)
          combinedCodedQuestions = [...combinedCodedQuestions, { codeQuestionsPerUser, coder }]

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

      const { questionsWithNumbers, order } = getQuestionNumbers(sortQuestions(getTreeFromFlatData({ flatData: merge })))

      let mergedUserQuestions = mergeUserAnswers(combinedCodedQuestions)
      let output = []

      mergedUserQuestions.forEach((value) => {
        let existing = []

        if (value.hasOwnProperty('categoryId')) {
          existing = output.filter((v, i) => {
            return v.categoryId === value.categoryId && v.schemeQuestionId === value.schemeQuestionId
          })
        } else {
          existing = output.filter((v, i) => {
            return v.schemeQuestionId == value.schemeQuestionId
          })
        }

        if (existing.length) {
          let existingIndex = output.indexOf(existing[0])
          output[existingIndex].codedAnswers = output[existingIndex].codedAnswers.concat(value.codedAnswers)
        } else {
          if (typeof value.codedAnswers == 'object')
            value.codedAnswers = [value.codedAnswers]
          output.push(value);
        }
      })

      return {
        outline: scheme.outline,
        scheme: questionsWithNumbers,
        questionOrder: order,
        question: questionsWithNumbers[0],
        mergedUserQuestions: output,
        codedQuestions,
        isSchemeEmpty: false
      }
    }
  }
})

export const validateQuestionLogic = createLogic({
  type: [types.UPDATE_USER_VALIDATION_REQUEST, types.ON_CHANGE_VALIDATION_PINCITE, types.ON_CLEAR_VALIDATION_ANSWER],
  processOptions: {
    dispatchReturn: true,
    successType: types.UPDATE_USER_VALIDATION_SUCCESS,
    failType: types.UPDATE_USER_VALIDATION_FAIL
  },
  latest: true,
  async process({ getState, action, api }) {
    // console.log(action)
    const validationState = getState().scenes.validation
    const updatedQuestionObject = validationState.userAnswers[action.questionId]
    let finalObject = {}

    if (validationState.question.isCategoryQuestion) {
      const selectedCategoryId = validationState.categories[validationState.selectedCategory].id
      finalObject = {
        ...updatedQuestionObject,
        codedAnswers: validationState.question.questionType === questionTypes.TEXT_FIELD
          ? [deleteAnswerIds(updatedQuestionObject.answers[selectedCategoryId].answers)]
          : Object.values(updatedQuestionObject.answers[selectedCategoryId].answers).map(answer => {
            let ans = { ...answer }
            if (answer.id) {
              delete ans.id
            }
            return ans
          }),
        comment: updatedQuestionObject.comment[selectedCategoryId]
      }

      const { answers, schemeQuestionId, ...final } = finalObject
      // console.log(final)
      return await api.validateCategoryQuestion(action.projectId, action.jurisdictionId, action.questionId, selectedCategoryId, final)
    } else {
      finalObject = {
        ...updatedQuestionObject,
        codedAnswers: validationState.question.questionType === questionTypes.TEXT_FIELD
          ? [deleteAnswerIds(updatedQuestionObject.answers)]
          : Object.values(updatedQuestionObject.answers).map(answer => {
            let ans = { ...answer }
            if (answer.id) {
              delete ans.id
            }
            return ans
          })
      }
      const { answers, ...final } = finalObject
      // console.log(final)
      return await api.validateQuestion(action.projectId, action.jurisdictionId, action.questionId, final)
    }
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
    let codedQuestions = []
    let projectCoders = []
    let codeQuestionsPerUser = []
    let combinedCodedQuestions = {}

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
          combinedCodedQuestions = [...combinedCodedQuestions, { codeQuestionsPerUser, coder }]

        } catch (e) {
          throw { error: 'failed to get codedQuestions for user' }
        }
      }
    }


    let mergedUserQuestions = mergeUserAnswers(combinedCodedQuestions)
    let output = []

    mergedUserQuestions.forEach((value) => {
      var existing = output.filter((v, i) => {
        return v.schemeQuestionId == value.schemeQuestionId
      })
      if (existing.length) {
        var existingIndex = output.indexOf(existing[0])
        output[existingIndex].codedAnswers = output[existingIndex].codedAnswers.concat(value.codedAnswers)
      } else {
        if (typeof value.codedAnswers == 'object')
          value.codedAnswers = [value.codedAnswers]
        output.push(value);
      }
    })


    return {
      codedQuestions,
      mergedUserQuestions: output
    }
  }
})

export default [
  getUserValidatedQuestionsLogic,
  validateQuestionLogic,
  getValidationOutlineLogic
]