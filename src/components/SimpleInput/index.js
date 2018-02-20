import React from 'react'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'

const SimpleInput = ({ value, onChange, name, multiline, ...otherProps }) => {
  return (
    <TextField
      value={value}
      onChange={onChange}
      multiline={multiline}
      type="text"
      name={name}
      fullWidth
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