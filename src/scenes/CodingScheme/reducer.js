import * as types from './actionTypes'
import { changeNodeAtPath, getFlatDataFromTree, getTreeFromFlatData, walk, map } from 'react-sortable-tree'
import { sortList } from 'utils'

const INITIAL_STATE = {
  questions: [],
  outline: {}
}

const getOutlineFromQuestions = (outline, questions) => {
  let newOutline = {}
  const flat = getFlatDataFromTree({
    treeData: questions,
    getNodeKey,
    ignoreCollapsed: false
  })
  console.log(flat)
  flat.forEach(question => {
    newOutline[question.id] = {
      parentId: question.parentNode ? question.parentNode.id : 0,
      positionInParent: question.parentNode ? 0 : 0
    }
  })
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
        outline: action.payload.outline
      }

    case types.HANDLE_QUESTION_TREE_CHANGE:
      console.log(questionsToOutline(action.questions))
      return {
        ...state,
        questions: action.questions
      }

    case types.TOGGLE_HOVER:
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

    case types.ADD_QUESTION_SUCCESS:
      console.log(action.payload)
      return {
        ...state,
        questions: [...state.questions, action.payload]
      }

    default:
      return state
  }
}

export default codingSchemeReducer