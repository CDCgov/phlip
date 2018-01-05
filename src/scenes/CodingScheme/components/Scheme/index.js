import React, { Component } from 'react'
import SortableTree, {
  toggleExpandedForAll,
  changeNodeAtPath,
  getVisibleNodeInfoAtIndex,
  getNodeAtPath
} from 'react-sortable-tree'
import QuestionTheme from './QuestionTheme'

const Scheme = ({ questions, handleQuestionTreeChange }) => {
  return (
    <SortableTree
      theme={QuestionTheme}
      treeData={questions}
      onChange={handleQuestionTreeChange}
      style={{ flex: '1 0 50%', padding: '0 0 0 15px' }}
      isVirtualized={true}
    />
  )
}

export default Scheme
