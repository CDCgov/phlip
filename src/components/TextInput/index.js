import React from 'react'
import PropTypes from 'prop-types'
import Input, { InputLabel } from 'material-ui/Input'
import { FormControl, FormHelperText } from 'material-ui/Form'
import { withStyles } from 'material-ui/styles'

const styles = {
  disabled: {
    color: 'black'
  }
}

/**
 * Text field input with form control wrapper, set up for use in redux-form
 */
export const TextInput = props => {
  const {
    label, type, input, disabled, multiline, shrinkLabel, required,
    classes, meta: { active, touched, error, warning },
    ...custom
  } = props

  return (
    <FormControl
      error={Boolean(touched && error && !active || warning)}
      fullWidth
      disabled={disabled}>
      <InputLabel htmlFor={input.name} shrink={shrinkLabel} required={required}>{label}</InputLabel>
      <Input
        {...input}
        {...custom}
        type={type}
        id={input.name}
        classes={{ disabled: classes.disabled }}
        multiline={multiline}
        inputProps={{ 'aria-label': label }}
      />
      {touched && error && !active && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}

TextInput.propTypes = {
  /**
   * Label for input form element
   */
  label: PropTypes.string,
  /**
   * Type of input
   */
  type: PropTypes.string,
  /**
   * Object provided by redux-form, includes name, value and onChange
   */
  input: PropTypes.any,
  /**
   * Whether or not the input should be disabled
   */
  disabled: PropTypes.bool,
  /**
   * Whether or not the shrink the input label
   */
  shrinkLabel: PropTypes.bool,
  /**
   * Whether or not the input is required
   */
  required: PropTypes.bool,
  /**
   * Meta information like error provided by redux-form
   */
  meta: PropTypes.object,
  /**
   * Whether or not the input should allow multiline
   */
  multiline: PropTypes.bool,
  /**
   * Style classes from material-ui
   */
  classes: PropTypes.object
}

TextInput.defaultProps = {
  meta: {}
}

export default withStyles(styles)(TextInput)