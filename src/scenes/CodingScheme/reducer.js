import * as types from './actionTypes'
import {
  changeNodeAtPath,
  getFlatDataFromTree,
  getTreeFromFlatData,
  walk,
  map,
  addNodeUnderParent
} from 'react-sortable-tree'
import { sortList, updater } from 'utils'

const INITIAL_STATE = {
  questions: [],
  outline: {},
  allowHover: true,
  flatQuestions: []
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
        hovering: false,
        expanded: true
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

const setHovering = (node, hovering) => {
  node.hovering = hovering

  if (node.children) {
    node.children = node.children.map((child, i) => {
      return setHovering(child, false)
    })
  }

  return node
}

const codingSchemeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.GET_SCHEME_SUCCESS:
      return {
        ...state,
        questions: sortQuestions(
          getTreeFromFlatData({
            flatData: getQuestionsFromOutline(action.payload.outline, action.payload.schemeQuestions)
          })
        ),
        flatQuestions: action.payload.schemeQuestions,
        outline: action.payload.outline,
        empty: action.payload.schemeQuestions <= 0
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
              newNode: setHovering({ ...action.node }, action.hover)
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
        empty: false,
        flatQuestions: [...state.flatQuestions, action.payload]
      }

    case types.UPDATE_QUESTION_REQUEST:
      return {
        ...state,
        questions: changeNodeAtPath({
          treeData: state.questions,
          path: action.path,
          getNodeKey,
          newNode: { ...action.question, hovering: false }
        })
      }

    case types.ADD_CHILD_QUESTION_SUCCESS:
      const newTree = addNodeUnderParent({
        treeData: state.questions,
        parentKey: action.payload.path[action.payload.path.length - 1],
        expandParent: true,
        getNodeKey,
        newNode: { ...action.payload, hovering: false }
      })

      return {
        ...state,
        questions: newTree.treeData,
        outline: questionsToOutline(newTree.treeData),
        empty: false,
        flatQuestions: [...state.flatQuestions, action.payload]
      }

    case types.UPDATE_QUESTION_SUCCESS:
      return state

    case types.CLEAR_STATE:
      return INITIAL_STATE

    default:
      return state
  }
}

export default codingSchemeReducer