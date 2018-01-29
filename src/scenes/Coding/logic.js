import { createLogic } from 'redux-logic'
import * as types from './actionTypes'
import { sortQuestions, getQuestionNumbers } from 'utils/treeHelpers'
import { getTreeFromFlatData, getFlatDataFromTree, walk } from 'react-sortable-tree'

export const getOutlineLogic = createLogic({
  type: types.GET_CODING_OUTLINE_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_CODING_OUTLINE_SUCCESS,
    failType: types.GET_CODING_OUTLINE_FAIL
  },
  async process({ action, getState, api }) {
    let scheme = {}
    const userId = getState().data.user.currentUser.id

    try {
      scheme = await api.getScheme(action.projectId)
    } catch (e) {
      throw { error: 'failed to get outline' }
    }

    const merge = scheme.codingSchemeQuestions.reduce((arr, q) => {
      return [...arr, { ...q, ...scheme.outline[q.id] }]
    }, [])

    const { questionsWithNumbers, order } = getQuestionNumbers(sortQuestions(getTreeFromFlatData({ flatData: merge })))

    // /api/user/${userId}/project/${projectId}/jurisdiction/${jid}

    return {
      outline: scheme.outline,
      scheme: questionsWithNumbers,
      questionOrder: order,
      question: questionsWithNumbers[0],
      codedQuestions: []
    }
  }
})

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

    // /api/user/${userId}/project/${projectId}/jurisdiction/${jid}/question/${codingSchemeQuestionId}

    if (codingState.question.isCategoryChild) {
      const selectedCategoryId = codingState.categories[codingState.selectedCategory].id
      finalObject = {
        ...updatedQuestionObject,
        answers: codingState.question.questionType === 5
          ? [updatedQuestionObject.answers[selectedCategoryId].answers]
          : Object.values(updatedQuestionObject.answers[selectedCategoryId].answers),
        comment: updatedQuestionObject.comment[selectedCategoryId],
        categoryId: selectedCategoryId
      }
    } else {
      finalObject = {
        ...updatedQuestionObject,
        answers: codingState.question.questionType === 5
          ? [updatedQuestionObject.answers]
          : Object.values(updatedQuestionObject.answers)
      }
    }

    return await api.answerQuestion(action.projectId, action.jurisdictionId, userId, action.questionId, finalObject)
  }
})

export default [
  getOutlineLogic,
  answerQuestionLogic
]