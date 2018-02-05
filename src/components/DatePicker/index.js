import React from 'react'
import PropTypes from 'prop-types'
import { InputLabel, InputAdornment } from 'material-ui/Input'
import { FormControl, FormHelperText } from 'material-ui/Form'
import { DatePicker as MuiDatePicker } from 'material-ui-pickers'
import Icon from 'components/Icon'

export const DatePicker = ({ input, label, name, meta: { touched, error, warning }, dateFormat, disabled, ...otherProps }) => {
  return (
    <FormControl error={Boolean(touched && (error || warning))} disabled={disabled}>
      <MuiDatePicker
        {...input}
        label={label}
        style={{ marginTop: 16 }}
        format={dateFormat}
        name={name}
        error={Boolean(touched && error)}
        InputLabelProps={{
          shrink: true
        }}
        InputProps={{
          style: { 'alignItems': 'center'},
          startAdornment: <InputAdornment style={{ marginTop: 0 }} position="start" disableTypography><Icon color="#757575">event</Icon></InputAdornment>
        }}
        {...otherProps} />
      <FormHelperText>{touched && error}</FormHelperText>
    </FormControl>
  )
}

export default DatePicker