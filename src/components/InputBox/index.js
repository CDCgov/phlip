import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'
import SimpleInput from 'components/SimpleInput'
import { withStyles } from 'material-ui/styles'
import { Row, Column } from 'components/Layout'
import Avatar from 'components/Avatar'

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
    whiteSpace: 'pre-wrap',
    transition: theme.transitions.create(['border-color', 'box-shadow'])
  }
})

const InputBox = ({ value, onChange, name, rows, answerId, classes, currentUserInitials, validator, isValidation, style, ...otherProps }) => {
  const textValues = value === undefined ? { textAnswer: '', pincite: '' } : value
  return (
    <Column style={style}>
      <Row displayFlex style={{ alignItems: 'center', padding: isValidation ? '10px 0 0 0' : '' }}>
        {isValidation && <Avatar cardAvatar style={{ marginRight: 15, backgroundColor: 'white', color: '#35ac74', borderColor: '#35ac74' }} initials={validator} />}
        <TextField
          value={textValues.textAnswer}
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
      </Row>
      {textValues.textAnswer && textValues.textAnswer.length > 0 &&
      <div style={{ paddingTop: 10, paddingBottom: 20 }}>
        <SimpleInput
          name="pincite"
          value={textValues.pincite === null ? '' : textValues.pincite}
          placeholder="Enter pincite"
          label="Pincite"
          onChange={onChange(answerId, 'pincite')}
          multiline={false}
          shrinkLabel
          style={{ flex: 1 }}
        />
      </div>}
    </Column>
  )
}

InputBox.propTypes = {
  onChange: PropTypes.func,
  name: PropTypes.string
}

export default withStyles(styles)(InputBox)