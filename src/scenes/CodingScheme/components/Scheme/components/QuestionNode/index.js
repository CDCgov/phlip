import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './question-node.scss'
import Icon from 'components/Icon'
import IconButton from 'components/IconButton'
import Button from 'components/Button'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import * as questionTypes from 'scenes/CodingScheme/scenes/AddEditQuestion/constants'
import Tooltip from 'components/Tooltip'
import Link from 'components/Link'

const isDescendant = (older, younger) => {
  return (
    !!older.children &&
    typeof older.children !== 'function' &&
    older.children.some(child => child === younger || isDescendant(child, younger))
  )
}

export class QuestionNode extends Component {
  static propTypes = {
    buttons: PropTypes.arrayOf(PropTypes.node),
    canDrag: PropTypes.bool,
    className: PropTypes.string,
    icons: PropTypes.arrayOf(PropTypes.node),
    isSearchFocus: PropTypes.bool,
    isSearchMatch: PropTypes.bool,
    listIndex: PropTypes.number.isRequired,
    lowerSiblingCounts: PropTypes.arrayOf(PropTypes.number).isRequired,
    node: PropTypes.shape({}).isRequired,
    path: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
    scaffoldBlockPxWidth: PropTypes.number.isRequired,
    style: PropTypes.shape({}),
    swapDepth: PropTypes.number,
    swapFrom: PropTypes.number,
    swapLength: PropTypes.number,
    title: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    toggleChildrenVisibility: PropTypes.func,
    treeIndex: PropTypes.number.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    didDrop: PropTypes.bool.isRequired,
    draggedNode: PropTypes.shape({}),
    isDragging: PropTypes.bool.isRequired,
    parentNode: PropTypes.shape({}),
    canDrop: PropTypes.bool,
    isOver: PropTypes.bool.isRequired,
    canModify: PropTypes.bool,
    projectId: PropTypes.string,
    handleDeleteQuestion: PropTypes.func,
    rowDirection: PropTypes.any
  }

