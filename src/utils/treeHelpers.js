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

export const getQuestionNumbers = questions => {
  const qs = []
  let count = 0, numbering = {}, questionNumber = ''

  walk({
    treeData: questions,
    getNodeKey,
    callback: ({ node, parentNode }) => {
      if (parentNode === null) {
        questionNumber = `${count + 1}`
        numbering[node.id] = { questionNumber }
        count += 1
      } else {
        questionNumber = `${numbering[parentNode.id].questionNumber}.${node.positionInParent + 1}`
        numbering[node.id] = { questionNumber }
      }
      qs.push({ id: node.id, questionNumber })
    },
    ignoreCollapsed: false
  })

  return qs
}

export const getQuestionOrder = questions => {
  return getFlatDataFromTree({
    treeData: questions,
    getNodeKey,
    ignoreCollapsed: false
  }).map(question => question.node.id)
}