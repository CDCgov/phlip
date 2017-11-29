import React from 'react'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'

const TextInput = ({ label, type, input, meta: { touched, error, warning }, width, ...custom }) => {
  const styles = {
    width: width ? width : ''
  }
  
  return (
    <div>
      <TextField
        style={styles}
        margin="normal"
        type={type}
        error={touched && Boolean(error || warning)}
        helperText={touched && (error || warning)}
        label={label} {...input} {...custom} />
    </div>
  )
}

TextInput.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  
}

export default TextInput