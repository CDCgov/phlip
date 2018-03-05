import React from 'react'
import PropTypes from 'prop-types'
import Divider from 'material-ui/Divider'
import Card from 'components/Card/index'
import { Row, Column } from 'components/Layout'
import IconButton from 'components/IconButton'
import QuestionContent from './components/QuestionContent'
import Tabs from 'components/Tabs'
import { Broom } from 'mdi-material-ui'
import styles from './card-styles.scss'
import * as questionTypes from '../constants'
import FlagPopover from './components/FlagPopover'

const TabContainer = props => {
  return (
    <Tabs tabs={props.tabs} selectedTab={props.selected} onChangeTab={props.onChangeCategory}>
      {props.children}
    </Tabs>
  )
}

export const QuestionCard = props => {
  const {
    question, currentUserInitials, userAnswers, categories, mergedUserQuestions, selectedCategory, isValidation, user,
    onClearAnswer, onOpenAlert, onChangeCategory, onChange, onChangeTextAnswer, onSaveFlag
  } = props

  const questionContentProps = {
    onChange,
    onChangeTextAnswer,
    currentUserInitials,
    user,
    question,
    onOpenAlert,
    userAnswers,
    comment: userAnswers.comment,
    isValidation,
    mergedUserQuestions,
    question
  }

  return (
    <Row displayFlex style={{ flex: '1 0 50%' }}>
      <Column component={<Card />} displayFlex flex style={{ width: '100%' }}>
        <Row displayFlex style={{ alignItems: 'center', justifyContent: 'flex-end', height: 42, paddingRight: 15 }}>
          {question.questionType !== questionTypes.CATEGORY && <IconButton onClick={onClearAnswer}>
            <Broom className={styles.sweep} aria-labelledby="Clear answer" />
          </IconButton>}
          {!isValidation && <FlagPopover userFlag={userAnswers.flag} onSaveFlag={onSaveFlag} questionFlags={question.flags} user={user}/>}
        </Row>
        <Divider />
        {categories !== undefined
          ? <TabContainer tabs={categories} selected={selectedCategory} onChangeCategory={onChangeCategory}>
              <QuestionContent {...questionContentProps} />
            </TabContainer>
          : <QuestionContent{...questionContentProps} />
        }
      </Column>
    </Row>
  )
}

QuestionCard.propTypes = {
  question: PropTypes.object,
  userAnswer: PropTypes.any,
  onChange: PropTypes.func
}

export default QuestionCard

