import React from 'react'
import PropTypes from 'prop-types'
import { FormControl, FormHelperText } from 'material-ui/Form'
import { DatePicker as MuiDatePicker } from 'material-ui-pickers'
import { ChevronRight, ChevronLeft, Calendar } from 'mdi-material-ui'
import moment from 'moment'

/**
 * GUI DatePicker Input wrapper for material-ui-picker's date picker
 */
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
        keyboardIcon={<Calendar />}
        rightArrowIcon={<ChevronRight />}
        leftArrowIcon={<ChevronLeft />}
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
  /**
   * Label for date picker input
   */
  label: PropTypes.string,

  /**
   * name attribute for input
   */
  name: PropTypes.string,

  /**
   * Error displayed in helper text
   */
  error: PropTypes.string,

  /**
   * Format the dates should be in
   */
  dateFormat: PropTypes.string,

  /**
   * Whether or not the input is disabled
   */
  disabled: PropTypes.bool,

  /**
   * Whether or not the input is required
   */
  required: PropTypes.bool,

  /**
   * Value of the date picker input. Can be string or date type
   */
  value: PropTypes.any,

  /**
   * Function called when the user changes the input and the new value is valid
   */
  onChange: PropTypes.func,

  /**
   * Function that is called when the value changes, regardless of validity
   */
  onInputChange: PropTypes.func
}

export default DatePicker