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
        id: 1045341
      }, {
        questionType: 4,
        text: 'Is rabies vaccination required to obtain a license or registration for the animal?',
        hint: '',
        includeComment: true,
        possibleAnswers: [{ id: 1012, text: 'Yes' }, { id: 1013, text: 'No' }, { id: 1014, text: 'Unclear' }],
        id: 143002
      }, {
        questionType: 4,
        text: 'new non category question',
        hint: '',
        includeComment: true,
        possibleAnswers: [{ id: 1012, text: 'Yes' }, { id: 1013, text: 'No' }, { id: 1014, text: 'Unclear' }],
        id: 104635463
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
  type: [types.UPDATE_USER_ANSWER_REQUEST, types.ON_CHANGE_COMMENT, types.ON_CHANGE_PINCITE],
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