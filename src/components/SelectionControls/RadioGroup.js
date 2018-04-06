import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Radio from 'material-ui/Radio'
import { FormControlLabel, FormControl, FormGroup, FormLabel, FormHelperText } from 'material-ui/Form'
import { InputLabel } from 'material-ui/Input'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  checked: {
    color: theme.palette.secondary.main
  }
})

export const RadioGroup = ({ choices, selected, onChange, error, required, helperText, label, classes }) => {
  return (
    <FormControl component="fieldset" required={required} error={error}>
      <InputLabel shrink={true} required={required} style={{ position: 'relative' }}>{label}</InputLabel>
      <FormGroup >
        {choices.map(choice => (
          <div key={choice.type} style={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              onChange={onChange(choice.type)}
              checked={selected === choice.type}
              control={<Radio classes={{ checked: classes.checked }} />}
              label={choice.text}
              disabled={choice.disabled}
            />
          </div>
        ))}
        <FormHelperText>{error && helperText}</FormHelperText>
      </FormGroup>
    </FormControl>
  )
}

RadioGroup.propTypes = {
}

export default withStyles(styles)(RadioGroup)