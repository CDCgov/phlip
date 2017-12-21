import React from 'react'
import PropTypes from 'prop-types'
import Input, { InputLabel } from 'material-ui/Input'
import { FormControl, FormHelperText } from 'material-ui/Form'

const TextInput = ({ name, label, type, input, disabled, meta: { asyncValidating, touched, error, warning }, ...custom}) => {
  return (
    <FormControl error={Boolean(touched && (error || warning))} fullWidth disabled={disabled}>
      <InputLabel htmlFor={name} shrink>{label}</InputLabel>
      <Input
        id={name}
        {...input}
        type={type}
        {...custom}
      />
      <FormHelperText>{touched && error}</FormHelperText>
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

export default TextInput