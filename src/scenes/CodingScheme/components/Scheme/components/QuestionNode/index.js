import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './question-node.scss'
import Icon from 'components/Icon'
import IconButton from 'components/IconButton'
import Button from 'components/Button'
import Card from 'components/Card'
import { CardContent, CardActions } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import * as questionTypes from '../../../../scenes/AddEditQuestion/constants'
import Tooltip from 'components/Tooltip'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

const isDescendant = (older, younger) => {
  return (
    !!older.children &&
    typeof older.children !== 'function' &&
    older.children.some(
      child => child === younger || isDescendant(child, younger)
    )
  )
}

//export class QuestionNode extends Component {}

export const QuestionNode = props => {
  const {
    scaffoldBlockPxWidth,
    toggleChildrenVisibility,
    connectDragPreview,
    connectDragSource,
    isDragging,
    canDrop,
    canDrag,
    canModify,
    turnOnHover,
    turnOffHover,
    node,
    draggedNode,
    path,
    treeIndex,
    didDrop,
    lowerSiblingCounts,
    isSearchMatch,
    isSearchFocus,
    listIndex,
    swapFrom,
    swapLength,
    swapDepth,
    isOver,
    parentNode,
    enableHover,
    disableHover,
    projectId,
    handleDeleteQuestion,
    ...otherProps
  } = props

  const questionBody = node.text
  const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node)
  const isLandingPadActive = !didDrop && isDragging
  const scaffoldBlockCount = lowerSiblingCounts.length

  const handle = connectDragSource(
    <div className={styles.handle} tabIndex={0} role="button" draggable={canDrag} aria-grabbed={false}>
      <Tooltip text="Drag to reorder" placement="bottom">
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
    <div tabIndex={-1} onDragStart={disableHover} onDragEnd={enableHover} className={styles.rowWrapper}>
      <Card
        tabIndex={-1}
        className={styles.nodeCard}
        style={{
          backgroundColor: isLandingPadActive ? (canDrop ? 'lightblue' : '#e6a8ad') : 'white',
          border: isLandingPadActive ? (canDrop ? '3px dotted navy' : '3px dotted black') : 'none',
          opacity: isDraggedDescendant ? 0.5 : 1,
          padding: '5px 10px',
          width: 830
        }}>
        <div className={styles.rowContents} tabIndex={0} role="listitem" draggable={canDrag}>
          {canDrag && handle}
          <CardContent
            className={styles.rowLabel}
            style={{ padding: 5, display: 'flex', flex: 1, alignItems: 'center' }}
            onMouseEnter={!isDragging ? turnOnHover : null}
            onMouseLeave={!isDragging ? turnOffHover : null}>
            <Typography noWrap type="subheading" component="h4" style={{ flex: 1 }}>
              {questionBody}
            </Typography>
            {node.hovering &&
            <div style={{ zIndex: 5 }} tabIndex={0}>
              {canModify && ((parentNode === null || parentNode.questionType !== questionTypes.CATEGORY) &&
                <Tooltip
                  text="Add child question"
                  id={`add-child-question-${listIndex}`}
                  aria-label="Add child question"
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
                    value={<Icon color="white">subdirectory_arrow_right</Icon>} />
                </Tooltip>)}
              <Tooltip
                text="Edit question"
                id={`edit-question-${listIndex}`}
                aria-label="View and edit question"
                placement="right">
                <Button
                  color="accent"
                  component={Link}
                  to={{
                    pathname: `/project/${projectId}/coding-scheme/edit/${node.id}`,
                    state: { questionDefined: { ...node }, path, canModify }
                  }}
                  aria-label="Edit question"
                  style={{ ...actionStyles, marginRight: 10 }}
                  value={<Icon color="white">mode_edit</Icon>} />
              </Tooltip>
              {canModify && ((parentNode === null || parentNode.questionType !== questionTypes.CATEGORY) && <Tooltip
                text="Delete question"
                id={`delete-question-${listIndex}`}
                aria-label="Delete question"
                placement="right">
                <Button
                  color="accent"
                  aria-label="Delete question"
                  style={{ ...actionStyles, marginRight: 10 }}
                  value={<Icon color="white">delete</Icon>}
                  onClick={() => handleDeleteQuestion(projectId, node.id, path)} />
              </Tooltip>)}
            </div>}
            {!node.hovering && node.questionType === questionTypes.CATEGORY
              ? <Icon aria-label="This question is a category question" color="#757575">filter_none</Icon>
              : ''
            }
          </CardContent>
          <CardActions disableActionSpacing style={{ padding: 0 }}>
            <div style={{ flex: '1 1 auto' }}></div>
          </CardActions>
        </div>
      </Card>
    </div>
  )

  return (
    <div
      tabIndex={-1}
      className={styles.nodeContent}
      style={{ left: scaffoldBlockCount * scaffoldBlockPxWidth }}>
      {toggleChildrenVisibility && node.children && node.children.length > 0 &&
      <div>
        <IconButton
          type="button"
          aria-label={node.expanded ? 'Collapse' : 'Expand'}
          className={styles.expandCollapseButton}
          color="#707070"
          style={{ backgroundColor: '#f5f5f5' }}
          iconSize={28}
          tooltipText={node.expanded ? 'Collapse' : 'Expand'}
          onClick={() => toggleChildrenVisibility({
            node,
            path,
            treeIndex
          })}>
          {node.expanded ? 'remove_circle' : 'add_circle'}
        </IconButton> {node.expanded && !isDragging && (
        <div style={{ width: scaffoldBlockPxWidth }} className={styles.lineChildren} />
      )}
      </div>}
      <div className={styles.rowWrapper}>
        {dragPreview}
      </div>
    </div>
  )
}

QuestionNode.defaultProps = {
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

QuestionNode.propTypes = {
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
  isOver: PropTypes.bool.isRequired
}

export default QuestionNode