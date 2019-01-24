import React, { Component } from 'react'
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

export class Scheme extends Component {
  static propTypes = {
    questions: PropTypes.array,
    handleQuestionTreeChange: PropTypes.func,
    handleHoverOnQuestion: PropTypes.func,
    handleQuestionNodeMoveRequest: PropTypes.func,
    enableHover: PropTypes.func,
    disableHover: PropTypes.func,
    outline: PropTypes.object,
    flatQuestions: PropTypes.array,
    handleQuestionNodeMove: PropTypes.func,
    projectId: PropTypes.string,
    lockedByCurrentUser: PropTypes.bool,
    hasLock: PropTypes.bool,
    handleDeleteQuestion: PropTypes.func
  }

  render() {
    const {
      questions, flatQuestions, handleQuestionTreeChange, handleQuestionNodeMove,
      projectId, outline, lockedByCurrentUser, hasLock, handleDeleteQuestion
    } = this.props

    return (
      <SortableTree
        theme={{
          nodeContentRenderer: QuestionNode,
          treeNodeRenderer: TreeNode,
          scaffoldBlockPxWidth: 100,
          slideRegionSize: 50,
          rowHeight: 75
        }}
        treeData={questions}
        onChange={handleQuestionTreeChange}
        onMoveNode={handleQuestionNodeMove}
        style={{ flex: '1 0 50%' }}
        reactVirtualizedListProps={{
          overscanRowCount: 10,
          containerRole: 'list'
        }}
        generateNodeProps={() => {
          return {
            projectId: projectId,
            canModify: hasLock && lockedByCurrentUser === true,
            handleDeleteQuestion: handleDeleteQuestion
          }
        }}
        canDrag={hasLock && lockedByCurrentUser === true}
        canDrop={({ node, nextParent, prevParent }) => canDrop(node, nextParent, prevParent, outline, flatQuestions)}
        isVirtualized={true}
      />
    )
  }
}

export default Scheme
