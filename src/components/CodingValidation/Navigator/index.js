import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Drawer from '@material-ui/core/Drawer'
import Container, { Row } from 'components/Layout'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'
import navStyles from './nav-styles.scss'
import IconButton from 'components/IconButton'
import QuestionRow from './components/QuestionRow'
import { connect } from 'react-redux'

const muiNavStyles = {
  codeNav: {
    position: 'relative',
    width: 330,
    backgroundColor: '#3A4041',
    borderRight: 0
  }
}

/**
 * @component
 * Navigator
 */
export class Navigator extends Component {
  constructor(props, context) {
    super(props, context)
    this.QuestionList = React.createRef()
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps && this.QuestionList.current !== null) {
      this.QuestionList.current.recomputeRowHeights()
      this.QuestionList.current.forceUpdate()
    }
  }

  questionRenderer = ({ item, key, treeIndex, treeLength, ancestorSiblings = [] }) => {
    const onClick = event => {
      event.stopPropagation()
      item.expanded = !item.expanded
      if (this.QuestionList.current !== null) {
        this.QuestionList.current.recomputeRowHeights()
        this.QuestionList.current.forceUpdate()
      }
    }

    let props = {
      key: key,
      item: {
        ...item,
        ancestorSiblings,
        treeIndex
      },
      treeLength,
      onQuestionSelected: this.props.handleQuestionSelected
    }

    const iconProps = { iconSize: 20, color: '#A6B6BB', onClick }
    let children = []
    let itemEl = null

    if ((item.id === this.props.currentQuestion.id && !item.isCategoryQuestion) ||
      (item.schemeQuestionId === this.props.currentQuestion.id && treeIndex === this.props.selectedCategory)) {
      props.item.isCurrent = true
    } else {
      props.item.isCurrent = false
    }

    if (item.children && item.children.length > 0) {
      if (item.expanded) {
        itemEl = <IconButton {...iconProps} aria-label="Click to collapse">remove_circle_outline</IconButton>
      } else {
        itemEl = <IconButton {...iconProps} aria-label="Click to expand">add_circle_outline</IconButton>
      }

      children = item.children.map((child, index) => {
        return this.questionRenderer({
          item: child,
          key: key + '-' + index,
          treeIndex: index,
          treeLength: item.children.length,
          ancestorSiblings: [...ancestorSiblings, item.children.length - index - 1]
        })
      })

      children = item.expanded ? children : []
    }

    return [<QuestionRow {...props}>{itemEl}</QuestionRow>, ...children]
  }

  rowRenderer = params => {
    const tree = this.props.tree

    return (
      tree.length !== 0
      && tree[params.index] !== undefined
      && (
        <div
          style={{ ...params.style, outline: 'none' }}
          key={`tree-${params.index}`}
          role="row"
          aria-rowindex={params.index}>
          {this.questionRenderer({
            item: tree[params.index],
            key: params.index,
            treeIndex: params.index,
            treeLength: tree.length,
            ancestorSiblings: [tree.length - params.index - 1]
          })}
        </div>
      )
    )
  }

  /*
   Rows are considered at the root level. so if a root item has children, to get the full height of the row, you have
   to get the number of all children and multiply it by the row height, 40 px
   */
  getExpandedItemCount = item => {
    let count = 1

    if (item.expanded) {
      count += item.children
        .map(this.getExpandedItemCount)
        .reduce((total, count) => {
          return total + count
        }, 0)
    }

    return count
  }

  rowHeight = tree => params => this.getExpandedItemCount(tree[params.index]) * 40

  render() {
    const questionTree = this.props.tree
    return (
      <Drawer classes={{ paper: this.props.classes.codeNav }} variant="persistent" anchor="left" open={this.props.open}>
        <Container column flex>
          <div className={navStyles.navContainer}>
            <div style={{ flex: 1, display: 'flex' }}>
              <AutoSizer>
                {({ height, width }) => (
                  <List
                    className={navStyles.navScroll}
                    style={{ height: height, paddingLeft: 10, paddingRight: 20 }}
                    rowCount={questionTree.length}
                    rowHeight={this.rowHeight(questionTree)}
                    width={width}
                    rowRenderer={this.rowRenderer}
                    height={height}
                    overscanRowCount={0}
                    ref={this.QuestionList}
                  />
                )}
              </AutoSizer>
            </div>
          </div>
        </Container>
      </Drawer>
    )
  }
}

Navigator.propTypes = {
  scheme: PropTypes.object,
  currentQuestion: PropTypes.object,
  handleQuestionSelected: PropTypes.func,
  classes: PropTypes.object,
  open: PropTypes.bool,
  selectedCategory: PropTypes.number
}

const mapStateToProps = (state, ownProps) => {
  return {
    tree: state.scenes[ownProps.page].coding.scheme === null ? [] : state.scenes[ownProps.page].coding.scheme.tree,
    currentQuestion: state.scenes[ownProps.page].coding.question || {}
  }
}

export default connect(mapStateToProps, null)(withStyles(muiNavStyles)(Navigator))