import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Checkbox from 'material-ui/Checkbox'
import { FormGroup, FormControlLabel, FormControl } from 'material-ui/Form'
import { withStyles } from 'material-ui/styles'
import SimpleInput from 'components/SimpleInput'
import { getInitials } from 'utils/normalize'
import Avatar from 'components/Avatar'
import ValidationAvatar from 'components/ValidationAvatar'

const styles = {
  checked: {
    color: '#00a9e5'
  }
}

export const CheckboxGroupValidation = props => {
  const {
    choices, userAnswers, onChange, onChangePincite, pincites, classes, mergedUserQuestions
  } = props

  return (
    <FormControl component="fieldset">
      <FormGroup>
        {choices.map(choice => {
          return (<div key={choice.id} style={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              checked={userAnswers.answers.hasOwnProperty(choice.id)}
              onChange={onChange(choice.id)}
              control={
                <Checkbox classes={{ checked: classes.checked }} />
              }
              label={choice.text}
            />
            {mergedUserQuestions !== null && mergedUserQuestions.answers.map((answer, index) => (
              answer.schemeAnswerId === choice.id &&
              <ValidationAvatar key={`user-answer-${index}`} answer={answer} />
            ))}
            {userAnswers.answers.hasOwnProperty(choice.id)
              && mergedUserQuestions !== null
              && <Avatar
                cardAvatar
                avatarUrl={userAnswers.validatedBy.avatarUrl}
                key={mergedUserQuestions.answers.length + 1}
                style={{ backgroundColor: 'white', color: 'teal', borderColor: 'teal' }}
                initials={userAnswers.validatedBy === null
                  ? ''
                  : getInitials(userAnswers.validatedBy.firstName, userAnswers.validatedBy.lastName)}
              />}
            {userAnswers.answers.hasOwnProperty(choice.id) && pincites &&
              <SimpleInput
                key={`${choice.id}-pincite`} placeholder="Enter pincite"
                value={userAnswers.answers[choice.id].pincite}
                multiline={false}
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
  pincites: true
}

CheckboxGroupValidation.propTypes = {
  choices: PropTypes.array,
  onChange: PropTypes.func
}

export default withStyles(styles)(CheckboxGroupValidation)