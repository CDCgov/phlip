import React from 'react'
import PropTypes from 'prop-types'
import SortableTree from 'react-sortable-tree'
import TreeNode from './components/TreeNode'
import QuestionNode from './components/QuestionNode'

const canDrop = (nextParent, outline, questions) => {
  if (nextParent === null) return true

  const grandParentId = outline[nextParent.id].parentId
  let canDrop = true
  questions.map(question => {
    if (question.id === grandParentId) {
      canDrop = question.questionType !== 2
    }
  })
  return canDrop
}

export const Scheme = ({ questions, flatQuestions, handleQuestionTreeChange, handleHoverOnQuestion, enableHover, disableHover, projectId, outline }) => {
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
      canDrop={({ nextParent }) => canDrop(nextParent, outline, flatQuestions)}
      isVirtualized={true}
    />
  )
}

Scheme.propTypes = {
  questions: PropTypes.array,
  handleQuestionTreeChange: PropTypes.func,
  handleHoverOnQuestion: PropTypes.func,
  enableHover: PropTypes.func,
  disableHover: PropTypes.func,
  outline: PropTypes.object
}

export default Scheme
