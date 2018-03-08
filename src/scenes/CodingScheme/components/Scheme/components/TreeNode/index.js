import React, { Children, cloneElement } from 'react'
import PropTypes from 'prop-types'
import styles from './tree-node.scss'

export const TreeNode = props => {
  const {
    children,
    listIndex,
    swapFrom,
    swapLength,
    swapDepth,
    scaffoldBlockPxWidth,
    lowerSiblingCounts,
    connectDropTarget,
    isOver,
    draggedNode,
    canDrop,
    treeIndex,
    getPrevRow,
    node,
    path,
    treeId,
    ...otherProps
  } = props

  const scaffold = []
  const scaffoldBlockCount = lowerSiblingCounts.length
  lowerSiblingCounts.forEach((lowerSiblingCount, i) => {
    let lineClass = ''
    if (lowerSiblingCount > 0) {
      if (listIndex === 0) {
        lineClass = `${styles.lineHalfHorizontalRight} ${styles.lineHalfVerticalBottom}`
      } else if (i === scaffoldBlockCount - 1) {
        lineClass = `${styles.lineHalfHorizontalRight} ${styles.lineFullVertical}`
      } else {
        lineClass = styles.lineFullVertical
      }
    } else if (listIndex === 0) {
      lineClass = styles.lineHalfHorizontalRight
    } else if (i === scaffoldBlockCount - 1) {
      lineClass = `${styles.lineHalfVerticalTop} ${styles.lineHalfHorizontalRight}`
    }

    scaffold.push(
      <div
        key={`pre_${1 + i}`}
        style={{width: scaffoldBlockPxWidth}}
        className={`${styles.lineBlock} ${lineClass}`}>
      </div>
    )

    if (treeIndex !== listIndex && i === swapDepth) {
      let highlightLineClass = ''
      if (listIndex === swapFrom + swapLength - 1) {
        highlightLineClass = styles.highlightBottomLeftCorner
      } else if (treeIndex === swapFrom) {
        highlightLineClass = styles.highlightTopLeftCorner
      } else {
        highlightLineClass = styles.highlightLineVertical
      }

      scaffold.push(
        <div
          key={`highlight_${1 + i}`}
          style={{
            width: scaffoldBlockPxWidth,
            left: scaffoldBlockPxWidth * i
          }}
          className={`${styles.absoluteLineBlock} ${highlightLineClass}`}
        />
      )
    }
  })

  return connectDropTarget(
    <div {...otherProps} role="row" className={styles.node}>
      {scaffold}
      {Children.map(children, child =>
        cloneElement(child, {
          isOver,
          canDrop,
          draggedNode,
          lowerSiblingCounts,
          listIndex,
          swapFrom,
          swapLength,
          swapDepth
        })
      )}
    </div>
  )
}

TreeNode.defaultProps = {
  swapFrom: null,
  swapDepth: null,
  swapLength: null,
  canDrop: false,
  draggedNode: null
}

TreeNode.propTypes = {
  treeIndex: PropTypes.number.isRequired,
  swapFrom: PropTypes.number,
  swapDepth: PropTypes.number,
  swapLength: PropTypes.number,
  scaffoldBlockPxWidth: PropTypes.number.isRequired,
  lowerSiblingCounts: PropTypes.arrayOf(PropTypes.number).isRequired,
  listIndex: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool,
  draggedNode: PropTypes.shape({}),
  getPrevRow: PropTypes.func.isRequired,
  node: PropTypes.shape({}).isRequired,
  path: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired
}

export default TreeNode