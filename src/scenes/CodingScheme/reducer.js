import * as types from './actionTypes'
import { changeNodeAtPath, addNodeUnderParent } from 'react-sortable-tree'

const INITIAL_STATE = {
  questions: []
}

const getNodeKey = ({ treeIndex }) => treeIndex

const codingSchemeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.GET_SCHEME_SUCCESS:
      return {
        ...state,
        questions: action.payload.map(question => ({
          ...question,
          hovering: false
        }))
      }

    case types.HANDLE_QUESTION_TREE_CHANGE:
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