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

const TextInput = props => {
  const {
    name, label, type, input, disabled, multiline, shrinkLabel, required,
    classes, meta: { asyncValidating, active, touched, error, warning },
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
  name: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  input: PropTypes.any,
  meta: PropTypes.object,
  multiline: PropTypes.bool
}

TextInput.defaultProps = {
  meta: {}
}

export default withStyles(styles)(TextInput)