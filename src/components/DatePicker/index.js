import React from 'react'
import PropTypes from 'prop-types'
import { FormControl, FormHelperText } from 'material-ui/Form'
import { DatePicker as MuiDatePicker } from 'material-ui-pickers'

export const DatePicker = props => {
  const {
    label, name, error, dateFormat, disabled, required, value, onChange, ...otherProps
  } = props

  return (
    <FormControl error={Boolean(error)} disabled={disabled}>
      <MuiDatePicker
        label={label}
        style={{ marginTop: 16 }}
        format={dateFormat}
        name={name}
        keyboard
        invalidDateMessage=""
        invalidLabel=""
        mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
        onChange={onChange}
        value={value}
        InputLabelProps={{ shrink: true, required, error: Boolean(error) }}
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