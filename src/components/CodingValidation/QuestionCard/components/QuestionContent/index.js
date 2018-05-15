import React, { Fragment, Component } from 'react'
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
import Button from 'components/Button'
import ValidationTable from '../ValidationTable'

export const QuestionContent = props => {
  const {
    question, currentUserInitials, comment, userAnswers, mergedUserQuestions, isValidation, disableAll,
    onChange, onChangeTextAnswer, onOpenAlert, onOpenFlagConfirmAlert, userImages, onBlurText
  } = props

  const questionAnswerPadding = {
    paddingTop: 0,
    paddingRight: 25,
    paddingBottom: 15,
    paddingLeft: (question.number && (question.number.split('.').length * 3) + 40) || 40
  }

  const answerPadding = {
    ...questionAnswerPadding,
    paddingLeft: 65 - questionAnswerPadding.paddingLeft
  }

  return (
    <Container column flex style={{ flexWrap: 'nowrap', paddingBottom: 15, overflow: 'auto' }}>
      <Row displayFlex style={{ padding: '20px 20px 10px 20px' }}>
        <Column>
          <Typography type="subheading">{question.number})</Typography>
        </Column>
        <Column flex style={{ paddingLeft: 10 }}>
          <Typography type="subheading">{question.text}</Typography>
        </Column>
      </Row>
      <Column flex style={{ ...questionAnswerPadding, flexBasis: '60%' }}>
        {(question.questionType === questionTypes.MULTIPLE_CHOICE ||
          question.questionType === questionTypes.BINARY) &&
        <Row flex displayFlex style={{ ...answerPadding, paddingRight: 0, overflow: 'auto' }}>
          <RadioGroupValidation
            choices={question.possibleAnswers}
            question={question}
            onChange={onChange}
            userAnswers={userAnswers}
            onChangePincite={onChangeTextAnswer}
            mergedUserQuestions={mergedUserQuestions}
            currentUserInitials={currentUserInitials}
            onBlurText={onBlurText}
            disableAll={disableAll}
            userImages={userImages}
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
            onChangePincite={onChangeTextAnswer}
            mergedUserQuestions={mergedUserQuestions}
            currentUserInitials={currentUserInitials}
            disableAll={disableAll}
            onBlurText={onBlurText}
            userImages={userImages}
          />
        </Row>}

        {question.questionType === questionTypes.TEXT_FIELD && mergedUserQuestions === null &&
        <Column displayFlex style={{ ...answerPadding, paddingRight: 0 }}>
          <InputBox
            rows="7"
            name="text-answer"
            onChange={onChangeTextAnswer}
            placeholder="Enter answer"
            value={userAnswers.answers[question.possibleAnswers[0].id]}
            answerId={question.possibleAnswers[0].id}
            disabled={disableAll}
          />
        </Column>}

        {question.questionType === questionTypes.TEXT_FIELD && mergedUserQuestions !== null &&
        <TextFieldQuestions
          style={{ ...answerPadding, paddingRight: 0 }}
          mergedUserQuestions={mergedUserQuestions}
          validatorAnswer={userAnswers.answers[question.possibleAnswers[0].id]}
          validator={userAnswers.validatedBy}
          onChange={onChangeTextAnswer}
          userImages={userImages}
          answerId={question.possibleAnswers[0].id}
          onBlurText={onBlurText}
          currentUserInitials={currentUserInitials}
          disabled={disableAll}
        />
        }
        <Row style={{ ...answerPadding, paddingRight: 0, paddingTop: 0, paddingBottom: 0 }}>
          {question.includeComment &&
          <Row>
            <SimpleInput
              onChange={onChangeTextAnswer(null, 'comment')}
              name="comment"
              shrinkLabel={true}
              style={{ whiteSpace: 'pre-wrap' }}
              placeholder="Enter comment"
              value={comment}
              rowsMax={3}
              onBlur={onBlurText}
              label="Comment"
              disabled={disableAll}
            />
          </Row>}
          {question.isCategoryQuestion &&
          <Row displayFlex style={{ justifyContent: 'flex-start', paddingTop: 20 }}>
            <Button
              onClick={onOpenAlert}
              style={{ backgroundColor: 'white', color: 'black' }}
              value="Apply to all tabs"
            />
          </Row>}
        </Row>
      </Column>

      {question.hint &&
      <Row displayFlex style={{ padding: '20px 35px 0px 35px' }}>
        <Icon color="#98b3be" size="18px">lightbulb_outline</Icon>
        <Typography type="body1" style={{ color: '#98b3be' }}><strong>Coding Directions: </strong>{question.hint}
        </Typography>
      </Row>
      }

      {isValidation && <ValidationTable
        onOpenAlert={onOpenFlagConfirmAlert}
        mergedUserQuestions={mergedUserQuestions}
        questionFlags={question.flags}
        userImages={userImages}
      />}
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