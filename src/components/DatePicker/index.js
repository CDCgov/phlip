import React from 'react'
import PropTypes from 'prop-types'
import { InputLabel, InputAdornment } from 'material-ui/Input'
import { FormControl, FormHelperText } from 'material-ui/Form'
import { DatePicker as MuiDatePicker } from 'material-ui-pickers'

export const DatePicker = ({ input, label, name, meta: { touched, error, warning }, dateFormat, disabled, ...otherProps }) => {
  return (
    <FormControl error={Boolean(error || warning)} disabled={disabled}>
      <MuiDatePicker
        label={label}
        style={{ marginTop: 16 }}
        format={dateFormat}
        name={name}
        onChange={input.onChange}
        value={input.value}
        keyboard
        mask={[/^[\d]*/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
        InputLabelProps={{
          shrink: true
        }}
        {...otherProps}
      />
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  )
}

export default DatePicker