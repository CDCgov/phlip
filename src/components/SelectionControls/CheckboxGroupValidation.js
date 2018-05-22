import React from 'react'
import PropTypes from 'prop-types'
import Checkbox from 'material-ui/Checkbox'
import { FormGroup, FormControlLabel, FormControl, FormLabel } from 'material-ui/Form'
import { withStyles } from 'material-ui/styles'
import SimpleInput from 'components/SimpleInput'
import { getInitials } from 'utils/normalize'
import Avatar from 'components/Avatar'
import ValidationAvatar from 'components/ValidationAvatar'

const styles = theme => ({
  checked: {
    color: theme.palette.secondary.main
  }
})

export const CheckboxGroupValidation = props => {
  const {
    choices, userAnswers, onChange, onChangePincite, pincites,
    classes, mergedUserQuestions, disableAll, userImages, theme, question
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
          return (<div key={choice.id} style={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              checked={userAnswers.answers.hasOwnProperty(choice.id)}
              aria-checked={userAnswers.answers.hasOwnProperty(choice.id)}
              onChange={onChange(choice.id)}
              htmlFor={choice.id}
              control={<Checkbox classes={{ checked: classes.checked }} inputProps={{ id: choice.id, 'aria-describedby': 'question_text' }} />}
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
          </div>)
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
  choices: PropTypes.array,
  onChange: PropTypes.func
}

export default withStyles(styles, { withTheme: true })(CheckboxGroupValidation)