  static defaultProps = {
    buttons: [],
    canDrag: false,
    canDrop: false,
    className: '',
    draggedNode: null,
    icons: [],
    isSearchFocus: false,
    isSearchMatch: false,
    parentNode: null,
    style: {},
    swapDepth: null,
    swapFrom: null,
    swapLength: null,
    title: null,
    toggleChildrenVisibility: null
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      isGrabbed: false,
      hovered: false
    }
  }

  handleGrabbed = e => {
    if (e.key === ' ') {
      e.preventDefault()
      this.setState({
        isGrabbed: true
      })
    }
  }

  setHoveredStatus = hovered => {
    if (!this.props.isDragging) {
      this.setState({
        hovered
      })
    }
  }

  render() {
    const {
      scaffoldBlockPxWidth,
      toggleChildrenVisibility,
      connectDragPreview,
      connectDragSource,
      isDragging,
      canDrop,
      canDrag,
      canModify,
      node,
      draggedNode,
      path,
      treeIndex,
      didDrop,
      lowerSiblingCounts,
      listIndex,
      parentNode,
      projectId,
      handleDeleteQuestion
    } = this.props

    const questionBody = node.text
    const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node)
    const isLandingPadActive = !didDrop && isDragging
    const scaffoldBlockCount = lowerSiblingCounts.length

    const handle = connectDragSource(
      <div className={styles.handle} tabIndex={0} role="button">
        <Tooltip text={this.state.hovered ? '' : 'Drag to reorder'} placement="bottom">
          <Icon size="24" color="black">reorder</Icon>
        </Tooltip>
      </div>,
      { dropEffect: 'copy' }
    )

    const actionStyles = {
      height: 40,
      width: 40,
      padding: 0,
      minHeight: 'unset',
      minWidth: 'unset'
    }

    const dragPreview = connectDragPreview(
      <div tabIndex={-1} className={styles.rowWrapper}>
        <div
          tabIndex={-1}
          className={styles.nodeCard}
          style={{
            backgroundColor: isLandingPadActive ? (canDrop ? 'lightblue' : '#e6a8ad') : 'white',
            border: isLandingPadActive ? (canDrop ? '3px dotted navy' : '3px dotted black') : 'none',
            opacity: isDraggedDescendant ? 0.5 : 1,
            padding: '5px 10px',
            width: 830
          }}>
          <div className={styles.rowContents} tabIndex={0} role="listitem">
            {canDrag && handle}
            <CardContent
              className={styles.rowLabel}
              style={{ padding: 5, display: 'flex', flex: 1, alignItems: 'center' }}
              onMouseEnter={() => this.setHoveredStatus(true)}
              onMouseLeave={() => this.setHoveredStatus(false)}>
              <Typography noWrap component="h4" style={{ flex: 1 }}>
                {questionBody}
              </Typography>
              {this.state.hovered && !isDraggedDescendant &&
              <div className={styles.questionButtons}>
                {canModify && ((parentNode === null || parentNode.questionType !== questionTypes.CATEGORY) &&
                  <Tooltip
                    //aria-label="Add child question"
                    text="Add child question"
                    id={`add-child-question-${listIndex}`}
                    placement="left">
                    <Button
                      aria-label="Add child question"
                      component={Link}
                      to={{
                        pathname: `/project/${projectId}/coding-scheme/add`,
                        state: { parentDefined: { ...node }, path, canModify: true }
                      }}
                      color="accent"
                      style={{ ...actionStyles, marginRight: 10 }}
                      value={<Icon color="white">subdirectory_arrow_right</Icon>}
                    />
                  </Tooltip>)}
                <Tooltip
                  text={canModify ? 'Edit Question' : 'View Question'}
                  id={`${canModify ? 'edit' : 'view'}-question-${listIndex}`}
                  //aria-label="View and edit question"
                  placement="right">
                  <Button
                    color="accent"
                    component={Link}
                    to={{
                      pathname: `/project/${projectId}/coding-scheme/edit/${node.id}`,
                      state: { questionDefined: { ...node }, path, canModify }
                    }}
                    aria-label={canModify ? 'Edit Question' : 'View Question'}
                    style={{ ...actionStyles, marginRight: 10 }}
                    value={<Icon color="white">{canModify ? 'mode_edit' : 'visibility'}</Icon>}
                  />
                </Tooltip>
                {canModify &&
                <Tooltip
                  //aria-label="Delete question"
                  text="Delete question"
                  id={`delete-question-${listIndex}`}
                  placement="right">
                  <Button
                    color="accent"
                    aria-label="Delete question"
                    style={{ ...actionStyles, marginRight: 10 }}
                    value={<Icon color="white">delete</Icon>}
                    onClick={() => handleDeleteQuestion(projectId, node.id, path)}
                  />
                </Tooltip>}
              </div>}
              {!this.state.hovered && node.questionType === questionTypes.CATEGORY &&
              <Icon aria-label="This question is a category question" color="#757575">filter_none</Icon>}
            </CardContent>
          </div>
        </div>
      </div>
    )

    return (
      <div
        tabIndex={-1}
        className={styles.nodeContent}
        style={{ left: scaffoldBlockCount * scaffoldBlockPxWidth }}>
        {toggleChildrenVisibility && node.children && node.children.length > 0 &&
        <>
          <IconButton
            type="button"
            aria-label={this.state.hovered ? '' : node.expanded ? 'Collapse' : 'Expand'}
            className={styles.expandCollapseButton}
            color="#707070"
            style={{ backgroundColor: '#f5f5f5' }}
            iconSize={28}
            tooltipText={this.state.hovered ? '' : node.expanded ? 'Collapse' : 'Expand'}
            onClick={() => toggleChildrenVisibility({
              node,
              path,
              treeIndex
            })}>
            {node.expanded ? 'remove_circle' : 'add_circle'}
          </IconButton>
          {node.expanded && !isDragging &&
          <div style={{ width: scaffoldBlockPxWidth }} className={styles.lineChildren} />}
        </>}
        <div className={styles.rowWrapper}>
          {dragPreview}
        </div>
      </div>
    )
  }
}

export default QuestionNode
