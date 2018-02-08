import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import navStyles from './nav-styles.scss'
import Icon from 'components/Icon'
import Progress from 'components/Progress'

export const QuestionRow = ({ item, children, treeLength }) => {
  let scaffold = []
  let className = ''

 // console.log(item)

  const questionTextStyles = {
    color: item.isCurrent === true ? '#68cff5' : item.isAnswered ? '#818789' : 'white',
    fontWeight: 300,
    paddingLeft: 10,
    paddingRight: 10
  }

  const rowStyles = {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    height: 40
  }

  for (let i = 0; i < item.indent + 1; i++) {
    if (item.positionInParent === 0 && item.parentId === 0 && !item.children) {
      className = `${navStyles.navQuestionNoChildren} ${navStyles.navFirstNoChildren}`
    } else if (item.isParentLast && i === item.indent - 1 && !item.isDescendantOfLast) {
      className = navStyles.navRow
    } else if (i !== item.indent && item.isDescendantOfLast) {
      className = navStyles.navRow
    } else if (item.children && item.parentId === 0) {
      if (item.positionInParent === 0) className = navStyles.navParentFirst
      else if (item.positionInParent === (treeLength - 1)) className = navStyles.navParentLast
      else className = navStyles.navParent
    } else if (item.children && item.children.length > 0) {
      if (i === item.indent) {
        if ((treeLength - 1) === item.positionInParent) className = navStyles.navParentLast
        else className = navStyles.navParent
      } else {
        className = navStyles.navChild
      }
    } else if ((treeLength - 1) === item.positionInParent && i === item.indent) {
      className = `${navStyles.navChildLast} ${navStyles.navQuestionNoChildren}`
    } else {
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
        <span style={{ minWidth: 20, minHeight: 20, maxHeight: 20, maxWidth: 20 }}>{children}</span>
        <Typography style={questionTextStyles} type="body1" noWrap>{item.text}</Typography>
        {item.isAnswered && <Icon color="#45ad70" size={19}>check</Icon>}
        {item.hasOwnProperty('completedProgress') && <Progress progress={item.completedProgress} /> }
      </div>
    </Fragment>
  )
}

export default QuestionRow