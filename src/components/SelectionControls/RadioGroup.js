import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Radio, { RadioGroup as MuiRadioGroup } from 'material-ui/Radio'
import { FormControlLabel, FormControl, FormGroup } from 'material-ui/Form'
import { withStyles } from 'material-ui/styles'
import SimpleInput from 'components/SimpleInput'

const styles = {
  checked: {
    color: '#00a9e5'
  }
}

export const RadioGroup = ({ choices, userAnswers, onChange, onChangePincite, classes }) => {
  return (
    <FormControl component="fieldset">
    <FormGroup>
      {choices.map(choice => (
        <div key={choice.id} style={{ display: 'flex', alignItems: 'center'  }}>
          <FormControlLabel
            onChange={onChange(choice.id)}
            checked={userAnswers.answers.hasOwnProperty(choice.id)}
            control={
              <Radio classes={{ checked: classes.checked }} />
            }
            label={choice.text}
          />
          {userAnswers.answers.hasOwnProperty(choice.id) &&
          <SimpleInput key={`${choice.id}-pincite`} style={{ width: 300 }} placeholder="Enter pincite" value={userAnswers.answers[choice.id].pincite} onChange={onChangePincite(choice.id, 'pincite')} />}
        </div>
      ))}
    </FormGroup>
    </FormControl>
  )
}

RadioGroup.propTypes = {
}

export default withStyles(styles)(RadioGroup)