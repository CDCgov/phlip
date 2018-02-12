import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import InputBox from 'components/InputBox'
import RadioGroup from 'components/SelectionControls/RadioGroup'
import CheckboxGroup from 'components/SelectionControls/CheckboxGroup'
import Icon from 'components/Icon'
import SimpleInput from 'components/SimpleInput'
import Typography from 'material-ui/Typography'
import Container, { Row, Column } from 'components/Layout'

export const QuestionContent = ({ question, onChange, comment, userAnswers, onChangeTextAnswer }) => {
  const questionAnswerPadding = {
    paddingTop: 0,
    paddingRight: 65,
    paddingBottom: 40,
    paddingLeft: (question.number && (question.number.split('.').length * 3) + 40) || 40
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
      <Column displayFlex flex style={{ ...questionAnswerPadding }}>
        <Row flex style={{ overflow: 'auto', paddingLeft: 65 - questionAnswerPadding.paddingLeft, flexBasis: '50%' }}>
          {question.questionType === 1 &&
          <RadioGroup choices={question.possibleAnswers} onChange={onChange} userAnswers={userAnswers}
                      onChangePincite={onChangeTextAnswer} />}

          {question.questionType === 2 &&
          <CheckboxGroup choices={question.possibleAnswers} onChange={onChange} userAnswers={userAnswers}
                         pincites={false} />}

          {question.questionType === 3 &&
          <CheckboxGroup choices={question.possibleAnswers} onChange={onChange} userAnswers={userAnswers}
                         onChangePincite={onChangeTextAnswer} />}

          {question.questionType === 4 &&
          <RadioGroup choices={question.possibleAnswers} onChange={onChange} userAnswers={userAnswers}
                      onChangePincite={onChangeTextAnswer} />}

          {question.questionType === 5 &&
          <InputBox rows="5" name="text-answer" onChange={onChangeTextAnswer} placeholder="Enter answer"
                    value={userAnswers.answers} />}
          </Row>

        {question.includeComment &&
        <Row style={{ paddingTop: 30, paddingLeft: 65 - questionAnswerPadding.paddingLeft, flexBasis: '50%' }}>
            <SimpleInput onChange={onChangeTextAnswer(null, 'comment')} name="comment"
                         placeholder="Enter comment" style={{ width: '70%' }}
                         value={comment}
            />
          </Row>
        }
      </Column>

      {question.hint &&
      <Row flex displayFlex style={{ padding: '0 35px 20px 35px' }}>
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