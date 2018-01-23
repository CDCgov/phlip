import React from 'react'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textFieldRoot: {
    padding: 0
  },
  textFieldInput: {
    outline: 0,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 12px',
    width: 600,
    transition: theme.transitions.create(['border-color', 'box-shadow'])
  }
})

const InputBox = ({ value, onChange, name, classes, ...otherProps }) => {
  return (
    <div className={classes.container}>
    <TextField
      value={value}
      onChange={onChange(null, 'fieldValue')}
      multiline
      type="text"
      name={name}
      InputProps={{
        disableUnderline: true,
        classes: {
          root: classes.textFieldRoot,
          input: classes.textFieldInput,
        },
      }}
      {...otherProps}
    />
      </div>
  )
}

InputBox.propTypes = {
  onChange: PropTypes.func,
  name: PropTypes.string
}

export default withStyles(styles)(InputBox)