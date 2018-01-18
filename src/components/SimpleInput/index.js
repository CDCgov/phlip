import React from 'react'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'

const SimpleInput = ({ value, onChange }) => {
  return (
    <TextField
      value={value.text}
      onChange={onChange(value.id)}
      multiline
      type="text"
      name="answer-choice"
    />
  )
}

SimpleInput.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func
}

export default SimpleInput