import { createLogic } from 'redux-logic'
import * as types from './actionTypes'
import { sortQuestions, getQuestionNumbers } from 'utils/treeHelpers'
import { getTreeFromFlatData, getFlatDataFromTree, walk } from 'react-sortable-tree'
import * as questionTypes from 'scenes/CodingScheme/scenes/AddEditQuestion/constants'

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
    const userId = getState().data.user.currentUser.id

    try {
      scheme = await api.getScheme(action.projectId)
    } catch (e) {
      throw { error: 'failed to get outline' }
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

      return {
        outline: scheme.outline,
        scheme: questionsWithNumbers,
        questionOrder: order,
        question: questionsWithNumbers[0],
        codedQuestions: [],
        // codedQuestions,
        isSchemeEmpty: false
      }
    }
  }
})

export const validateQuestionLogic = createLogic({
  type: [types.UPDATE_USER_VALIDATION_REQUEST, types.ON_CHANGE_VALIDATION_PINCITE, types.ON_CLEAR_VALIDATION_ANSWER],
  // type: [types.UPDATE_USER_ANSWER_REQUEST, types.ON_CHANGE_COMMENT, types.ON_CHANGE_PINCITE, types.ON_CLEAR_ANSWER],
  processOptions: {
    dispatchReturn: true,
    successType: types.UPDATE_USER_VALIDATION_SUCCESS,
    failType: types.UPDATE_USER_VALIDATION_FAIL
  },
  latest: true,
  async process({ getState, action, api }) {
    console.log(action)
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
        comment: updatedQuestionObject.comment[selectedCategoryId],
        flag: updatedQuestionObject.flag[selectedCategoryId]
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
      console.log(final)
      return await api.validateQuestion(action.projectId, action.jurisdictionId, action.questionId, final)
    }
  }
})



export default [
  validateQuestionLogic,
  getValidationOutlineLogic
]