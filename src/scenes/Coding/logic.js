import { createLogic } from 'redux-logic'
import * as types from './actionTypes'
import { sortQuestions, getQuestionNumbers } from 'utils/treeHelpers'
import { getTreeFromFlatData, getFlatDataFromTree, walk } from 'react-sortable-tree'
import * as questionTypes from 'scenes/CodingScheme/scenes/AddEditQuestion/constants'

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
        questionOrder: order,
        tree,
        question: questionsWithNumbers[0],
        codedQuestions,
        isSchemeEmpty: false
      }
    }
  }
})

const deleteAnswerIds = (answer) => {
  let ans = { ...answer }
  if (ans.id) delete ans.id
  return ans
}

export const answerQuestionLogic = createLogic({
  type: [types.UPDATE_USER_ANSWER_REQUEST, types.ON_CHANGE_COMMENT, types.ON_CHANGE_PINCITE, types.ON_CLEAR_ANSWER],
  processOptions: {
    dispatchReturn: true,
    successType: types.UPDATE_USER_ANSWER_SUCCESS,
    failType: types.UPDATE_USER_ANSWER_FAIL
  },
  latest: true,
  async process({ getState, action, api }) {
    const userId = getState().data.user.currentUser.id
    const codingState = getState().scenes.coding
    const updatedQuestionObject = codingState.userAnswers[action.questionId]
    let finalObject = {}

    if (codingState.question.isCategoryQuestion) {
      const selectedCategoryId = codingState.categories[codingState.selectedCategory].id

      finalObject = {
        ...updatedQuestionObject,
        codedAnswers: codingState.question.questionType === questionTypes.TEXT_FIELD
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
      return await api.answerCategoryQuestion(action.projectId, action.jurisdictionId, userId, action.questionId, selectedCategoryId, final)
    } else {
      finalObject = {
        ...updatedQuestionObject,
        codedAnswers: codingState.question.questionType === questionTypes.TEXT_FIELD
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
      return await api.answerQuestion(action.projectId, action.jurisdictionId, userId, action.questionId, final)
    }
  }
})

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

    try {
      codedQuestions = await api.getUserCodedQuestions(userId, action.projectId, action.jurisdictionId)
    } catch (e) {
      throw { error: 'failed to get codedQuestions' }
    }

    return {
      codedQuestions
    }
  }
})

export default [
  getOutlineLogic,
  getUserCodedQuestionsLogic,
  answerQuestionLogic
]