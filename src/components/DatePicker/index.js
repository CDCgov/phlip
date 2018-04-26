import React from 'react'
import PropTypes from 'prop-types'
import { FormControl, FormHelperText } from 'material-ui/Form'
import { DatePicker as MuiDatePicker } from 'material-ui-pickers'
import moment from 'moment'

export const DatePicker = props => {
  const {
    label, name, error, dateFormat, disabled, required, value, onChange, onInputChange, ...otherProps
  } = props

  const displayValue = moment(value).format('MM/DD/YYYY') === 'Invalid date' ? value : moment(value).format('MM/DD/YYYY')

  return (
    <FormControl error={Boolean(error)} disabled={disabled}>
      <MuiDatePicker
        label={label}
        style={{ marginTop: 16 }}
        format={dateFormat}
        name={name}
        keyboard
        mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
        onChange={onChange}
        value={value}
        InputLabelProps={{ shrink: true, required, error: Boolean(error) }}
        InputProps={{ onChange: onInputChange, value: displayValue }}
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