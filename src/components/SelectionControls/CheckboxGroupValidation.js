import React from 'react'
import PropTypes from 'prop-types'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormLabel from '@material-ui/core/FormLabel'
import { withStyles } from '@material-ui/core/styles'
import { getInitials } from 'utils/normalize'
import ValidationAvatar from 'components/ValidationAvatar'
import { FlexGrid, IconButton, Avatar, SimpleInput } from 'components'
import { Marker } from 'mdi-material-ui'

const styles = theme => ({
  checked: {
    color: theme.palette.secondary.main
  }
})

/**
 * Checkbox form group for Coding / Validation screens
 */
export const CheckboxGroupValidation = props => {
  const {
    choices, userAnswers, onChange, onChangePincite, pincites,
    classes, mergedUserQuestions, disableAll, userImages, theme, question,
    enabledAnswerChoice, onToggleAnswerForAnno
  } = props

  const userImageObj = userImages
    ? userImages[userAnswers.validatedBy.userId] !== undefined
      ? userImages[userAnswers.validatedBy.userId]
      : userAnswers.validatedBy
    : {}

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend" style={{ display: 'none' }} id="question_text">{question.text}</FormLabel>
      <FormGroup>
        {choices.map(choice => {
          return (
            <FlexGrid
              container
              type="row"
              align="center"
              key={choice.id}
              padding="0 10px"
              style={{ backgroundColor: enabledAnswerChoice === choice.id ? '#e6f8ff' : 'white' }}>
              <FormControlLabel
                checked={userAnswers.answers.hasOwnProperty(choice.id)}
                aria-checked={userAnswers.answers.hasOwnProperty(choice.id)}
                onChange={onChange(choice.id)}
                htmlFor={choice.id}
                control={<Checkbox
                  classes={{ checked: classes.checked }}
                  inputProps={{ id: choice.id, 'aria-describedby': 'question_text' }} />}
                disabled={disableAll}
                label={choice.text}
                aria-label={choice.text}
              />
              {mergedUserQuestions !== null && mergedUserQuestions.answers.map((answer, index) => (
                answer.schemeAnswerId === choice.id &&
                <ValidationAvatar
                  key={`user-answer-${index}`}
                  userName={`${userImages[answer.userId].firstName} ${userImages[answer.userId].lastName}`}
                  avatar={userImages[answer.userId] !== undefined ? userImages[answer.userId].avatar : ''}
                  answer={answer} />
              ))}
              {userAnswers.answers.hasOwnProperty(choice.id)
              && mergedUserQuestions !== null
              && <Avatar
                cardAvatar
                avatar={userImageObj.avatar}
                userName={`${userImageObj.firstName} ${userImageObj.lastName}`}
                key={mergedUserQuestions.answers.length + 1}
                style={{
                  backgroundColor: 'white',
                  color: theme.palette.secondary.main,
                  borderColor: theme.palette.secondary.main
                }}
                initials={getInitials(userAnswers.validatedBy.firstName, userAnswers.validatedBy.lastName)}
              />}
              {userAnswers.answers.hasOwnProperty(choice.id) && pincites &&
              <SimpleInput
                key={`${choice.id}-pincite`} placeholder="Enter pincite"
                value={userAnswers.answers[choice.id].pincite}
                multiline={false}
                InputProps={{ inputProps: { 'aria-label': 'Pincite' } }}
                style={{
                  width: 300,
                  marginLeft: (mergedUserQuestions !== null || userAnswers.answers.hasOwnProperty(choice.id))
                    ? '15px'
                    : '0px'
                }}
                onChange={onChangePincite(choice.id, 'pincite')}
              />}
              <IconButton
                style={{ alignSelf: 'center', marginLeft: 20 }}
                onClick={onToggleAnswerForAnno(choice.id)}
                color={enabledAnswerChoice === choice.id ? 'primary' : '#b9bbbb'}
                iconSize={20}>
                <Marker style={{ fontSize: 20 }} />
              </IconButton>
            </FlexGrid>
          )
        })}
      </FormGroup>
    </FormControl>
  )
}

CheckboxGroupValidation.defaultProps = {
  pincites: true,
  userImages: undefined
}

CheckboxGroupValidation.propTypes = {
  /**
   * Array of answer choices to display as checkbox inputs
   */
  choices: PropTypes.array,
  /**
   * The user's answer object for this question
   */
  userAnswers: PropTypes.object,
  /**
   * Function to call when a user clicks a checkbox input
   */
  onChange: PropTypes.func,
  /**
   * Function to call when the user changes the pincite text field
   */
  onChangePincite: PropTypes.func,
  /**
   * Whether or not to show pincite text field
   */
  pincites: PropTypes.bool,
  /**
   * Object of coded questions (used on validation for displaying who answered each answer choice)
   */
  mergedUserQuestions: PropTypes.object,
  /**
   * Whether or not to disabled all inputs
   */
  disableAll: PropTypes.bool,
  /**
   * User images array for getting the avatars (used in validation)
   */
  userImages: PropTypes.object,
  /**
   * Current question
   */
  question: PropTypes.object,
  /**
   * @material-ui/core theme object
   */
  theme: PropTypes.object,
  /**
   * Style classes object from @material-ui/core
   */
  classes: PropTypes.object
}

export default withStyles(styles, { withTheme: true })(CheckboxGroupValidation)