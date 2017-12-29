import React from 'react'
import PropTypes from 'prop-types'
import { InputLabel } from 'material-ui/Input'
import { FormControl, FormHelperText } from 'material-ui/Form'
import { DatePicker as MuiDatePicker } from 'material-ui-pickers'

export const DatePicker = ({ onChange, value, label, name, touched, error, warning, disabled, ...otherProps }) => {
  return (
    <FormControl error={Boolean(touched && (error || warning))} fullWidth disabled={disabled}>
      <InputLabel htmlFor={name} shrink>{label}</InputLabel>
      <MuiDatePicker
        onChange={onChange}
        value={value}
        style={{ marginTop: 16 }}
        {...otherProps} />
      {touched && error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}

export default DatePicker