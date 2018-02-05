import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Drawer from 'material-ui/Drawer'
import Container, { Row, Column } from 'components/Layout'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'
import styles from './nav-styles.scss'
import IconButton from 'components/IconButton'

const navStyles = theme => ({
  codeNav: {
    position: 'relative',
    width: 320,
    backgroundColor: '#4c5456',
    borderRight: 0
  }
})

const rowStyles = {
  display: 'flex',
  alignItems: 'center',
  color: 'white',
  fontWeight: 300
}

const QuestionRow = ({ item, children }) => {
  return (
    <div style={{ ...rowStyles, marginLeft: 18 * item.indent }}><Typography style={rowStyles} type="body1" noWrap>{children}</Typography></div>
  )
}

const questionRenderer = (item, keyPrefix) => {
  const onClick = (event) => {
    event.stopPropagation()
    item.expanded = !item.expanded
    List.recomputeRowHeights()
    List.forceUpdate()
  }

  const props = { key: keyPrefix }
  let children = []
  let itemEl = null

  if (item.expanded) {
    props.onClick = onClick
    itemEl = <QuestionRow key={keyPrefix} item={item}><IconButton iconSize={18} color="secondary">remove_circle_outline</IconButton>{item.text}</QuestionRow>
    children = item.children.map((child, index) => {
      return questionRenderer(child, keyPrefix + '-' + index)
    })
  } else if (item.children) {
    props.onClick = onClick
    itemEl = <QuestionRow key={keyPrefix} item={item}><IconButton iconSize={18} color="secondary">add_circle_outline</IconButton>{item.text}</QuestionRow>
  } else {
    itemEl = <QuestionRow key={keyPrefix} item={item}>{item.text}</QuestionRow>
  }

  return [itemEl, ...children]
}

const rowRenderer = tree => params => {
  return (
    tree.length !== 0
    && tree[params.index] !== undefined
    && questionRenderer(tree[params.index], params.index)
  )
}

const getExpandedItemCount = item => {
  let count = 1

  if (item.expanded) {
    count += item.children
      .map(getExpandedItemCount)
      .reduce((total, count) => {
        return total + count
      }, 0)
  }

  return count
}

const rowHeight = tree => params => getExpandedItemCount(tree[params.index]) * 30

export const Navigator = ({ open, classes, questionTree, userAnswers, questionsById }) => {
  return (
    <Drawer classes={{ paper: classes.codeNav }} type="persistent" anchor="left" open={open}>
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
        <div className={styles.navContainer}>
          <div style={{ flex: 1, display: 'flex' }}>
            <AutoSizer>
              {({ height, width }) => (
                <List className={styles.navScroll}
                      style={{ height: height }}
                      rowCount={questionTree.length}
                      rowHeight={rowHeight(questionTree)}
                      width={width}
                      rowRenderer={rowRenderer(questionTree)}
                      height={height}
                      overscanRowCount={0}
                />
              )}
            </AutoSizer>
          </div>
        </div>
      </Container>
    </Drawer>
  )
}

Navigator.propTypes = {
  open: PropTypes.bool
}

Navigator.defaultProps = {
  treeQuestions: []
}

export default withStyles(navStyles)(Navigator)