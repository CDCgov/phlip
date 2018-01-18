import React from 'react'
import PropTypes from 'prop-types'
import Divider from 'material-ui/Divider'
import Typography from 'material-ui/Typography'
import Card from 'components/Card/index'
import Container, { Row, Column } from 'components/Layout'
import IconButton from 'components/IconButton'
import QuestionContent from './components/QuestionContent'

export const QuestionCard = ({ question, onChange }) => {
  return (
    <Column component={<Card />} displayFlex flex>
      <Row displayFlex style={{ alignItems: 'center', justifyContent: 'flex-end', height: 42, paddingRight: 15 }}>
        <IconButton color="#d7e0e4">
          flag
        </IconButton>
      </Row>
      <Divider />
      <Container column flex>
        <Row displayFlex style={{ padding: 20 }}>
          <Column>
            <Typography type="subheading">{question.number})</Typography>
          </Column>
          <Column flex style={{ paddingLeft: 10 }}>
            <Typography type="subheading">{question.text}</Typography>
          </Column>
        </Row>
        <Row flex displayFlex style={{ padding: '0 65px 0 65px' }}>
          <QuestionContent onChange={onChange} question={question} />
        </Row>
      </Container>
    </Column>
  )
}

QuestionCard.propTypes = {
  question: PropTypes.object,
  onChange: PropTypes.func
}

export default QuestionCard

