import React from 'react'
import PropTypes from 'prop-types'
import Checkbox from 'material-ui/Checkbox'
import { FormGroup, FormControlLabel, FormControl, FormHelperText } from 'material-ui/Form'
import { InputLabel } from 'material-ui/Input'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  checked: {
    color: theme.palette.secondary.main
  }
})

/**
 * Basic checkbox form group
 */
export const CheckboxGroup = ({ choices, onChange, error, required, helperText, label, classes }) => {
  return (
    <FormControl component="fieldset" required={required} error={error}>
      <InputLabel shrink={true} required={required} style={{ position: 'relative' }}>{label}</InputLabel>
      <FormGroup>
        {choices.map(choice => {
          return (<div key={choice.id} style={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              checked={choice.selected === true}
              onChange={onChange(choice.id)}
              control={<Checkbox classes={{ checked: classes.checked }} />}
              label={choice.text}
            />
          </div>)
        })}
        <FormHelperText>{error && helperText}</FormHelperText>
      </FormGroup>
    </FormControl>
  )
}

CheckboxGroup.propTypes = {
  /**
   * Array of choices to render as checkbox inputs
   */
  choices: PropTypes.array,
  /**
   * Function to call when a checkbox is clicked
   */
  onChange: PropTypes.func,
  /**
   * Whether or not there's a form error (renders helpText and labels are made red)
   */
  error: PropTypes.bool,
  /**
   * Whether or not input is required
   */
  required: PropTypes.bool,
  /**
   * Helper text to display if there's an error
   */
  helperText: PropTypes.string,
  /**
   * Label for the form group
   */
  label: PropTypes.string,
  /**
   * Style classes from material-ui
   */
  classes: PropTypes.object
}

export default withStyles(styles)(CheckboxGroup)