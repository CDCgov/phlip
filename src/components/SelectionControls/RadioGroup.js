import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Radio, { RadioGroup as MuiRadioGroup } from 'material-ui/Radio'
import { FormControlLabel, FormControl, FormGroup } from 'material-ui/Form'
import { withStyles } from 'material-ui/styles'
import SimpleInput from 'components/SimpleInput'
import AvatarList from 'components/AvatarList'
import Avatar from 'components/Avatar'

const styles = {
  checked: {
    color: '#00a9e5'
  }
}

export const RadioGroup = ({ choices, userAnswers, onChange, onChangePincite, classes, mergedUserQuestions }) => {
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
              label={choice.text}
            />
            {mergedUserQuestions && mergedUserQuestions.answers.map((answer, index) => (
              answer.schemeAnswerId === choice.id && <Avatar style={styles} key={index} initials={answer.firstName[0] + answer.lastName[0]} />
            ))}
            {userAnswers.answers.hasOwnProperty(choice.id) &&
              <SimpleInput key={`${choice.id}-pincite`} style={{ width: 300, marginLeft: '29px' }} placeholder="Enter pincite" value={userAnswers.answers[choice.id].pincite} onChange={onChangePincite(choice.id, 'pincite')} />}
          </div>
        ))}
      </FormGroup>
    </FormControl>
  )
}

RadioGroup.propTypes = {
}

export default withStyles(styles)(RadioGroup)