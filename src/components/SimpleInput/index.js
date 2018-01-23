import React from 'react'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'

const SimpleInput = ({ value, onChange, name, ...otherProps }) => {
  return (
    <TextField
      value={value}
      onChange={onChange}
      multiline
      type="text"
      name={name}
      {...otherProps}
    />
  )
}

SimpleInput.propTypes = {
  onChange: PropTypes.func
}

export default SimpleInput