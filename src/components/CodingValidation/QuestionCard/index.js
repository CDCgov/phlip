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

const TabContainer = props => {
  return (
    <Tabs tabs={props.tabs} selectedTab={props.selected} onChangeTab={props.onChangeCategory}>
      {props.children}
    </Tabs>
  )
}

export const QuestionCard = props => {
  const {
    question, currentUserInitials, userAnswers, categories, mergedUserQuestions, selectedCategory,
    onClearAnswer, onOpenAlert, onChangeCategory, onChange, onChangeTextAnswer
  } = props

  const questionContentProps = {
    onChange,
    onChangeTextAnswer,
    currentUserInitials,
    question,
    onOpenAlert
  }

  return (
    <Row displayFlex style={{ flex: '1 0 50%' }}>
      <Column component={<Card />} displayFlex flex style={{ width: '100%' }}>
        <Row displayFlex style={{ alignItems: 'center', justifyContent: 'flex-end', height: 42, paddingRight: 15 }}>
          {question.questionType !== questionTypes.CATEGORY &&
          <IconButton onClick={onClearAnswer} tooltipText="Clear answer" id="clear-question-answers" aria-label="Clear question answered">
            <Broom className={styles.sweep} aria-labelledby="Clear answer" />
          </IconButton>}
          <IconButton color="#d7e0e4" tooltipText="Flag this question" id="flag-question" aria-label="Flag this question" placement="top">
            flag
          </IconButton>
        </Row>
        <Divider />
        {categories !== undefined
          ? <TabContainer tabs={categories} selected={selectedCategory} onChangeCategory={onChangeCategory}>
            <QuestionContent
              {...questionContentProps} comment={userAnswers.comment[categories[selectedCategory].id]}
              userAnswers={userAnswers.answers[categories[selectedCategory].id]}
              question={question}
              mergedUserQuestions={mergedUserQuestions !== null
                ? mergedUserQuestions.answers[categories[selectedCategory].id]
                : null} />
          </TabContainer>
          : <QuestionContent
            {...questionContentProps} userAnswers={userAnswers}
            comment={userAnswers.comment}
            mergedUserQuestions={mergedUserQuestions} />
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

