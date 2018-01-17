import * as types from './actionTypes'
import { changeNodeAtPath, getFlatDataFromTree, getTreeFromFlatData, walk, map } from 'react-sortable-tree'
import { sortList, updater } from 'utils'

const INITIAL_STATE = {
  questions: [],
  outline: {},
  allowHover: true
}

const questionsToOutline = questions => {
  const outline = {}

  // Get the root questions information
  questions.forEach((parentQuestion, i) => {
    outline[parentQuestion.id] = { parentId: 0, positionInParent: i }
  })

  walk({
    treeData: questions,
    getNodeKey,
    callback: ({ node }) => {
      if (node.children) {
        node.children.forEach((child, i) => {
          outline[child.id] = { parentId: node.id, positionInParent: i }
        })
      }
    },
    ignoreCollapsed: false
  })

  return outline
}

const getQuestionsFromOutline = (outline, questions) => {
  return questions.reduce((arr, q) => {
    return [
      ...arr,
      {
        ...q,
        ...outline[q.id],
        hovering: false
      }
    ]
  }, [])
}

const sortQuestions = questions => {
  const sortedChildren = map({
    treeData: questions,
    getNodeKey,
    callback: ({ node }) => {
      if (node.children) {
        node.children = sortList(node.children, 'positionInParent', 'asc')
      }
      return node
    },
    ignoreCollapsed: false
  })
  return sortList(sortedChildren, 'positionInParent', 'asc')
}

const getNodeKey = ({ node, treeIndex }) => {
  return treeIndex
}

const codingSchemeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.GET_SCHEME_SUCCESS:
      return {
        ...state,
        questions: sortQuestions(
          getTreeFromFlatData({
            flatData: getQuestionsFromOutline(action.payload.outline, action.payload.codingSchemeQuestions)
          })
        ),
        outline: action.payload.outline,
        empty: action.payload.codingSchemeQuestions <= 0
      }

    case types.SET_EMPTY_STATE:
      return {
        ...state,
        empty: state.questions.length <= 0
      }

    case types.HANDLE_QUESTION_TREE_CHANGE:
      return {
        ...state,
        questions: action.questions,
        outline: questionsToOutline(action.questions)
      }

    case types.TOGGLE_HOVER:
      if (state.allowHover) {
        try {
          return {
            ...state,
            questions: changeNodeAtPath({
              treeData: state.questions,
              path: action.path,
              getNodeKey,
              newNode: { ...action.node, hovering: action.hover }
            })
          }
        } catch (e) {
          return state
        }
      } else {
        return state
      }

    case types.DISABLE_HOVER:
      return {
        ...state,
        allowHover: false
      }

    case types.ENABLE_HOVER:
      return {
        ...state,
        allowHover: true
      }

    case types.ADD_QUESTION_SUCCESS:
      return {
        ...state,
        questions: [...state.questions, action.payload],
        outline: questionsToOutline([...state.questions, action.payload]),
        empty: false
      }

    case types.UPDATE_QUESTION_SUCCESS:
      return {
        ...state,
        questions: updater.updateByProperty(action.payload, [...state.questions], 'id')
      }

    case types.CLEAR_STATE:
      return INITIAL_STATE

    default:
      return state
  }
}

export default codingSchemeReducer