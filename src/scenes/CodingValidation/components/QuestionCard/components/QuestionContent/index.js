import React from 'react'
import PropTypes from 'prop-types'
import SelectionControlQuestion from './components/SelectionControlQuestion'
import * as questionTypes from 'scenes/CodingValidation/constants'
import TextFieldQuestions from './components/TextFieldQuestion'
import ValidationTable from './components/ValidationTable'
import { FlexGrid, Typography, Tooltip, Button, SimpleInput, Icon } from 'components'
import { withStyles } from '@material-ui/core/styles'

const styles = () => ({
  hintTooltip: {
    fontSize: '2em',
    backgroundColor: '#f5f5f5',
    width: 250,
    maxWidth: 250
  }
})

export const QuestionContent = props => {
  const {
    question, comment, userAnswers, mergedUserQuestions, isValidation, disableAll,
    onChange, onChangeTextAnswer, onOpenAlert, onOpenFlagConfirmAlert, userImages,
    onToggleAnnotationMode, enabledAnswerId, enabledUserId, annotationModeEnabled,
    areDocsEmpty, classes, onToggleCoderAnnotations, isValidatorSelected
  } = props
  
  const commonQuestionProps = {
    userImages,
    question,
    userAnswers,
    disableAll,
    areDocsEmpty,
    choices: question.possibleAnswers,
    mergedUserQuestions,
    onToggleAnnotationMode,
    enabledAnswerId,
    enabledUserId,
    annotationModeEnabled,
    onToggleCoderAnnotations,
    isValidatorSelected
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
  
  return (
    <FlexGrid container flex justify="space-between">
      <FlexGrid
        container
        type="row"
        padding={20}
        style={{ flexWrap: 'nowrap', overflow: 'auto' }}>
        <FlexGrid container>
          <Typography variant="subheading2" style={{ paddingRight: 10 }}>{question.number})</Typography>
        </FlexGrid>
        <FlexGrid container flex style={{ overflow: 'auto' }}>
          <FlexGrid container type="row" align="center" padding="0 0 10px">
            <Typography variant="body2" style={{ letterSpacing: 0 }}>
              {question.text}&nbsp;
            </Typography>
            {question.hint &&
            <FlexGrid style={{ height: 18, width: 18 }}>
              <Tooltip
                placement="top"
                overrideClasses={{ tooltip: classes.hintTooltip }}
                title={
                  <Typography variant="body2" style={{ color: 'black' }}>
                    <strong>Coding Directions:&nbsp;</strong>
                    {question.hint}
                  </Typography>
                }>
                <Icon color="#757575" size={18}>notifications</Icon>
              </Tooltip>
            </FlexGrid>}
          </FlexGrid>
          <FlexGrid container flex padding="5px 0 0" style={{ overflow: 'auto', minHeight: 'unset', width: '100%' }}>
            <FlexGrid container type="row">
              {question.questionType !== questionTypes.TEXT_FIELD &&
              <SelectionControlQuestion {...selectionFormProps} />}
              {question.questionType === questionTypes.TEXT_FIELD && <TextFieldQuestions {...textQuestionProps} />}
            </FlexGrid>
            {question.isCategoryQuestion &&
            <FlexGrid container type="row" flex justify="flex-start" padding="20px 1px 5px">
              <Button
                onClick={onOpenAlert}
                style={{ backgroundColor: 'white', color: 'black' }}
                value="Apply to all tabs"
              />
            </FlexGrid>}
            {(question.includeComment && !isValidation) &&
            <FlexGrid padding="20px 0 0 1px">
              <SimpleInput
                onChange={onChangeTextAnswer(null, 'comment')}
                name="comment"
                shrinkLabel
                style={{ whiteSpace: 'pre-wrap' }}
                placeholder="Enter comment"
                value={comment}
                rowsMax={3}
                aria-label="Comment"
                label="Comment"
                disabled={disableAll}
              />
            </FlexGrid>}
          </FlexGrid>
        </FlexGrid>
      </FlexGrid>
      <FlexGrid container type="column">
        {isValidation && <ValidationTable
          onOpenAlert={onOpenFlagConfirmAlert}
          mergedUserQuestions={mergedUserQuestions}
          questionFlags={question.flags}
          userImages={userImages}
          comment={question.comment}
          hasComment={question.includeComment}
          onChangeComment={onChangeTextAnswer(null, 'comment')}
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
  onToggleAnnotationMode: PropTypes.func,
  enabledAnswerId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  enabledUserId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  annotationModeEnabled: PropTypes.bool,
  areDocsEmpty: PropTypes.bool
}

export default withStyles(styles)(QuestionContent)
