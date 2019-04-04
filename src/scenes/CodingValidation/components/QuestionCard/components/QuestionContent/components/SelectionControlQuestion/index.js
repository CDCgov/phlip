import React from 'react'
import PropTypes from 'prop-types'
import Checkbox from '@material-ui/core/Checkbox'
import Radio from '@material-ui/core/Radio'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormLabel from '@material-ui/core/FormLabel'
import { withStyles } from '@material-ui/core/styles'
import ValidationAvatarList from '../ValidationAvatarList'
import PinciteTextField from '../PinciteTextField'
import { FlexGrid, IconButton } from 'components'
import { Marker } from 'mdi-material-ui'
import * as types from 'scenes/CodingValidation/constants'
import PinciteList from '../PinciteList'

const styles = theme => ({
  checked: {
    color: theme.palette.secondary.main
  }
})

/**
 * Checkbox form group for Coding / Validation screens
 */
export const SelectionControlQuestion = props => {
  const {
    choices, userAnswers, onChange, onChangePincite,
    classes, mergedUserQuestions, disableAll, userImages, question,
    enabledAnswerChoice, onToggleAnswerForAnno, areDocsEmpty
  } = props

  const Control = [types.CATEGORY, types.CHECKBOXES].includes(question.questionType) ? Checkbox : Radio
  const isValidation = mergedUserQuestions !== null

  return (
    <FormControl component="fieldset" style={{ flex: '1 1 auto' }}>
      <FormLabel component="legend" style={{ display: 'none' }} id="question_text">{question.text}</FormLabel>
      <FormGroup>
        {choices.map(choice => {
          const controlProps = {
            classes: { checked: classes.checked },
            inputProps: { id: choice.id, 'aria-describedby': 'question_text' },
            style: { height: 'unset' }
          }

          const answerList = mergedUserQuestions !== null &&
            mergedUserQuestions.answers.filter(answer => answer.schemeAnswerId === choice.id)

          const isAnswered = userAnswers.answers.hasOwnProperty(choice.id)
          const validatedBy = isValidation ? userAnswers.validatedBy : {}
          const list = (isValidation && isAnswered)
            ? [...answerList, { ...userAnswers.answers[choice.id], isValidatorAnswer: true, ...validatedBy }]
            : answerList

          return (
            <FlexGrid
              container
              key={choice.id}
              padding="0 10px 25px 0"
              style={{ backgroundColor: enabledAnswerChoice === choice.id ? '#e6f8ff' : 'white' }}>
              <FormControlLabel
                checked={isAnswered}
                aria-checked={isAnswered}
                onChange={onChange(choice.id)}
                htmlFor={choice.id}
                control={<Control {...controlProps} />}
                disabled={disableAll}
                label={choice.text}
                aria-label={choice.text}
              />

              {(isValidation && list.length > 0) &&
              <FlexGrid padding="0 10px 0 32px">
                <ValidationAvatarList
                  userImages={userImages}
                  answerList={list}
                  selectedIndex={99}
                />
                <PinciteList
                  answerList={answerList}
                  userImages={userImages}
                  isAnswered={isAnswered}
                  validatorObj={{ ...userAnswers.answers[choice.id], ...validatedBy }}
                  handleChangePincite={onChangePincite}
                />
              </FlexGrid>}

              {(isAnswered && !isValidation) &&
              <PinciteTextField
                schemeAnswerId={choice.id}
                pinciteValue={userAnswers.answers[choice.id].pincite}
                handleChangePincite={onChangePincite}
              />}

              {isAnswered && !areDocsEmpty &&
              <IconButton
                style={{ alignSelf: 'center', marginLeft: 20 }}
                onClick={onToggleAnswerForAnno(choice.id)}
                color={enabledAnswerChoice === choice.id ? 'primary' : '#757575'}
                iconSize={20}>
                <Marker style={{ fontSize: 20 }} />
              </IconButton>}
            </FlexGrid>
          )
        })}
      </FormGroup>
    </FormControl>
  )
}

SelectionControlQuestion.defaultProps = {
  pincites: true,
  userImages: undefined
}

SelectionControlQuestion.propTypes = {
  /**
   * Array of answer choices to display as checkbox inputs
   */
  choices: PropTypes.array,
  /**
   * The user's answer object for this question
   */
  userAnswers: PropTypes.object,
  /**
   * Function to call when a user clicks a checkbox input
   */
  onChange: PropTypes.func,
  /**
   * Function to call when the user changes the pincite text field
   */
  onChangePincite: PropTypes.func,
  /**
   * Whether or not to show pincite text field
   */
  mergedUserQuestions: PropTypes.object,
  /**
   * Whether or not to disabled all inputs
   */
  disableAll: PropTypes.bool,
  /**
   * User images array for getting the avatars (used in validation)
   */
  userImages: PropTypes.object,
  /**
   * Current question
   */
  question: PropTypes.object,
  /**
   * Style classes object from @material-ui/core
   */
  classes: PropTypes.object,
  /**
   * answer choice id that has been selected for annotating
   */
  enabledAnswerChoice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * handles when a user enables / disables an answer choice for annotating
   */
  onToggleAnswerForAnno: PropTypes.func,
  /**
   * Whether or not this project / jurisdiction has documents
   */
  areDocsEmpty: PropTypes.bool
}

export default withStyles(styles)(SelectionControlQuestion)
