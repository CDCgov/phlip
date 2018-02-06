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
  const qs = [], order = []
  let count = 0, numbering = {}, number = ''

  walk({
    treeData: questions,
    getNodeKey,
    callback: ({ node, parentNode }) => {
      if (parentNode === null) {
        number = `${count + 1}`
        numbering[node.id] = { number }
        count += 1
      } else {
        number = `${numbering[parentNode.id].number}.${node.positionInParent + 1}`
        numbering[node.id] = { number }
      }
      let newNode = { ...node }
      delete newNode.children
      qs.push({ ...newNode, number })
      order.push(node.id)
    },
    ignoreCollapsed: false
  })

  return { questionsWithNumbers: qs, order }
}

export const getQuestionOrder = questions => {
  return getFlatDataFromTree({
    treeData: questions,
    getNodeKey,
    ignoreCollapsed: false
  }).map(question => question.node.id)
}