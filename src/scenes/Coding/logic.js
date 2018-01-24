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

    const mock = [
      ...scheme.codingSchemeQuestions,
      {
        id: 134000,
        questionType: 2,
        text: 'Which of the following categories apply?',
        categories: [{ id: 1, text: 'Cat 1' }, { id: 2, text: 'Cat 2' }, { id: 3, text: 'Cat 3' }]
      }, {
        questionType: 1,
        text: 'Are tags issued after rabies vaccination?',
        hint: '',
        includeComment: false,
        possibleAnswers: [{ id: 1010, text: 'Yes' }, { id: 1011, text: 'No' }],
        id: 1045341,
      }, {
        questionType: 4,
        text: 'Is rabies vaccination required to obtain a license or registration for the animal?',
        hint: '',
        includeComment: true,
        possibleAnswers: [{ id: 1012, text: 'Yes' }, { id: 1013, text: 'No' }, { id: 1014, text: 'Unclear' }],
        id: 143002,
      }, {
        questionType: 4,
        text: 'new non category question',
        hint: '',
        includeComment: true,
        possibleAnswers: [{ id: 1012, text: 'Yes' }, { id: 1013, text: 'No' }, { id: 1014, text: 'Unclear' }],
        id: 104635463,
      }
    ]

    const mockOutline = {
      ...scheme.outline,
      134000: { id: 134000, parentId: 0, positionInParent: mock.length + 1 },
      1045341: { id: 1045341, parentId: 134000, positionInParent: 0 },
      143002: { id: 143002, parentId: 134000, positionInParent: 1 },
      104635463: { id: 104635463, parentId: 0, positionInParent: mock.length + 2 }
    }


    const merge = mock.reduce((arr, q) => {
      return [...arr, { ...q, ...mockOutline[q.id] }]
    }, [])

    const { questionsWithNumbers, order } = getQuestionNumbers(sortQuestions(getTreeFromFlatData({ flatData: merge })))

    return {
      outline: scheme.outline,
      scheme: questionsWithNumbers,
      questionOrder: order,
      question: questionsWithNumbers[0]
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
        possibleAnswers: [{ id: 1012, text: 'Yes' }, { id: 1013, text: 'No' }, { id: 1014, text: 'Unclear' }],
        id: 10002,
        ...action.question
      }
    } else if (action.question.id === 10003) {
      return {
        questionType: 4,
        text: 'new non category question',
        hint: '',
        includeComment: true,
        possibleAnswers: [{ id: 1012, text: 'Yes' }, { id: 1013, text: 'No' }, { id: 1014, text: 'Unclear' }],
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
  getOutlineLogic
  // getQuestionLogic
]