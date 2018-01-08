import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './question-node.scss'
import Icon from 'components/Icon'
import IconButton from 'components/IconButton'
import Card from 'components/Card'
import { CardContent, CardActions } from 'material-ui/Card'
import Typography from 'material-ui/Typography'

const isDescendant = (older, younger) => {
  return (
    !!older.children &&
    typeof older.children !== 'function' &&
    older.children.some(
      child => child === younger || isDescendant(child, younger)
    )
  )
}

const QuestionNode = props => {
  const {
    scaffoldBlockPxWidth,
    toggleChildrenVisibility,
    connectDragPreview,
    connectDragSource,
    isDragging,
    canDrop,
    canDrag,
    onHover,
    node,
    title,
    draggedNode,
    path,
    treeIndex,
    isSearchMatch,
    isSearchFocus,
    icons,
    buttons,
    className,
    style,
    didDrop,
    lowerSiblingCounts,
    listIndex,
    swapFrom,
    swapLength,
    swapDepth,
    isOver,
    parentNode,
    ...otherProps
  } = props

  const questionBody = node.questionBody
  const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node)
  const isLandingPadActive = !didDrop && isDragging
  const scaffoldBlockCount = lowerSiblingCounts.length

  const handle = connectDragSource(
    <div className={styles.handle}>
      <Icon size="24" color="black">reorder</Icon>
    </div>,
    { dropEffect: 'copy' }
  )

  const dragPreview = connectDragPreview(
    <div>
      <Card
        className={styles.nodeCard}
        style={{
          backgroundColor: isLandingPadActive ? (canDrop ? 'lightblue' : '#e6a8ad') : 'white',
          border: isLandingPadActive ? (canDrop ? '3px dotted navy' : '3px dotted black') : 'none',
          opacity: isDraggedDescendant ? 0.5 : 1,
          padding: '5px 10px'
        }}>
        <div className={styles.rowContents + (!canDrag ? ` ${styles.rowContentsDragDisabled}` : '')}>
          {handle}
          <CardContent
            className={styles.rowLabel}
            style={{ padding: 0, display: 'flex', alignItems: 'center' }}
            onMouseEnter={onHover}
            onMouseLeave={onHover}
          >
            <Typography noWrap type="subheading" component="h4">{questionBody}</Typography>
          </CardContent>
          <CardActions disableActionSpacing style={{ padding: 0 }}>
            <div style={{ flex: '1 1 auto' }}></div>
            {buttons[0]}
          </CardActions>
        </div>
      </Card>
    </div>
  )

  return (
    <div className={styles.nodeContent} style={{ left: scaffoldBlockCount * scaffoldBlockPxWidth }}>
      {toggleChildrenVisibility && node.children && node.children.length > 0 &&
      <div>
        <IconButton
          type="button"
          aria-label={node.expanded ? 'Collapse' : 'Expand'}
          className={styles.expandCollapseButton}
          color="#aabdc6"
          style={{ backgroundColor: '#f5f5f5' }}
          iconSize={28}
          onClick={() => toggleChildrenVisibility({ node, path, treeIndex })}
        >
          {node.expanded ? 'remove_circle' : 'add_circle'}
        </IconButton>
        {node.expanded && !isDragging && (
          <div style={{ width: scaffoldBlockPxWidth }} className={styles.lineChildren} />
        )}
      </div>}
      <div className={styles.rowWrapper + (!canDrag ? ` ${styles.rowWrapperDisabled}` : '')}>
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