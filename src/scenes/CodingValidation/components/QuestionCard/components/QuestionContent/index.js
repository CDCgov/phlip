import React from 'react'
import PropTypes from 'prop-types'
import SelectionControlQuestion from './components/SelectionControlQuestion'
import Icon from 'components/Icon'
import SimpleInput from 'components/SimpleInput'
import * as questionTypes from '../../../../constants'
import TextFieldQuestions from './components/TextFieldQuestions'
import Button from 'components/Button'
import ValidationTable from '../ValidationTable'
import { FlexGrid, Typography } from 'components'
import Tooltip from 'components/Tooltip'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'

export const QuestionContent = props => {
  const {
    question, comment, userAnswers, mergedUserQuestions, isValidation, disableAll,
    onChange, onChangeTextAnswer, onOpenAlert, onOpenFlagConfirmAlert, userImages,
    onToggleAnswerForAnno, enabledAnswerChoice, areDocsEmpty
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

  const commonQuestionProps = {
    userImages,
    question,
    userAnswers,
    disabled: disableAll,
    areDocsEmpty,
    choices: question.possibleAnswers,
    mergedUserQuestions,
    onToggleAnswerForAnno,
    enabledAnswerChoice
  }

  const selectionFormProps = {
    choices: question.possibleAnswers,
    onChange,
    onChangePincite: onChangeTextAnswer,
    ...commonQuestionProps
  }

  const textQuestionProps = {
    ...commonQuestionProps,
    onChange: onChangeTextAnswer,
    answerId: question.possibleAnswers[0].id
  }

  const theme = createMuiTheme({
    overrides: {
      MuiTooltip: {
        tooltip: {
          fontSize: '2em',
          color: '#98b3be',
          backgroundColor: '#f5f5f5',
          width: 250,
          maxWidth: 250
        }
      }
    }
  })

  return (
    <FlexGrid container flex style={{ flexWrap: 'nowrap', paddingBottom: 15, overflow: 'auto' }}>
      <FlexGrid padding="20px 20px 10px 20px">
        <FlexGrid align="baseline" container type="row">
          <Typography variant="subheading2" style={{ paddingRight: 10 }}>{question.number})</Typography>
          <Typography variant="body2" style={{ letterSpacing: 0 }}>{question.text}&nbsp;</Typography>
          {question.hint && <MuiThemeProvider theme={theme}>
            <Tooltip
              placement="right"
              title={
                <Typography variant="body2" style={{ color: 'black' }}>
                  <strong>Coding Directions:</strong>
                  {question.hint}
                </Typography>
              }>
              <FlexGrid
                container
                type="row"
                justify="center"
                style={{
                  borderRadius: '50%',
                  width: 25,
                  height: 25,
                  background: '#DEDEDE',
                  textAlign: 'center',
                  alignItems: 'center'
                }}>
                <Icon color="#00575D" size="14px">lightbulb_outline</Icon>
              </FlexGrid>
            </Tooltip>
          </MuiThemeProvider>}
        </FlexGrid>
      </FlexGrid>
      <FlexGrid container flex style={{ ...questionAnswerPadding, overflow: 'auto', minHeight: 'unset' }}>
        {question.questionType !== questionTypes.TEXT_FIELD &&
        <FlexGrid container type="row" style={{ ...answerPadding, paddingRight: 0 }}>
          <SelectionControlQuestion {...selectionFormProps} />
        </FlexGrid>}

        {question.questionType === questionTypes.TEXT_FIELD &&
        <FlexGrid container flex style={{ ...answerPadding, paddingRight: 0, minHeight: 'unset' }}>
          <TextFieldQuestions {...textQuestionProps} />
        </FlexGrid>}

        <FlexGrid padding={`0 0 0 ${answerPadding.paddingLeft}`} style={{ minHeight: 'unset' }}>
          {question.includeComment &&
          <FlexGrid>
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
          </FlexGrid>}
          {question.isCategoryQuestion &&
          <FlexGrid container type="row" flex justify="flex-start" padding="20px 0 0">
            <Button
              onClick={onOpenAlert}
              style={{ backgroundColor: 'white', color: 'black' }}
              value="Apply to all tabs"
            />
          </FlexGrid>}
        </FlexGrid>

        {isValidation && <ValidationTable
          onOpenAlert={onOpenFlagConfirmAlert}
          mergedUserQuestions={mergedUserQuestions}
          questionFlags={question.flags}
          userImages={userImages}
        />}
      </FlexGrid>
    </FlexGrid>
  )
}

QuestionContent.defaultProps = {
  mergedUserQuestions: { answers: [] }
}

QuestionContent.propTypes = {
  question: PropTypes.object,
  onChange: PropTypes.func,
  comment: PropTypes.string,
  userAnswers: PropTypes.object,
  mergedUserQuestions: PropTypes.object,
  isValidation: PropTypes.bool,
  disableAll: PropTypes.bool,
  onChangeTextAnswer: PropTypes.func,
  onOpenAlert: PropTypes.func,
  onOpenFlagConfirmAlert: PropTypes.func,
  userImages: PropTypes.object,
  onToggleAnswerForAnno: PropTypes.func,
  enabledAnswerChoice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  areDocsEmpty: PropTypes.bool
}

/* {question.questionType === questionTypes.TEXT_FIELD && mergedUserQuestions === null &&
 <FlexGrid container style={{ ...answerPadding, paddingRight: 0 }}>
 <InputBox
 rows="7"
 name="text-answer"
 onChange={onChangeTextAnswer}
 placeholder="Enter answer"
 question={question}
 value={userAnswers.answers[question.possibleAnswers[0].id]}
 answerId={question.possibleAnswers[0].id}
 disabled={disableAll}
 onToggleAnswerForAnno={onToggleAnswerForAnno}
 enabledAnswerChoice={enabledAnswerChoice}
 areDocsEmpty={areDocsEmpty}
 />
 </FlexGrid>}

 {question.questionType === questionTypes.TEXT_FIELD &&
 <TextFieldQuestions
 style={{ ...answerPadding, paddingRight: 0 }}
 mergedUserQuestions={mergedUserQuestions}
 validatorAnswer={userAnswers.answers[question.possibleAnswers[0].id]}
 validator={userAnswers.validatedBy}
 onChange={onChangeTextAnswer}
 //onChangePincite={}
 userImages={userImages}
 question={question}
 answerId={question.possibleAnswers[0].id}
 disabled={disableAll}
 areDocsEmpty={areDocsEmpty}
 />}*/

export default QuestionContent
