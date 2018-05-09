import React from 'react'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'

const SimpleInput = ({ value, onChange, name, multiline, shrinkLabel, placeholder, error, helperText, label, ...otherProps }) => {
  return (
    <TextField
      value={value}
      onChange={onChange}
      multiline={multiline}
      InputLabelProps={{ shrink: shrinkLabel }}
      placeholder={placeholder}
      label={label}
      name={name}
      fullWidth
      helperText={helperText}
      error={error}
      {...otherProps}
    />
  )
}

SimpleInput.propTypes = {
  onChange: PropTypes.func
}

SimpleInput.defaultProps = {
  multiline: true
}

export default SimpleInput