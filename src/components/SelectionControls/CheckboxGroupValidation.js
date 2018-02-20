import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Checkbox from 'material-ui/Checkbox'
import { FormGroup, FormControlLabel, FormControl } from 'material-ui/Form'
import { withStyles } from 'material-ui/styles'
import SimpleInput from 'components/SimpleInput'
import Avatar from 'components/Avatar'

const styles = {
  checked: {
    color: '#00a9e5'
  }
}

const avatarStyles = {
  marginRight: '-6px',
  border: 'solid 3px white',
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.19)',
  width: '38px',
  height: '38px'
}

export const CheckboxGroupValidation = ({ choices, currentUserInitials, userAnswers, onChange, onChangePincite, pincites, classes, mergedUserQuestions }) => {
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
              <Avatar
                cardAvatar
                key={index}
                initials={answer.firstName === 'Admin'
                  ? answer.firstName[0]
                  : answer.firstName[0] + answer.lastName[0]}
              />
            ))}
            {userAnswers.answers.hasOwnProperty(choice.id)
            && mergedUserQuestions !== null
            && <Avatar
              cardAvatar
              key={mergedUserQuestions.answers.length + 1}
              initials={currentUserInitials}
            />}
            {userAnswers.answers.hasOwnProperty(choice.id) && pincites &&
            <SimpleInput
              key={`${choice.id}-pincite`} placeholder="Enter pincite"
              value={userAnswers.answers[choice.id].pincite}
              multiline={false}
              style={{ width: 300, marginLeft: (mergedUserQuestions !== null || userAnswers.answers.hasOwnProperty(choice.id)) ? '15px' : '0px' }}
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