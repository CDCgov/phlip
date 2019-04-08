import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import { InputBox, FlexGrid, IconButton } from 'components'
import ValidationAvatarList from '../ValidationAvatarList'
import Avatar from 'components/Avatar'
import { getInitials } from 'utils/normalize'
import TextField from '@material-ui/core/TextField'
import { Marker } from 'mdi-material-ui'
import PinciteTextField from '../PinciteTextField'
import PinciteList from '../PinciteList'

export const TextFieldQuestions = props => {
  const {
    mergedUserQuestions, userAnswers, areDocsEmpty, onChange, answerId, style, userImages, disabled, question,
    onToggleAnswerForAnno, enabledAnswerChoice, ...otherProps
  } = props

  const isValidation = mergedUserQuestions !== null
  const isAnswered = userAnswers.answers.hasOwnProperty(answerId)
  const value = !isAnswered ? '' : userAnswers.answers[answerId].textAnswer
  const validatedBy = isValidation ? userAnswers.validatedBy : {}

  return (
    <FlexGrid container align="flex-start">
      {isValidation && mergedUserQuestions.answers.map(answer =>
        <FlexGrid container padding="0 0 45px" key={answer.id}>
          <FlexGrid container padding="0 0 10px" align="flex-start">
            <Typography style={{ whiteSpace: 'pre-wrap' }} variant="body1">{answer.textAnswer}</Typography>
          </FlexGrid>
          <PinciteList
            avatarSize="big"
            alwaysShow
            answerList={[answer]}
            userImages={userImages}
          />
        </FlexGrid>)}
      <FlexGrid container style={{ alignSelf: 'stretch' }}>
        <InputBox
          onChange={onChange(answerId, 'textAnswer')}
          value={value}
          rows={7}
          placeholder="Enter answer"
          disabled={disabled}
          name="text-answer"
        />
        {(isAnswered && !isValidation) &&
        <PinciteTextField
          schemeAnswerId={answerId}
          pinciteValue={userAnswers.answers[answerId].pincite}
          handleChangePincite={onChange}
        />}
        {isValidation && <PinciteList
          avatarSize="big"
          alwaysShow
          userImages={userImages}
          isAnswered={isAnswered}
          validatorObj={{ ...userAnswers.answers[answerId], ...validatedBy }}
          handleChangePincite={onChange}
          textFieldProps={{ padding: 8 }}
        />}
      </FlexGrid>
    </FlexGrid>
  )

  /* <FlexGrid container type="row" style={{ alignItems: 'center', padding: isValidation ? '10px 0 0 0' : '' }}>
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
   </FlexGrid>
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

   return (
   <>
   <FlexGrid container flex padding={style.paddingLeft} style={{ overflow: 'auto' }}>
   </FlexGrid>
   <InputBox
   rows="4"
   name="text-answer"
   onChange={onChange}
   placeholder="Enter answer"
   question={question}
   style={{ paddingLeft: style.paddingLeft }}
   validator={validator}
   value={validatorAnswer}
   userImages={userImages}
   answerId={answerId}
   disabled={disabled}
   isValidation={true}
   areDocsEmpty={areDocsEmpty}
   />
   </>
   )*/
}

TextFieldQuestions.propTypes = {
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

export default TextFieldQuestions
