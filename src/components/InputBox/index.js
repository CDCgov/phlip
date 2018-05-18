import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'
import SimpleInput from 'components/SimpleInput'
import { withStyles } from 'material-ui/styles'
import { Row, Column } from 'components/Layout'
import Avatar from 'components/Avatar'
import { getInitials } from 'utils/normalize'

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

const InputBox = props => {
  const {
    value, onChange, name, rows, answerId, classes, validator, theme, question,
    isValidation, userImages, style, ...otherProps
  } = props

  const userImageObj = userImages
    ? userImages[validator.userId] !== undefined
      ? userImages[validator.userId]
      : validator
    : {}

  const textValues = value === undefined ? { textAnswer: '', pincite: '' } : value
  return (
    <Column style={style}>
      <Row displayFlex style={{ alignItems: 'center', padding: isValidation ? '10px 0 0 0' : '' }}>
        {isValidation &&
        <Avatar
          cardAvatar
          avatar={userImageObj.avatar}
          userName={`${userImageObj.firstName} ${userImageObj.lastName}`}
          style={{
            marginRight: 15,
            backgroundColor: 'white',
            color: theme.palette.secondary.main,
            borderColor: theme.palette.secondary.main
          }}
          initials={getInitials(validator.firstName, validator.lastName)}
        />}
        <label style={{ display: 'none' }} id="question_text">{question.text}</label>
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
            },
            inputProps: {
              'aria-describedby': 'question_text'
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
          aria-label="pincite"
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

InputBox.defaultProps = {
  userImages: undefined
}

export default withStyles(styles, { withTheme: true })(InputBox)