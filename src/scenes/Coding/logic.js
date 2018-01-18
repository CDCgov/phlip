import { createLogic } from 'redux-logic'
import * as types from './actionTypes'
import { sortQuestions, getQuestionOrder, getQuestionNumbers } from 'utils/treeHelpers'
import { getTreeFromFlatData, getFlatDataFromTree, walk } from 'react-sortable-tree'

export const getOutlineLogic = createLogic({
  type: types.GET_CODING_OUTLINE_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_CODING_OUTLINE_SUCCESS,
    failType: types.GET_CODING_OUTLINE_FAIL
  },
  async process({ action, getState, api }) {
    let scheme = {}, question = {}, error = ''
    const userId = getState().data.user.currentUser.id

    try {
      scheme = await api.getScheme(action.projectId)
    } catch (e) {
      throw { error: 'failed to get outline' }
    }

    const merged = Object.keys(scheme.outline).reduce((arr, id) => {
      return [
        ...arr,
        { id, ...scheme.outline[id] }
      ]
    }, [])

    const questionNumbers = getQuestionNumbers(sortQuestions(getTreeFromFlatData({ flatData: merged })))

    try {
      question = await api.getQuestion(action.projectId, action.jurisdictionId, userId, questionNumbers[0].id)
    } catch (e) {
      error = 'could not get first question'
    }

    return {
      outline: scheme.outline,
      question: { ...question, number: questionNumbers[0].questionNumber },
      questionOrder: questionNumbers
    }
  }
})

export const getQuestionLogic = createLogic({
  type: types.GET_QUESTION_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_QUESTION_SUCCESS,
    failType: types.GET_QUESTION_FAIL
  },
  async process({ action, api, getState }) {
    const userId = getState().data.user.currentUser.id
    const question = await api.getQuestion(action.projectId, action.jurisdictionId, userId, action.question.id)
    return { ...question, number: action.question.questionNumber }
  }
})

export default [
  getOutlineLogic,
  getQuestionLogic
]