import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import InputBox from 'components/InputBox'
import RadioGroupValidation from 'components/SelectionControls/RadioGroupValidation'
import CheckboxGroupValidation from 'components/SelectionControls/CheckboxGroupValidation'
import Icon from 'components/Icon'
import SimpleInput from 'components/SimpleInput'
import Typography from 'material-ui/Typography'
import Container, { Row, Column } from 'components/Layout'

export const QuestionContent = ({ question, currentUserInitials, onChange, comment, userAnswers, onChangeTextAnswer, mergedUserQuestions }) => {
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
        <Row
          flex
          displayFlex
          style={{ overflow: 'auto', paddingLeft: 65 - questionAnswerPadding.paddingLeft, flexBasis: '50%' }}
        >
          {question.questionType === 1 &&
          <RadioGroupValidation
            choices={question.possibleAnswers}
            question={question}
            onChange={onChange}
            userAnswers={userAnswers}
            onChangePincite={onChangeTextAnswer}
            mergedUserQuestions={mergedUserQuestions}
            currentUserInitials={currentUserInitials}
          />}

          {question.questionType === 2 &&
          <CheckboxGroupValidation
            choices={question.possibleAnswers} onChange={onChange} question={question} userAnswers={userAnswers}
            pincites={false} mergedUserQuestions={mergedUserQuestions} currentUserInitials={currentUserInitials}
          />}

          {question.questionType === 3 &&
          <CheckboxGroupValidation
            choices={question.possibleAnswers} onChange={onChange} question={question} userAnswers={userAnswers}
            onChangePincite={onChangeTextAnswer} mergedUserQuestions={mergedUserQuestions} currentUserInitials={currentUserInitials}
          />}

          {question.questionType === 4 &&
          <RadioGroupValidation
            choices={question.possibleAnswers} onChange={onChange} question={question} userAnswers={userAnswers}
            onChangePincite={onChangeTextAnswer} mergedUserQuestions={mergedUserQuestions} currentUserInitials={currentUserInitials}
          />}

          {question.questionType === 5 &&
          <InputBox
            rows="5" name="text-answer" onChange={onChangeTextAnswer} placeholder="Enter answer"
            value={userAnswers.answers}
          />}
        </Row>
        <Row flex style={{ paddingTop: 30, paddingLeft: 65 - questionAnswerPadding.paddingLeft }}>
          {question.includeComment &&
          <Row>
            <SimpleInput
              onChange={onChangeTextAnswer(null, 'comment')} name="comment" placeholder="Enter comment"
              style={{ width: '70%' }} value={comment} label="Comment"
            />
          </Row>}
        </Row>
      </Column>

      {question.hint &&
      <Row displayFlex style={{ padding: '0px 35px 50px 35px' }}>
        <Icon color="#98b3be" size="18px">lightbulb_outline</Icon>
        <Typography type="body1" style={{ color: '#98b3be' }}><strong>Hint: </strong>{question.hint}</Typography>
      </Row>}
    </Container>
  )
}

QuestionContent.defaultProps = {
  mergedUserQuestions: { answers: [] }
}

QuestionContent.propTypes = {
  question: PropTypes.object,
  onChange: PropTypes.func
}

export default QuestionContent