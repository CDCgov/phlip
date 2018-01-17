import { createLogic } from 'redux-logic'
import * as types from './actionTypes'
import { sortQuestions, getQuestionOrder } from 'utils/treeHelpers'
import { getTreeFromFlatData, getFlatDataFromTree, walk } from 'react-sortable-tree'

export const getQuestionLogic = createLogic({
  type: types.GET_CODING_OUTLINE_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_CODING_OUTLINE_SUCCESS,
    failType: types.GET_CODING_OUTLINE_FAIL
  },
  async process ({ action, getState, api }) {
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

    const sorted = sortQuestions(getTreeFromFlatData({ flatData: merged }))
    const questionOrder = getQuestionOrder(sorted)

    try {
      question = await api.getQuestion(action.projectId, action.jurisdictionId, userId, questionOrder[0])
    } catch (e) {
      error = 'could not get first question'
    }

    return {
      outline: scheme.outline,
      question,
      questionOrder
    }
  }
})

export default [
  getQuestionLogic
]