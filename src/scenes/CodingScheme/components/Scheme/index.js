import React, { Component } from 'react'
import SortableTree from 'react-sortable-tree'
import TreeNode from './components/TreeNode'
import QuestionNode from './components/QuestionNode'

const Scheme = ({ questions, handleQuestionTreeChange, handleHoverOnQuestion }) => {
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
      generateNodeProps={({ node, path }) => ({
        onHover: () => handleHoverOnQuestion(node, path),
        nodeActions: []
      })}
      isVirtualized={true}
    />
  )
}

export default Scheme
