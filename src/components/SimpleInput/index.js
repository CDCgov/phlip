import React from 'react'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'

const SimpleInput = ({ value, onChange, ...otherProps }) => {
  return (
    <TextField
      value={value}
      onChange={onChange()}
      multiline
      type="text"
      name="answer-choice"
      {...otherProps}
    />
  )
}

SimpleInput.propTypes = {
  onChange: PropTypes.func
}

export default SimpleInput