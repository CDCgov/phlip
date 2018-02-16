import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import InputBox from 'components/InputBox'
import RadioGroupValidation from 'components/SelectionControls/RadioGroupValidation'
import CheckboxGroupValidation from 'components/SelectionControls/CheckboxGroupValidation'
import Icon from 'components/Icon'
import SimpleInput from 'components/SimpleInput'
import Typography from 'material-ui/Typography'
import Container, { Row, Column } from 'components/Layout'
import * as questionTypes from 'components/CodingValidation/constants'
import TextFieldQuestions from '../TextFieldQuestions'

export const QuestionContent = ({ question, currentUserInitials, onChange, comment, userAnswers, onChangeTextAnswer, mergedUserQuestions }) => {
  const questionAnswerPadding = {
    paddingTop: 0,
    paddingRight: 65,
    paddingBottom: 40,
    paddingLeft: (question.number && (question.number.split('.').length * 3) + 40) || 40
  }

  const answerPadding = {
    ...questionAnswerPadding,
    paddingLeft: 65 - questionAnswerPadding.paddingLeft
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
        {(question.questionType === questionTypes.MULTIPLE_CHOICE ||
          question.questionType === questionTypes.BINARY) &&
        <Row flex displayFlex style={{ ...answerPadding, paddingRight: 0,  overflow: 'auto' }}>
          <RadioGroupValidation
            choices={question.possibleAnswers}
            question={question}
            onChange={onChange}
            userAnswers={userAnswers}
            onChangePincite={onChangeTextAnswer}
            mergedUserQuestions={mergedUserQuestions}
            currentUserInitials={currentUserInitials}
          />
        </Row>}

        {(question.questionType === questionTypes.CATEGORY ||
          question.questionType === questionTypes.CHECKBOXES) &&
        <Row flex displayFlex style={{ ...answerPadding, paddingRight: 0, overflow: 'auto' }}>
          <CheckboxGroupValidation
            choices={question.possibleAnswers}
            onChange={onChange}
            question={question}
            userAnswers={userAnswers}
            pincites={question.questionType !== questionTypes.CATEGORY}
            mergedUserQuestions={mergedUserQuestions}
            currentUserInitials={currentUserInitials}
          />
        </Row>}

        {question.questionType === questionTypes.TEXT_FIELD && mergedUserQuestions === null &&
        <Column displayFlex style={{ ...answerPadding, paddingRight: 0 }}>
          <InputBox
            rows="7" name="text-answer" onChange={onChangeTextAnswer} placeholder="Enter answer"
            value={userAnswers.answers} answerId={question.possibleAnswers[0].id}
          />
        </Column>}

        {question.questionType === questionTypes.TEXT_FIELD && mergedUserQuestions !== null &&
        <TextFieldQuestions
          style={{ ...answerPadding, paddingRight: 0 }}
          mergedUserQuestions={mergedUserQuestions}
          validatorAnswer={userAnswers.answers}
          onChange={onChangeTextAnswer}
          answerId={question.possibleAnswers[0].id}
          currentUserInitials={currentUserInitials}
        />
        }
        <Row style={{ ...answerPadding, paddingRight: 0 }}>
          {question.includeComment &&
          <Row>
            <SimpleInput
              onChange={onChangeTextAnswer(null, 'comment')}
              name="comment"
              placeholder="Enter comment"
              value={comment}
              label="Comment"
            />
          </Row>}
        </Row>
      </Column>

      {question.hint &&
      <Row displayFlex style={{ padding: '0px 35px 50px 35px' }}>
        <Icon color="#98b3be" size="18px">lightbulb_outline</Icon>
        <Typography type="body1" style={{ color: '#98b3be' }}><strong>Hint: </strong>{question.hint}</Typography>
      </Row>
      }
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