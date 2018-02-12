import { sortList } from 'utils'
import { map, walk, getFlatDataFromTree } from 'react-sortable-tree'
import * as questionTypes from 'scenes/CodingScheme/scenes/AddEditQuestion/constants'

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

const getIndent = numberString => numberString.split('.').length > 1 ? numberString.split('.').length - 1 : 0

const setChildren = (node, number, fullList, numbering, order) => {
  node.indent = getIndent(number)
  node.number = number

  const { children, indent, ...fullListNode } = node

  fullList.push(fullListNode)
  numbering[node.id] = { number }
  order.push(node.id)

  if (node.children) {
    node.expanded = true
    node.children = node.children.map((child, i) => {
      return setChildren(child, `${number}.${i + 1}`, fullList, numbering, order).node
    })
  }

  return { fullList, node, numbering, order }
}

export const getQuestionNumbers = questions => {
  let order = [], numbering = {}, tree = [], fullList = []

  questions.map((question, i) => {
    const out = setChildren(question, `${i + 1}`, fullList, numbering, order)
    fullList = out.fullList
    numbering = out.numbering
    order = out.order
    tree.push({ ...out.node })
  })

  return { questionsWithNumbers: fullList, order, tree }
}