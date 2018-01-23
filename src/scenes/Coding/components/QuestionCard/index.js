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

export const QuestionCard = ({ question, userAnswer, onChange, onChangeTextAnswer }) => {
  return (
    <Row displayFlex style={{ flex: '1 0 50%' }}>
      <Column component={<Card />} displayFlex flex>
        <Row displayFlex style={{ alignItems: 'center', justifyContent: 'flex-end', height: 42, paddingRight: 15 }}>
          <IconButton color="#d7e0e4">
            flag
          </IconButton>
        </Row>
        <Divider />
        <Container column flex>
          <Row displayFlex style={{ padding: '20px 20px 10px 20px' }}>
            <Column>
              <Typography type="subheading">{question.number})</Typography>
            </Column>
            <Column flex style={{ paddingLeft: 10 }}>
              <Typography type="subheading">{question.text}</Typography>
            </Column>
          </Row>
          <Row displayFlex style={{ padding: '0 80px 40px 65px' }}>
            <Column>
              <QuestionContent onChange={onChange} onChangeTextAnswer={onChangeTextAnswer} userAnswer={userAnswer}
                             question={question} />
              {question.includeComment &&
              <Row style={{ paddingTop: 30 }}>
                <SimpleInput onChange={onChangeTextAnswer(null, 'comment')} placeholder="Enter comment" style={{ width: 600 }} />
              </Row>}
            </Column>
          </Row>

          {question.hint &&
          <Row flex displayFlex style={{ padding: '0 35px 0 35px' }}>
            <Icon color="#98b3be" size="18px">lightbulb_outline</Icon>
            <Typography type="body1" style={{ color: '#98b3be' }}><strong>Hint: </strong>{question.hint}</Typography>
          </Row>}
        </Container>
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

