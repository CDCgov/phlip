import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Radio from 'material-ui/Radio'
import { FormControlLabel, FormControl, FormGroup } from 'material-ui/Form'
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

export const RadioGroup = props => {
  const {
    choices, userAnswers, onChange, onChangePincite, classes, mergedUserQuestions, disableAll
  } = props

  return (
    <FormControl component="fieldset">
      <FormGroup>
        {choices.map(choice => (
          <div key={choice.id} style={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              onChange={onChange(choice.id)}
              checked={userAnswers.answers.hasOwnProperty(choice.id)}
              control={
                <Radio classes={{ checked: classes.checked }} />
              }
              disabled={disableAll}
              label={choice.text}
            />
            {mergedUserQuestions !== null && mergedUserQuestions.answers.map((answer, index) => (
              answer.schemeAnswerId === choice.id &&
              <ValidationAvatar key={`user-answer-${index}`} answer={answer} choice={choice.id} />
            ))}
            {userAnswers.answers.hasOwnProperty(choice.id)
              && mergedUserQuestions !== null
              && <Avatar
                cardAvatar
                avatarUrl={userAnswers.validatedBy.avatarUrl}
                style={{ backgroundColor: 'white', color: '#35ac74', borderColor: '#35ac74' }}
                key={mergedUserQuestions.answers.length + 1}
                initials={userAnswers.validatedBy === null
                  ? ''
                  : getInitials(userAnswers.validatedBy.firstName, userAnswers.validatedBy.lastName)}
              />}
            {userAnswers.answers.hasOwnProperty(choice.id) &&
              <SimpleInput
                key={`${choice.id}-pincite`}
                style={{
                  width: 300,
                  marginLeft: (mergedUserQuestions !== null || userAnswers.answers.hasOwnProperty(choice.id))
                    ? '15px'
                    : '0px'
                }}
                disabled={disableAll}
                placeholder="Enter pincite"
                multiline={false}
                value={userAnswers.answers[choice.id].pincite}
                onChange={onChangePincite(choice.id, 'pincite')}
              />}
          </div>
        ))}
      </FormGroup>
    </FormControl>
  )
}

RadioGroup.propTypes = {}

export default withStyles(styles)(RadioGroup)