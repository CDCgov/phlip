import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import InputBox from 'components/InputBox'
import RadioGroup from 'components/SelectionControls/RadioGroup'
import CheckboxGroup from 'components/SelectionControls/CheckboxGroup'
import Icon from 'components/Icon'
import SimpleInput from 'components/SimpleInput'
import Typography from 'material-ui/Typography'
import Container, { Row, Column } from 'components/Layout'

const QuestionContent = ({ question, userAnswer, onChange, userAnswers, onChangeTextAnswer }) => {
  const questionAnswerPadding = {
    paddingTop: 0,
    paddingRight: 65,
    paddingBottom: 40,
    paddingLeft: (question.number && (question.number.split('.').length * 3) + 65) || 65
  }

  return (
    <Container column flex>
      <Row displayFlex style={{ padding: '20px 20px 10px 20px' }}>
        <Column>
          <Typography type="subheading">{question.number})</Typography>
        </Column>
        <Column flex style={{ paddingLeft: 10 }}>
          <Typography type="subheading">{question.text}</Typography>
        </Column>
      </Row>
      <Row displayFlex style={{ ...questionAnswerPadding }}>
        <Column flex>
          {question.questionType === 1 &&
          <RadioGroup choices={question.possibleAnswers} onChange={onChange} userAnswers={userAnswers}
                      onChangePincite={onChangeTextAnswer} />}

          {question.questionType === 2 &&
          <CheckboxGroup choices={question.categories} onChange={onChange} userAnswer={userAnswers}
                         pincites={false} />}

          {question.questionType === 3 &&
          <CheckboxGroup choices={question.possibleAnswers} onChange={onChange} userAnswers={userAnswers}
                         onChangePincite={onChangeTextAnswer} />}

          {question.questionType === 4 &&
          <RadioGroup choices={question.possibleAnswers} onChange={onChange} userAnswers={userAnswers}
                      onChangePincite={onChangeTextAnswer} />}

          {question.questionType === 5 &&
          <InputBox rows="5" name="text-answer" onChange={onChangeTextAnswer} placeholder="Enter answer"
                    value={userAnswers.answers.value} />}

          {question.includeComment &&
          <Row style={{ paddingTop: 30 }}>
            <SimpleInput onChange={onChangeTextAnswer(null, 'comment')} name="comment"
                         placeholder="Enter comment" style={{ width: 600 }} value={userAnswers.comment} />
          </Row>
          }
          </Column>
      </Row>

      {question.hint &&
      <Row flex displayFlex style={{ padding: '0 35px 0 35px' }}>
            <Icon color="#98b3be" size="18px">lightbulb_outline</Icon>
            <Typography type="body1" style={{ color: '#98b3be' }}><strong>Hint: </strong>{question.hint}</Typography>
          </Row>}
        </Container>
  )
}

QuestionContent.propTypes = {
  question: PropTypes.object,
  onChange: PropTypes.func
}

export default QuestionContent