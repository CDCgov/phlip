import React, { Component } from 'react'
import SortableTree from 'react-sortable-tree'
import QuestionTheme from './QuestionTheme'

const Scheme = ({ questions, handleQuestionTreeChange, handleHoverOnQuestion }) => {
  return (
    <SortableTree
      theme={QuestionTheme}
      treeData={questions}
      onChange={handleQuestionTreeChange}
      style={{ flex: '1 0 50%', padding: '0 0 0 15px' }}
      generateNodeProps={({ node, path }) => ({
        onHover: () => handleHoverOnQuestion(node, path)
      })}
      isVirtualized={true}
    />
  )
}

export default Scheme
