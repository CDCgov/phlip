import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { InputBox, FlexGrid, Button } from 'components'
import { shouldShowAnnotationStyles } from '../SelectionControlQuestion'
import PinciteTextField from '../PinciteTextField'
import PinciteList from '../PinciteList'
import theme from 'services/theme'
import ValidationAvatarList from '../ValidationAvatarList'

export const TextFieldQuestion = props => {
  const {
    mergedUserQuestions, userAnswers, areDocsEmpty, onChange, answerId, userImages, disableAll,
    onToggleAnnotationMode, enabledAnswerId, annotationModeEnabled, isValidatorSelected, enabledUserId,
    onToggleCoderAnnotations
  } = props

  const isValidation = mergedUserQuestions !== null
  const isAnswered = userAnswers.answers.hasOwnProperty(answerId)
  const value = !isAnswered ? '' : userAnswers.answers[answerId].textAnswer
  const validatedBy = isValidation ? userAnswers.validatedBy : {}
  const showAnno = shouldShowAnnotationStyles(enabledAnswerId, annotationModeEnabled)(answerId)

  return (
    <FlexGrid container flex>
      {isValidation && mergedUserQuestions.answers.map(answer =>
        <FlexGrid container padding="25px 15px" key={answer.id} style={{ margin: '0 10px' }}>
          <FlexGrid container align="flex-start">
            <Typography style={{ whiteSpace: 'pre-wrap' }} variant="body1">{answer.textAnswer}</Typography>
          </FlexGrid>
          <FlexGrid container type="row" align="center" flex padding="8px 0">
            <ValidationAvatarList
              showAllAvatar={false}
              userImages={userImages}
              answerList={[answer]}
              handleClickAvatar={onToggleCoderAnnotations}
              enabledAnswerId={enabledAnswerId}
              enabledUserId={enabledUserId}
              isValidatorSelected={isValidatorSelected}
              answerId={answerId}
              layered={false}
            />
            <PinciteList
              alwaysShow
              showAvatar={false}
              answerList={[answer]}
              userImages={userImages}
            />
          </FlexGrid>
        </FlexGrid>)}
      <FlexGrid
        container
        padding="25px 15px"
        style={{
          alignSelf: 'stretch',
          backgroundColor: showAnno ? '#e6f8ff' : 'white',
          margin: '0 10px'
        }}>
        <InputBox
          onChange={onChange(answerId, 'textAnswer')}
          value={value}
          rows={7}
          placeholder="Enter answer"
          disabled={disableAll}
          name="text-answer"
        />
        {isAnswered && !areDocsEmpty &&
        <Button
          style={{
            alignSelf: 'flex-start',
            backgroundColor: showAnno ? theme.palette.error.main : 'white',
            color: showAnno ? 'white' : 'black'
          }}
          disableRipple
          onClick={onToggleAnnotationMode(answerId)}>
          {showAnno === answerId ? 'Done' : 'Annotate'}
        </Button>}
        {(isAnswered && !isValidation) &&
        <PinciteTextField
          schemeAnswerId={answerId}
          pinciteValue={userAnswers.answers[answerId].pincite}
          handleChangePincite={onChange}
          disabled={disableAll}
        />}
        {(isValidation && isAnswered) &&
        <FlexGrid container type="row" align="center" flex>
          <ValidationAvatarList
            userImages={userImages}
            answerList={[{ ...userAnswers.answers[answerId], isValidatorAnswer: true, ...validatedBy }]}
            handleClickAvatar={onToggleCoderAnnotations}
            enabledAnswerId={enabledAnswerId}
            enabledUserId={enabledUserId}
            isValidatorSelected={isValidatorSelected}
            answerId={answerId}
            showAllAvatar={false}
            layered={false}
          />
          <div style={{ paddingLeft: 5 }} />
          <PinciteList
            alwaysShow
            validatorStyles={{ margin: '3px 0' }}
            showAvatar={false}
            userImages={userImages}
            isAnswered={isAnswered}
            validatorObj={{ ...userAnswers.answers[answerId], ...validatedBy }}
            handleChangePincite={onChange}
            textFieldProps={{ padding: '0 8px', flex: '1 1 auto' }}
          />
        </FlexGrid>}
      </FlexGrid>
    </FlexGrid>
  )
}

TextFieldQuestion.propTypes = {
  /**
   * Function to call when the input changes
   */
  onChange: PropTypes.func,
  /**
   * Name of the input
   */
  name: PropTypes.string,
  /**
   * Number of rows the textarea should be
   */
  rows: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * schemeAnswerId of the Coding / Validation question
   */
  answerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * Collection of user images for ValidationAvatar
   */
  userImages: PropTypes.object,
  /**
   * Handles enabling the answer for annotation mode
   */
  onToggleAnnotationMode: PropTypes.func,
  /**
   * ID of the enabled answer choice
   */
  enabledAnswerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * Whether or not annotation mode is enabled
   */
  annotationModeEnabled: PropTypes.bool,
  /**
   * Whether or not there are documents
   */
  areDocsEmpty: PropTypes.bool,
  /**
   * Coded user answers only used for validation
   */
  mergedUserQuestions: PropTypes.object,
  /**
   * Current user answers
   */
  userAnswers: PropTypes.object,
  /**
   * Whether or not to disable the input field
   */
  disableAll: PropTypes.bool,
  /**
   * The id of the user selected for showing annotations
   */
  enabledUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * whether or not the user selected is the validator
   */
  isValidatorSelected: PropTypes.bool,
  /**
   * Function to handle the toggle of showing a user's annotations
   */
  onToggleCoderAnnotations: PropTypes.func
}

export default TextFieldQuestion
