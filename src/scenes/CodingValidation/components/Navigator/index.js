import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'
import navStyles from './nav-styles.scss'
import QuestionRow from './components/QuestionRow'
import { connect } from 'react-redux'
import { IconButton, FlexGrid, Icon } from 'components'
import Resizable from 're-resizable'

/* istanbul ignore next */
const ResizeHandle = () => (
  <Icon style={{ width: 15, minWidth: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    more_vert
  </Icon>
)

/**
 * @component
 * Navigator
 */
export class Navigator extends Component {
  constructor(props, context) {
    super(props, context)
    this.QuestionList = React.createRef()
  }
  
  state = {
    height: '100%',
    width: 300,
    list: {
      height: document.body.clientHeight,
      width: 300
    }
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
    
    return [<QuestionRow key={key} {...props}>{itemEl}</QuestionRow>, ...children]
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
  
  onResizeStop = (e, direction, ref, d) => {
    this.setState({
      width: this.state.width + d.width,
      list: {
        width: this.state.width + d.width,
        height: this.state.list.height
      }
    })
  }
  
  onResize = (e, direction, ref, d) => {
    this.setState({
      list: {
        width: this.state.width + d.width,
        height: this.state.list.height
      }
    })
  }
  
  render() {
    const questionTree = this.props.tree
    const { width, list } = this.state
    
    return (
      <Resizable
        size={{ width, height: '100%' }}
        style={{ position: 'unset', display: 'flex' }}
        onResize={this.onResize}
        onResizeStop={this.onResizeStop}
        enable={{
          top: false,
          right: true,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false
        }}
        handleComponent={{ right: ResizeHandle }}
        handleStyles={{
          right: {
            top: 'unset',
            position: 'unset',
            display: 'flex',
            width: 15,
            justifyContent: 'center',
            height: '100%',
            alignItems: 'center',
            right: 0
          }
        }}
        defaultSize={{ width: 300, height: '100%' }}>
        <div
          className={navStyles.navContainer}
          style={{ backgroundColor: '#3A4041', borderRight: 0, outline: 'none', display: 'flex' }}>
          <List
            className={navStyles.navScroll}
            style={{ height: list.height, paddingLeft: 10, paddingRight: 20, outline: 'none' }}
            rowCount={questionTree.length}
            rowHeight={this.rowHeight(questionTree)}
            rowRenderer={this.rowRenderer}
            width={list.width}
            height={list.height}
            overscanRowCount={0}
            ref={this.QuestionList}
          />
        </div>
      </Resizable>
    )
  }
}

Navigator.propTypes = {
  scheme: PropTypes.object,
  currentQuestion: PropTypes.object,
  handleQuestionSelected: PropTypes.func,
  selectedCategory: PropTypes.number
}

/* istanbul ignore next */
const mapStateToProps = state => {
  return {
    tree: state.scenes.codingValidation.coding.scheme === null ? [] : state.scenes.codingValidation.coding.scheme.tree,
    currentQuestion: state.scenes.codingValidation.coding.question || {}
  }
}

export default connect(mapStateToProps, null)(Navigator)
