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

const getIndent = numberString => numberString.split('.').length > 1 ? numberString.split('.').length - 1 : 0

const setChildren = (node, number) => {
  if (!node.children) return { ...node, indent: getIndent(number) }

  if (node.children) {
    node.expanded = true
    node.children = node.children.map((child, i) => {
      return { ...setChildren(child, `${number}.${i + 1}`), indent: getIndent(`${number}.${i + 1}`), number: `${number}.${i + 1}` }
    })
  }

  return { ...node, indent: getIndent(number) }
}

export const getQuestionNumbers = questions => {
  let qs = [], order = []
  let count = 0, numbering = {}, number = '', tree = []

  walk({
    treeData: questions,
    getNodeKey,
    callback: ({ node, parentNode }) => {
      if (parentNode === null) {
        number = `${count + 1}`
        numbering[node.id] = { number }
        count += 1
        tree.push(setChildren(node, `${count}`))
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

  return { questionsWithNumbers: qs, order, tree }
}