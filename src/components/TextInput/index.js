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

const TextInput = ({ name, label, type, input, disabled, classes, meta: { asyncValidating, touched, error, warning }, ...custom}) => {
  return (
    <FormControl error={Boolean(touched && (error || warning))} fullWidth disabled={disabled}>
      <InputLabel htmlFor={name} shrink>{label}</InputLabel>
      <Input
        id={name}
        {...input}
        type={type}
        {...custom}
        classes={{
          disabled: classes.disabled
        }}
      />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}

TextInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  input: PropTypes.any,
  meta: PropTypes.object
}

export default withStyles(styles)(TextInput)