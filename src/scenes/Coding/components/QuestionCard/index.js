import React from 'react'
import PropTypes from 'prop-types'
import Divider from 'material-ui/Divider'
import Typography from 'material-ui/Typography'
import Card from 'components/Card/index'
import Container, { Row, Column } from 'components/Layout'
import IconButton from 'components/IconButton'
import QuestionContent from './components/QuestionContent'
import Icon from 'components/Icon'
import SimpleInput from 'components/SimpleInput'
import Tabs from 'components/Tabs'

const TabContainer = props => {
  return (<Tabs tabs={props.tabs} selectedTab={props.selected} onChangeTab={props.onChangeCategory}>
    {props.children}
  </Tabs>)
}

export const QuestionCard = ({ question, userAnswer, categories, selectedCategory, onChangeCategory, onChange, onChangeTextAnswer }) => {
  return (
    <Row displayFlex style={{ flex: '1 0 50%' }}>
      <Column component={<Card />} displayFlex flex>
        <Row displayFlex style={{ alignItems: 'center', justifyContent: 'flex-end', height: 42, paddingRight: 15 }}>
          <IconButton color="#d7e0e4">
            flag
          </IconButton>
        </Row>
        <Divider />
        {question.isCategoryChild
          ? <TabContainer tabs={categories} selected={selectedCategory} onChangeCategory={onChangeCategory}><QuestionContent onChange={onChange} onChangeTextAnswer={onChangeTextAnswer}
                                           userAnswer={userAnswer} question={question} /> </TabContainer>
          : <QuestionContent onChange={onChange} onChangeTextAnswer={onChangeTextAnswer} question={question} userAnswer={userAnswer} />
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

