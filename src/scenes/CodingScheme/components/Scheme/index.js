import React from 'react'
import PropTypes from 'prop-types'
import SortableTree from 'react-sortable-tree'
import TreeNode from './components/TreeNode'
import QuestionNode from './components/QuestionNode'

export const Scheme = ({ questions, handleQuestionTreeChange, handleHoverOnQuestion, enableHover, disableHover, projectId }) => {
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
      isVirtualized={true}
    />
  )
}

Scheme.propTypes = {
  questions: PropTypes.array,
  handleQuestionTreeChange: PropTypes.func,
  handleHoverOnQuestion: PropTypes.func,
  enableHover: PropTypes.func,
  disableHover: PropTypes.func
}

export default Scheme
