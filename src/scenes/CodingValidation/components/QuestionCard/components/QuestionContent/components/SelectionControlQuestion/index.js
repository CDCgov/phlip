import React from 'react'
import PropTypes from 'prop-types'
import Checkbox from '@material-ui/core/Checkbox'
import Radio from '@material-ui/core/Radio'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormLabel from '@material-ui/core/FormLabel'
import { withStyles } from '@material-ui/core/styles'
import AvatarList from '../AvatarList'
import PinciteTextField from '../PinciteTextField'
import { FlexGrid, Button } from 'components'
import * as types from 'scenes/CodingValidation/constants'
import PinciteList from '../PinciteList'
import theme from 'services/theme'

const styles = theme => ({
  checked: {
    color: theme.palette.secondary.main
  }
})

export const shouldShowAnnotationStyles = (enabledAnswer, annotationMode) => choiceId => {
  return annotationMode ? (enabledAnswer === choiceId) : false
}

/**
 * Checkbox form group for Coding / Validation screens
 */
export const SelectionControlQuestion = props => {
  const {
    choices, userAnswers, onChange, onChangePincite, user,
    classes, mergedUserQuestions, disableAll, userImages, question,
    enabledAnswerId, onToggleAnnotationMode, annotationModeEnabled, areDocsEmpty,
    onToggleCoderAnnotations, isUserAnswerSelected, enabledUserId
  } = props
  
  const showAnnoStyles = shouldShowAnnotationStyles(enabledAnswerId, annotationModeEnabled)
  
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
          
          const answerList = mergedUserQuestions !== null
            ? mergedUserQuestions.answers.filter(answer => answer.schemeAnswerId === choice.id)
            : []
          
          const isAnswered = userAnswers.answers.hasOwnProperty(choice.id)
          const validatedBy = isValidation ? userAnswers.validatedBy : {}
          const list = isAnswered
            ? [
              ...answerList,
              {
                ...userAnswers.answers[choice.id],
                isUserAnswer: true,
                isValidatorAnswer: isValidation,
                userId: user.id,
                ...validatedBy
              }
            ]
            : answerList
          
          const showAnno = showAnnoStyles(choice.id)
          
          return (
            <FlexGrid
              container
              key={choice.id}
              padding="5px 15px 10px"
              style={{ backgroundColor: showAnno ? '#e6f8ff' : 'white', marginRight: 10 }}>
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
              
              <FlexGrid container padding="0 0 0 32px">
                <FlexGrid container type="row" padding="5px 10px 5px 0">
                  {list.length > 0 && <AvatarList
                    userImages={userImages}
                    answerList={list}
                    handleClickAvatar={onToggleCoderAnnotations}
                    enabledAnswerId={enabledAnswerId}
                    enabledUserId={enabledUserId}
                    isUserAnswerSelected={isUserAnswerSelected}
                    answerId={choice.id}
                    showAllAvatar={list.length > 1 && isValidation}
                  />}
                  {isAnswered && !areDocsEmpty &&
                  <Button
                    style={{
                      alignSelf: 'center',
                      backgroundColor: showAnno ? theme.palette.error.main : 'white',
                      color: showAnno ? 'white' : 'black',
                      margin: '0 0 0 20px',
                      height: 32,
                      maxHeight: 32,
                      minHeight: 'unset',
                      lineHeight: 'unset'
                    }}
                    disableRipple
                    onClick={onToggleAnnotationMode(choice.id)}>
                    {showAnno ? 'Done' : 'Annotate'}
                  </Button>}
                </FlexGrid>
                {(list.length > 0 && isValidation) && <PinciteList
                  answerList={answerList}
                  userImages={userImages}
                  isAnswered={isAnswered}
                  validatorObj={{ ...userAnswers.answers[choice.id], ...validatedBy }}
                  handleChangePincite={onChangePincite}
                />}
              </FlexGrid>
              
              {(isAnswered && !isValidation) &&
              <PinciteTextField
                style={{ paddingLeft: 32, paddingTop: 5, marginBottom: 15, width: '90%' }}
                schemeAnswerId={choice.id}
                pinciteValue={userAnswers.answers[choice.id].pincite}
                handleChangePincite={onChangePincite}
              />}
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
  enabledAnswerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * handles when a user enables / disables an answer choice for annotating
   */
  onToggleAnnotationMode: PropTypes.func,
  /**
   * Whether or not annotation mode is enabled
   */
  annotationModeEnabled: PropTypes.bool,
  /**
   * Whether or not this project / jurisdiction has documents
   */
  areDocsEmpty: PropTypes.bool,
  /**
   * The id of the user selected for showing annotations
   */
  enabledUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * whether or not the user selected is the validator
   */
  isUserAnswerSelected: PropTypes.bool,
  /**
   * Current logged in user
   */
  user: PropTypes.object,
  /**
   * Function to handle the toggle of showing a user's annotations
   */
  onToggleCoderAnnotations: PropTypes.func
}

export default withStyles(styles)(SelectionControlQuestion)
