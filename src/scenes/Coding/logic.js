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

    const questionNumbers = getQuestionNumbers(sortQuestions(getTreeFromFlatData({
      flatData: [
        ...merged, { id: 10000, parentId: 0, positionInParent: merged.length + 1 },
        { id: 10001, parentId: 10000, positionInParent: 0 }, { id: 10002, parentId: 10000, positionInParent: 1 },
        { id: 10003, parentId: 0, positionInParent: merged.length + 2 }
      ]
    })))

    try {
      question = await api.getQuestion(action.projectId, action.jurisdictionId, userId, questionNumbers[0].id)
    } catch (e) {
      error = 'could not get first question'
    }

    return {
      outline: scheme.outline,
      question: { ...question, number: questionNumbers[0].number },
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
    if (action.question.id === 10000) {
      return {
        id: 10000,
        questionType: 2,
        text: 'Which of the following categories apply?',
        categories: [{ id: 1, text: 'Cat 1' }, { id: 2, text: 'Cat 2' }, { id: 3, text: 'Cat 3' }],
        ...action.question
      }
    } else if (action.question.id === 10001) {
      return {
        questionType: 1,
        text: 'Are tags issued after rabies vaccination?',
        hint: '',
        includeComment: false,
        possibleAnswers: [{ id: 1010, text: 'Yes' }, { id: 1011, text: 'No' }],
        id: 10001,
        ...action.question
      }
    } else if (action.question.id === 10002) {
      return {
        questionType: 4,
        text: 'Is rabies vaccination required to obtain a license or registration for the animal?',
        hint: '',
        includeComment: true,
        possibleAnswers: [{ id: 1012, text: 'Yes'}, { id: 1013, text: 'No'}, { id: 1014, text: 'Unclear' }],
        id: 10002,
        ...action.question
      }
    } else if (action.question.id === 10003) {
      return {
        questionType: 4,
        text: 'new non category question',
        hint: '',
        includeComment: true,
        possibleAnswers: [{ id: 1012, text: 'Yes'}, { id: 1013, text: 'No'}, { id: 1014, text: 'Unclear' }],
        id: 10003,
        ...action.question
      }
    } else {
      const question = await api.getQuestion(action.projectId, action.jurisdictionId, userId, action.question.id)
      return { ...question, ...action.question }
    }
  }
})

export default [
  getOutlineLogic,
  getQuestionLogic
]