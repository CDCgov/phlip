import React from 'react'
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
  textFieldRoot: {
    padding: 0,
    width: 600
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

const InputBox = ({ value, onChange, name, rows, classes, ...otherProps }) => {
  return (
    <div className={classes.container}>
      <TextField
        value={value.textAnswer}
        onChange={onChange(null, 'fieldValue')}
        multiline
        type="text"
        name={name}
        rows={rows}
        InputProps={{
          disableUnderline: true,
          classes: {
            root: classes.textFieldRoot,
            input: classes.textFieldInput
          },
        }}
        {...otherProps}
      />
      {value.textAnswer && value.textAnswer.length > 0 && <SimpleInput name="pincite" value={value.pincite} placeholder="Enter pincite" onChange={onChange(null, 'pincite')} style={{ alignSelf: 'flex-end', paddingLeft: 15, flex: 1 }} />}
      </div>
  )
}

InputBox.propTypes = {
  onChange: PropTypes.func,
  name: PropTypes.string
}

export default withStyles(styles)(InputBox)