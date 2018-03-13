import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import navStyles from './nav-styles.scss'
import Icon from 'components/Icon'
import Progress from 'components/Progress'

export const QuestionRow = ({ item, children, treeLength, onQuestionSelected }) => {
  let scaffold = []
  let className = ''

  const questionTextStyles = {
    color: item.isCurrent === true
      ? '#68cff5'
      : item.isAnswered
        ? '#818789'
        : item.completedProgress === 100
          ? '#818789'
          : 'white',
    fontWeight: 300,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: '13px',
    outline: 0
  }

  const rowStyles = {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    height: 40,
    outline: 0
  }

  item.ancestorSiblings.forEach((count, i) => {
    if (count > 0) {
      if (item.parentId === 0 && item.positionInParent === 0) {
        if (item.children && item.children.length > 0) {
          className = navStyles.navParentFirst
        } else {
          className = `${navStyles.navQuestionNoChildren} ${navStyles.navFirstNoChildren}`
        }
      } else if (i === item.ancestorSiblings.length - 1) {
        if (item.children && item.children.length > 0) {
          className = `${navStyles.navParent}`
        } else {
          className = `${navStyles.navChild} ${navStyles.navQuestionNoChildren}`
        }
      } else {
        className = `${navStyles.navChild}`
      }
    } else if (item.parentId === 0 && item.positionInParent === 0) {
      if (item.children && item.children.length > 0) {
        className = ''
      } else {
        className = navStyles.navQuestionNoChildren
      }
    } else if (i === item.ancestorSiblings.length - 1) {
      if (item.children && item.children.length > 0) {
        className = `${navStyles.navParentLast}`
      } else {
        className = `${navStyles.navChildLast} ${navStyles.navQuestionNoChildren}`
      }
    } else {
      className = navStyles.navRow
    }

    scaffold.push(<div key={`${item.id}-scaffold-${i}`} className={className} style={{ left: 23 * i }} />)
  })

  return (
    <Fragment>
      {scaffold}
      <div
        role="row"
        style={{ ...rowStyles, marginLeft: 23 * item.indent, cursor: 'pointer', outline: 0 }}
        onClick={() => onQuestionSelected(item)}
        aria-label="Click to show this question"
        tabIndex={0}
        aria-rowindex={item.treeIndex}>
        <span style={{ minWidth: 20, minHeight: 20, maxHeight: 20, maxWidth: 20, outline: 0 }} tabIndex={-1}>{children}</span>
        <Typography tabIndex={-1} style={questionTextStyles} type="body1" noWrap aria-label="Question number and text">
          {item.number && <span>{`${item.number}. `}</span>}
          {item.text}
        </Typography>
        {item.questionType === 2 && <Icon
          size={12}
          tabIndex={-1}
          aria-label="Question is of type cateogry"
          color={questionTextStyles.color}
          style={{ paddingRight: 5 }}>filter_none</Icon>}
        {item.isAnswered && <Icon aria-label="Question has been answered" role="gridcell" tabIndex={-1} color="#45ad70" size={19}>check</Icon>}
        {item.hasOwnProperty('completedProgress') && <Progress
          aria-label={`This question is ${item.completedProgress} percent answered`}
          progress={item.completedProgress} />}
      </div>
    </Fragment>
  )
}

QuestionRow.propTypes = {
  item: PropTypes.object,
  treeLength: PropTypes.number,
  children: PropTypes.node,
  onQuestionSelected: PropTypes.func
}

export default QuestionRow