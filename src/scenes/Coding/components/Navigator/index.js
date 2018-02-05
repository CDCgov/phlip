import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Drawer from 'material-ui/Drawer'
import Container, { Row, Column } from 'components/Layout'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'
import navStyles from './nav-styles.scss'
import IconButton from 'components/IconButton'

const muiNavStyles = theme => ({
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
  position: 'relative',
  height: 40
}

const questionTextStyles = {
  color: 'white',
  fontWeight: 300,
  paddingLeft: 10
}

const QuestionRow = ({ item, children, treeLength, isParentLast }) => {
  console.log(item.text, isParentLast)
  let scaffold = []
  let className = ''

  for (let i = 0; i < item.indent + 1; i++) {
    if (isParentLast && i === item.indent - 1) {
      className = navStyles.navRow
    } else if (item.children && item.parentId === 0) {
      if (item.positionInParent === 0) className = navStyles.navParentFirst
      else if (item.positionInParent === (treeLength - 1)) className = navStyles.navParentLast
    } else if (item.children) {
      if (i === item.indent) {
        if ((treeLength - 1) === item.positionInParent) className = navStyles.navParentLast
        else className = navStyles.navParent
      } else {
        className = navStyles.navChild
      }
    } else if ((treeLength - 1) === item.positionInParent && i === item.indent) {
      className = `${navStyles.navChildLast} ${navStyles.navQuestionNoChildren}`
    }  else {
      if (i === item.indent) {
        className = `${navStyles.navChild} ${navStyles.navQuestionNoChildren}`
      } else {
        className = navStyles.navChild
      }
    }

    scaffold.push(<div key={`${item.id}-scaffold-${i}`} className={className} style={{ left: 23 * i }} />)
  }

  return (
    <Fragment>
      {scaffold}
      <div style={{ ...rowStyles, marginLeft: 23 * item.indent }}>
        <span style={{ width: 18, height: 18 }}>{children}</span>
        <Typography style={questionTextStyles} type="body1" noWrap>{item.text}</Typography>
      </div>
    </Fragment>
  )
}

let QuestionList
const setRef = ref => {
  QuestionList = ref
}

const questionRenderer = (item, treeIndex, keyPrefix, treeLength, isParentLast) => {
  const onClick = (event) => {
    event.stopPropagation()
    item.expanded = !item.expanded
    QuestionList.recomputeRowHeights()
    QuestionList.forceUpdate()
  }

  const props = { key: keyPrefix, item, treeLength, isParentLast }
  const iconProps = { iconSize: 20, color: 'secondary', onClick: onClick }
  let children = []
  let itemEl = null

  if (item.expanded) {
    itemEl = (
      <QuestionRow {...props}>
        <IconButton {...iconProps}>remove_circle_outline</IconButton>
      </QuestionRow>
    )

    children = item.children.map((child, index) => {
      return questionRenderer(child, index, keyPrefix + '-' + index, item.children.length, treeIndex === treeLength - 1)
    })
  } else if (item.children) {
    itemEl = (
      <QuestionRow {...props}>
        <IconButton {...iconProps}>add_circle_outline</IconButton>
      </QuestionRow>
    )
  } else {
    itemEl = <QuestionRow {...props} />
  }

  return [itemEl, ...children]
}

const rowRenderer = tree => params => {
  return (
    tree.length !== 0
    && tree[params.index] !== undefined
    && (
      <div style={params.style} key={`tree-${params.index}`}>
        {questionRenderer(tree[params.index], params.index, params.index, tree.length, params.index === tree.length -
          1)}
        </div>
    )
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

const rowHeight = tree => params => getExpandedItemCount(tree[params.index]) * 40

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
        <div className={navStyles.navContainer}>
          <div style={{ flex: 1, display: 'flex' }}>
            <AutoSizer>
              {({ height, width }) => (
                <List
                  className={navStyles.navScroll}
                  style={{ height: height, paddingLeft: 10 }}
                  rowCount={questionTree.length}
                  rowHeight={rowHeight(questionTree)}
                  width={width}
                  rowRenderer={rowRenderer(questionTree)}
                  height={height}
                  overscanRowCount={0}
                  ref={setRef}
                  autoHeight
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

export default withStyles(muiNavStyles)(Navigator)