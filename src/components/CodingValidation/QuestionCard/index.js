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

const TabContainer = props => {
  return (<Tabs tabs={props.tabs} selectedTab={props.selected} onChangeTab={props.onChangeCategory}>
    {props.children}
  </Tabs>)
}

export const QuestionCard = ({ question, userAnswers, categories, selectedCategory, onClearAnswer, onChangeCategory, onChange, onChangeTextAnswer, mergedUserQuestions }) => {
  return (
    <Row displayFlex style={{ flex: '1 0 50%' }}>
      <Column component={<Card />} displayFlex flex style={{ width: '100%' }}>
        <Row displayFlex style={{ alignItems: 'center', justifyContent: 'flex-end', height: 42, paddingRight: 15 }}>
          {question.questionType !== 2 && <IconButton onClick={onClearAnswer}>
            <Broom className={styles.sweep} aria-labelledby="Clear answer" />
          </IconButton>}
          <IconButton color="#d7e0e4">
            flag
          </IconButton>
        </Row>
        <Divider />
        {categories !== undefined
          ? <TabContainer tabs={categories} selected={selectedCategory} onChangeCategory={onChangeCategory}>
            <QuestionContent onChange={onChange} onChangeTextAnswer={onChangeTextAnswer}
              comment={userAnswers.comment[categories[selectedCategory].id]}
              userAnswers={userAnswers.answers[categories[selectedCategory].id]} question={question} mergedUserQuestions={mergedUserQuestions} />
          </TabContainer>
          : <QuestionContent onChange={onChange} userAnswers={userAnswers} onChangeTextAnswer={onChangeTextAnswer}
            question={question} comment={userAnswers.comment} mergedUserQuestions={mergedUserQuestions} />
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

