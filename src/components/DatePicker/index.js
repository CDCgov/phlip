import React from 'react'
import PropTypes from 'prop-types'
import { FormControl, FormHelperText } from 'material-ui/Form'
import { DatePicker as MuiDatePicker } from 'material-ui-pickers'

export const DatePicker = props => {
  const {
    input, label, name, meta: { touched, error, warning },
    dateFormat, disabled, required, ...otherProps
  } = props

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
        InputLabelProps={{ shrink: true, required }}
        {...otherProps}
      />
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  )
}

DatePicker.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  name: PropTypes.string,
  meta: PropTypes.object,
  dateFormat: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool
}

export default DatePicker