import React from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import SimpleInput from 'components/SimpleInput'
import { withStyles } from '@material-ui/core/styles'
import { Row, Column } from 'components/Layout'
import Avatar from 'components/Avatar'
import { getInitials } from 'utils/normalize'
import { FormatQuoteClose } from 'mdi-material-ui'
import { IconButton } from 'components/index'

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

/**
 * A textarea input different from typically @material-ui/core inputs, in that it is a box. Used in Coding / Validation
 * scenes
 */
export const InputBox = props => {
  const {
    value, onChange, name, rows, answerId, classes, validator, theme, question,
    isValidation, userImages, style, onToggleAnswerForAnno, enabledAnswerChoice, areDocsEmpty, ...otherProps
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
        {(textValues.textAnswer && textValues.textAnswer.length > 0 && !areDocsEmpty) &&
        <IconButton
          style={{ alignSelf: 'center', marginLeft: 20 }}
          onClick={onToggleAnswerForAnno(answerId)}
          color={enabledAnswerChoice === answerId ? 'primary' : '#757575'}
          iconSize={20}>
          <FormatQuoteClose style={{ fontSize: 20 }} />
        </IconButton>}
      </Row>
      {textValues.textAnswer && textValues.textAnswer.length > 0 &&
      <div style={{ paddingTop: 10, paddingBottom: 20 }}>
        <SimpleInput
          name="pincite"
          value={textValues.pincite === null ? '' : textValues.pincite}
          placeholder="Enter pincite"
          label="Pincite"
          InputProps={{ inputProps: { 'aria-label': 'Pincite' } }}
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
  /**
   * Value of the input field
   */
  value: PropTypes.any,
  /**
   * Function to call when the input changes
   */
  onChange: PropTypes.func,
  /**
   * Name of the input
   */
  name: PropTypes.string,
  /**
   * Number of rows the textarea should be
   */
  rows: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * schemeAnswerId of the Coding / Validation question
   */
  answerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * Style classes from @material-ui/core
   */
  classes: PropTypes.object,
  /**
   * Who is validated this question
   */
  validator: PropTypes.object,
  /**
   * Theme object from @material-ui/core
   */
  theme: PropTypes.object,
  /**
   * Coding / Validation question object
   */
  question: PropTypes.object,
  /**
   * Whether or not this is being rendered on Validation scene
   */
  isValidation: PropTypes.bool,
  /**
   * Collection of user images for ValidationAvatar
   */
  userImages: PropTypes.object,
  /**
   * Outer container style
   */
  style: PropTypes.object,
  onToggleAnswerForAnno: PropTypes.func,
  enabledAnswerChoice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  areDocsEmpty: PropTypes.bool
}

InputBox.defaultProps = {
  classes: {},
  isValidation: false,
  question: {},
  rows: 4,
  theme: {},
  userImages: undefined
}

export default withStyles(styles, { withTheme: true })(InputBox)