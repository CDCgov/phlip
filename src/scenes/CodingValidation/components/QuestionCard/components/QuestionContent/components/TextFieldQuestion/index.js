import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { InputBox, FlexGrid, Button } from 'components'
import PinciteTextField from '../PinciteTextField'
import PinciteList from '../PinciteList'
import theme from 'services/theme'

export const TextFieldQuestion = props => {
  const {
    mergedUserQuestions, userAnswers, areDocsEmpty, onChange, answerId, userImages, disableAll,
    onToggleAnswerForAnno, enabledAnswerChoice
  } = props

  const isValidation = mergedUserQuestions !== null
  const isAnswered = userAnswers.answers.hasOwnProperty(answerId)
  const value = !isAnswered ? '' : userAnswers.answers[answerId].textAnswer
  const validatedBy = isValidation ? userAnswers.validatedBy : {}

  return (
    <FlexGrid container align="flex-start">
      {isValidation && mergedUserQuestions.answers.map(answer =>
        <FlexGrid container padding="25px 15px" key={answer.id} style={{ margin: '0 10px' }}>
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
          backgroundColor: enabledAnswerChoice === answerId ? '#e6f8ff' : 'white',
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
          disabled={disableAll}
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
  onToggleAnswerForAnno: PropTypes.func,
  /**
   * ID of the enabled answer choice
   */
  enabledAnswerChoice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
  disableAll: PropTypes.bool
}

export default TextFieldQuestion
