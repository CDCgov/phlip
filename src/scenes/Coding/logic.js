import { createLogic } from 'redux-logic'
import * as types from './actionTypes'
import { sortQuestions, getQuestionNumbers } from 'utils/treeHelpers'
import { getTreeFromFlatData, getFlatDataFromTree, walk } from 'react-sortable-tree'

const mockAnswers = [
  { questionId: 20010, comment: '', answers: [{ value: 'kristin', pincite: '' }]},
  { questionId: 20011, comment: 'this is a comment', answers: [] },
  { questionId: 20013, comment: '', answers: [{ answerId: 20027, pincite: 'because' }]},
  { questionId: 20014, answers: [{ answerId: 20028, pincite: ''}, { answerId: 20029, pincite: '' }]}
]

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

    const mock = [
      ...scheme.codingSchemeQuestions,
      {
        id: 134000,
        questionType: 2,
        text: 'Which of the following categories apply?',
        possibleAnswers: [{ id: 1, text: 'Cat 1' }, { id: 2, text: 'Cat 2' }, { id: 3, text: 'Cat 3' }]
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
      question: questionsWithNumbers[0],
      codedQuestions: mockAnswers
    }
  }
})

export const answerQuestionLogic = createLogic({
  type: types.UPDATE_USER_ANSWER_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.UPDATE_USER_ANSWER_SUCCESS,
    failType: types.UPDATE_USER_ANSWER_FAIL
  },
  latest: true,
  async process({ getState, action, api }) {
    const userId = getState().data.user.currentUser.id
    const updatedQuestion = getState().scenes.coding.userAnswers[action.questionId]

    return await api.answerQuestion(action.projectId,  action.jurisdictionId, userId, action.questionId, updatedQuestion)
  }
})

export default [
  getOutlineLogic,
  answerQuestionLogic
]