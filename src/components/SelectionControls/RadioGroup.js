import React from 'react'
import PropTypes from 'prop-types'
import Radio, { RadioGroup as MuiRadioGroup } from 'material-ui/Radio'
import { FormControlLabel, FormControl } from 'material-ui/Form'
import { withStyles } from 'material-ui/styles'

const styles = {
  checked: {
    color: '#00a9e5'
  }
}

export const RadioGroup = ({ choices, userAnswer, onChange, onChangePincite, classes }) => {
  return (
    <FormControl component="fieldset">
    <MuiRadioGroup onChange={onChange} value={userAnswer}>
      {choices.map(choice => (
        <FormControlLabel
          key={choice.id}
          value={`${choice.id}`}
          control={<Radio classes={{ checked: classes.checked }} />}
          label={choice.text}
        />
      ))}
    </MuiRadioGroup>
    </FormControl>
  )
}

RadioGroup.propTypes = {
  choices: PropTypes.array,
  onChange: PropTypes.func
}

export default withStyles(styles)(RadioGroup)