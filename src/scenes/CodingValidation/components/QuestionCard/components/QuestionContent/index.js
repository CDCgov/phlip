import React from 'react'
import PropTypes from 'prop-types'
import InputBox from 'components/InputBox'
import RadioGroupValidation from 'components/SelectionControls/RadioGroupValidation'
import CheckboxGroupValidation from 'components/SelectionControls/CheckboxGroupValidation'
import Icon from 'components/Icon'
import SimpleInput from 'components/SimpleInput'
//import Typography from '@material-ui/core/Typography'
import Container, { Row, Column } from 'components/Layout'
import * as questionTypes from '../../../../constants'
import TextFieldQuestions from '../TextFieldQuestions'
import Button from 'components/Button'
import ValidationTable from '../ValidationTable'
import { FlexGrid, Typography } from 'components'

export const QuestionContent = props => {
  const {
    question, comment, userAnswers, mergedUserQuestions, isValidation, disableAll,
    onChange, onChangeTextAnswer, onOpenAlert, onOpenFlagConfirmAlert, userImages
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
      <FlexGrid padding="20px 20px 10px 20px">
        <FlexGrid align="baseline" container type="row">
          <Typography variant="subheading2" style={{ paddingRight: 10 }}>{question.number})</Typography>
          <Typography variant="body2" style={{ letterSpacing: 0 }}>{question.text}</Typography>
        </FlexGrid>
      </FlexGrid>
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
            disableAll={disableAll}
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
            question={question}
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
          question={question}
          answerId={question.possibleAnswers[0].id}
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
              aria-label="Comment"
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
      <FlexGrid container type="row" padding="20px 35px 0px 35px" align="center">
        <Icon color="#98b3be" size="14px">lightbulb_outline</Icon>
        <Typography variant="body2" style={{ color: '#98b3be' }}>
          <strong>Coding Directions: </strong>{question.hint}
        </Typography>
      </FlexGrid>
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