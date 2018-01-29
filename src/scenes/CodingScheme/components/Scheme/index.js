import React from 'react'
import PropTypes from 'prop-types'
import SortableTree from 'react-sortable-tree'
import TreeNode from './components/TreeNode'
import QuestionNode from './components/QuestionNode'
import * as questionTypes from '../../scenes/AddEditQuestion/constants'

const canDrop = (node, nextParent, prevParent, outline, questions) => {
  if (node.isCategoryQuestion) {
    if (nextParent === null || nextParent.id !== prevParent.id) return false
    else return true
  } else {
    if (nextParent === null) return true
    if (nextParent.questionType === questionTypes.CATEGORY) return false

    const grandParentId = outline[nextParent.id].parentId
    let canDrop = true
    questions.map(question => {
      if (question.id === grandParentId) {
        canDrop = question.questionType !== questionTypes.CATEGORY
      }
    })
    return canDrop
  }
}

export const Scheme = ({ questions, flatQuestions, handleQuestionTreeChange, handleQuestionNodeMove, handleHoverOnQuestion, enableHover, disableHover, projectId, outline }) => {
  return (
    <SortableTree
      theme={{
        nodeContentRenderer: QuestionNode,
        treeNodeRenderer: TreeNode,
        scaffoldBlockPxWidth: 100,
        slideRegionSize: 50,
        rowHeight: 75,
        reactVirtualizedListProps: {
          overscanRowCount: 10
        }
      }}
      treeData={questions}
      onChange={handleQuestionTreeChange}
      onMoveNode={handleQuestionNodeMove}
      style={{ flex: '1 0 50%', padding: '0 0 0 15px' }}
      generateNodeProps={({ node, path }) => {
        return {
          turnOffHover: () => handleHoverOnQuestion(node, path, false),
          turnOnHover: () => handleHoverOnQuestion(node, path, true),
          enableHover: () => enableHover(),
          disableHover: () => disableHover(),
          projectId: projectId
        }
      }}
      canDrop={({ node, nextParent, prevParent }) => canDrop(node, nextParent, prevParent, outline, flatQuestions)}
      isVirtualized={true}
    />
  )
}

Scheme.propTypes = {
  questions: PropTypes.array,
  handleQuestionTreeChange: PropTypes.func,
  handleHoverOnQuestion: PropTypes.func,
  handleQuestionNodeMoveRequest: PropTypes.func,
  enableHover: PropTypes.func,
  disableHover: PropTypes.func,
  outline: PropTypes.object
}

export default Scheme
