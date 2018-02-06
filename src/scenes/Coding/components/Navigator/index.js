import React, { Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Drawer from 'material-ui/Drawer'
import Container, { Row, Column } from 'components/Layout'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'
import navStyles from './nav-styles.scss'
import IconButton from 'components/IconButton'
import QuestionRow from './components/QuestionRow'

const muiNavStyles = theme => ({
  codeNav: {
    position: 'relative',
    width: 330,
    backgroundColor: '#4c5456',
    borderRight: 0
  }
})

export class Navigator extends Component {
  constructor(props, context) {
    super(props, context)
    this.QuestionList = null
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      this.QuestionList.recomputeRowHeights()
      this.QuestionList.forceUpdate()
    }
  }

  checkIfCategoriesSelected = item => {
    if (this.props.allUserAnswers.hasOwnProperty(item.parentId)) {
      return Object.keys(this.props.allUserAnswers[item.parentId].answers).length > 0
    } else return false
  }

  setRef = ref => {
    this.QuestionList = ref
  }

  questionRenderer = (userAnswers, scheme, rootParentIndex, item, keyPrefix, treeIndex, treeLength, isParentLast, isDescendantOfLast) => {
    const onClick = (event) => {
      event.stopPropagation()
      item.expanded = !item.expanded
      this.QuestionList.recomputeRowHeights()
      this.QuestionList.forceUpdate()
    }

    let props = {
      key: keyPrefix,
      item: {
        ...item,
        isParentLast,
        isDescendantOfLast
      },
      treeLength
    }

    const iconProps = { iconSize: 20, color: '#6b838b', onClick }
    let children = []
    let itemEl = null

    if (item.expanded) {
      itemEl = (
        <QuestionRow {...props}>
        <IconButton {...iconProps}>remove_circle_outline</IconButton>
      </QuestionRow>
      )

      if (item.isCategoryQuestion) {
        itemEl = this.checkIfCategoriesSelected(item)
          ? itemEl
          : <QuestionRow {...props} />
      }

      children = item.children.map((child, index) => {
        return this.questionRenderer(userAnswers, scheme, rootParentIndex, child, keyPrefix + '-' +
          index, index, item.children.length, treeIndex === treeLength - 1, rootParentIndex === scheme.tree.length - 1)
      })
    } else if (item.children) {
      itemEl = (
        <QuestionRow {...props}>
        <IconButton {...iconProps}>add_circle_outline</IconButton>
      </QuestionRow>
      )

      if (item.isCategoryQuestion) {
        itemEl = this.checkIfCategoriesSelected(item)
          ? itemEl
          : <QuestionRow {...props} />
      }
    } else {
      itemEl = <QuestionRow {...props} />
    }

    return [itemEl, ...children]
  }

  rowRenderer = (scheme, userAnswers) => params => {
    const tree = scheme.tree ? scheme.tree : []
    return (
      tree.length !== 0
      && tree[params.index] !== undefined
      && (
        <div style={params.style} key={`tree-${params.index}`}>
        {this.questionRenderer(userAnswers, scheme, params.index, tree[params.index], params.index, params.index, tree.length, false, false)}
        </div>
      )
    )
  }

  getExpandedItemCount = (userAnswers, item) => {
    let count = 1

    if (item.expanded) {
      if (item.isCategoryQuestion) {
        if (userAnswers.hasOwnProperty(item.parentId)) {
          if (Object.keys(userAnswers[item.parentId].answers).length > 0) {
            count += Object.keys(userAnswers[item.parentId].answers).length
          }
        }
      } else {
        count += item.children
          .map(child => this.getExpandedItemCount(userAnswers, child))
          .reduce((total, count) => {
            return total + count
          }, 0)
      }
    }

    return count
  }

  rowHeight = (tree, userAnswers) => params => this.getExpandedItemCount(userAnswers, tree[params.index]) * 40

  render() {
    const questionTree = this.props.scheme.tree ? this.props.scheme.tree : []
    return (
      <Drawer classes={{ paper: this.props.classes.codeNav }} type="persistent" anchor="left" open={this.props.open}>
      <Container column flex>
        <Row displayFlex style={{
          backgroundColor: '#363f41',
          height: 60,
          alignItems: 'center',
          justifyContent: 'center',
          textTransform: 'uppercase'
        }}>
          <Typography type="headline"><span style={{ color: 'white' }}>Code Navigator</span></Typography>
        </Row>
        <div className={navStyles.navContainer}>
          <div style={{ flex: 1, display: 'flex' }}>
            <AutoSizer>
              {({ height, width }) => (
                <List
                  className={navStyles.navScroll}
                  style={{ height: height, paddingLeft: 10, paddingRight: 20 }}
                  rowCount={questionTree.length}
                  rowHeight={this.rowHeight(questionTree, this.props.allUserAnswers)}
                  width={width}
                  rowRenderer={this.rowRenderer(this.props.scheme, this.props.allUserAnswers)}
                  height={height}
                  overscanRowCount={0}
                  ref={this.setRef}
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

export default withStyles(muiNavStyles)(Navigator)