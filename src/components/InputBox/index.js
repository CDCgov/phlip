import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'
import SimpleInput from 'components/SimpleInput'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    paddingTop: 10
  },
  textFieldInput: {
    outline: 0,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow'])
  }
})

const InputBox = ({ value, onChange, name, rows, answerId, classes, ...otherProps }) => {
  return (
    <Fragment>
      <TextField
        value={value.textAnswer}
        onChange={onChange(answerId, 'textAnswer')}
        multiline
        type="text"
        name={name}
        fullWidth
        rows={rows}
        InputProps={{
          disableUnderline: true,
          classes: {
            input: classes.textFieldInput
          }
        }}
        {...otherProps}
      />
      {value.textAnswer && value.textAnswer.length > 0 &&
      <div style={{ paddingTop: 20 }}>
        <SimpleInput
          name="pincite"
          value={value.pincite}
          placeholder="Enter pincite"
          label="Pincite"
          onChange={onChange(answerId, 'pincite')}
          rowsMax={5}
          style={{ flex: 1 }}
        />
      </div>}
    </Fragment>
  )
}

InputBox.propTypes = {
  onChange: PropTypes.func,
  name: PropTypes.string
}

export default withStyles(styles)(InputBox)