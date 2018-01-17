import { sortList } from 'utils'
import { map, walk, getFlatDataFromTree } from 'react-sortable-tree'

export const getNodeKey = ({ node, treeIndex }) => {
  return treeIndex
}

export const sortQuestions = questions => {
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

export const getQuestionOrder = questions => {
  return getFlatDataFromTree({
    treeData: questions,
    getNodeKey,
    ignoreCollapsed: false
  }).map(question => question.node.id)
}