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

export default [
  getValidationOutlineLogic
]