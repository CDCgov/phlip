import React from 'react'
import PropTypes from 'prop-types'
import Divider from 'material-ui/Divider'
import Typography from 'material-ui/Typography'
import Card from 'components/Card/index'
import Container, { Row, Column } from 'components/Layout'
import IconButton from 'components/IconButton'

export const QuestionCard = ({ question }) => {
  return (
    <Column component={<Card />} displayFlex flex>
      <Row displayFlex style={{ alignItems: 'center', justifyContent: 'flex-end', height: 42, paddingRight: 15 }}>
        <IconButton color="#d7e0e4">
          flag
        </IconButton>
      </Row>
      <Divider />
      <Container column flex>
        <Row flex displayFlex style={{ padding: 20 }}>
          <Typography type="subheading">{question.number})<span style={{ paddingLeft: 5 }}>{question.text}</span></Typography>
        </Row>
        <Row flex>
        </Row>
      </Container>
    </Column>
  )
}

QuestionCard.propTypes = {
  question: PropTypes.object
}

export default QuestionCard

