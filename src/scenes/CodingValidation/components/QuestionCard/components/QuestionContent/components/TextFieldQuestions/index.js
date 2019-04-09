import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { InputBox, FlexGrid, Button } from 'components'
import PinciteTextField from '../PinciteTextField'
import PinciteList from '../PinciteList'
import theme from 'services/theme'

export const TextFieldQuestions = props => {
  const {
    mergedUserQuestions, userAnswers, areDocsEmpty, onChange, answerId, userImages, disabled,
    onToggleAnswerForAnno, enabledAnswerChoice
  } = props

  const isValidation = mergedUserQuestions !== null
  const isAnswered = userAnswers.answers.hasOwnProperty(answerId)
  const value = !isAnswered ? '' : userAnswers.answers[answerId].textAnswer
  const validatedBy = isValidation ? userAnswers.validatedBy : {}

  return (
    <FlexGrid container align="flex-start">
      {isValidation && mergedUserQuestions.answers.map(answer =>
        <FlexGrid container padding="25px 15px" key={answer.id}>
          <FlexGrid container padding="0 0 10px" align="flex-start">
            <Typography style={{ whiteSpace: 'pre-wrap' }} variant="body1">{answer.textAnswer}</Typography>
          </FlexGrid>
          <PinciteList
            avatarSize="big"
            alwaysShow
            answerList={[answer]}
            userImages={userImages}
          />
        </FlexGrid>)}
      <FlexGrid
        container
        padding="25px 15px"
        style={{
          alignSelf: 'stretch',
          backgroundColor: enabledAnswerChoice === answerId ? '#e6f8ff' : 'white'
        }}>
        <InputBox
          onChange={onChange(answerId, 'textAnswer')}
          value={value}
          rows={7}
          placeholder="Enter answer"
          disabled={disabled}
          name="text-answer"
        />
        {isAnswered && !areDocsEmpty &&
        <Button
          style={{
            alignSelf: 'flex-start',
            backgroundColor: enabledAnswerChoice === answerId ? theme.palette.error.main : 'white',
            color: enabledAnswerChoice === answerId ? 'white' : 'black'
          }}
          disableRipple
          onClick={onToggleAnswerForAnno(answerId)}>
          {enabledAnswerChoice === answerId ? 'Done' : 'Annotate'}
        </Button>}
        {(isAnswered && !isValidation) &&
        <PinciteTextField
          schemeAnswerId={answerId}
          pinciteValue={userAnswers.answers[answerId].pincite}
          handleChangePincite={onChange}
        />}
        {isValidation && <PinciteList
          validatorStyles={{ margin: '3px 0' }}
          avatarSize="big"
          alwaysShow
          userImages={userImages}
          isAnswered={isAnswered}
          validatorObj={{ ...userAnswers.answers[answerId], ...validatedBy }}
          handleChangePincite={onChange}
          textFieldProps={{ padding: 8 }}
        />}
      </FlexGrid>
    </FlexGrid>
  )
}

TextFieldQuestions.propTypes = {
  /**
   * Value of the input field
   */
  value: PropTypes.any,
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
   * Style classes from @material-ui/core
   */
  classes: PropTypes.object,
  /**
   * Who is validated this question
   */
  validator: PropTypes.object,
  /**
   * Theme object from @material-ui/core
   */
  theme: PropTypes.object,
  /**
   * Coding / Validation question object
   */
  question: PropTypes.object,
  /**
   * Whether or not this is being rendered on Validation scene
   */
  isValidation: PropTypes.bool,
  /**
   * Collection of user images for ValidationAvatar
   */
  userImages: PropTypes.object,
  /**
   * Outer container style
   */
  style: PropTypes.object,
  onToggleAnswerForAnno: PropTypes.func,
  enabledAnswerChoice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  areDocsEmpty: PropTypes.bool,
  mergedUserQuestions: PropTypes.object,
  userAnswers: PropTypes.object,
  disabled: PropTypes.bool

}

export default TextFieldQuestions