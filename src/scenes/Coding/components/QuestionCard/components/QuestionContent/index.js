import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import SimpleInput from 'components/SimpleInput'
import RadioGroup from 'components/SelectionControls/RadioGroup'
import CheckboxGroup from 'components/SelectionControls/CheckboxGroup'

const QuestionContent = ({ question, userAnswer, onChange, onChangeTextAnswer, onChangePincite }) => {
  return (
    <Fragment>
      {question.questionType === 1 && <RadioGroup choices={question.possibleAnswers} onChange={onChange} userAnswer={userAnswer} />}
      {question.questionType === 2 && <div></div>}
      {question.questionType === 3 && <CheckboxGroup choices={question.possibleAnswers} onChange={onChange} userAnswer={userAnswer} />}
      {question.questionType === 4 && <RadioGroup choices={question.possibleAnswers} onChange={onChange} userAnswer={userAnswer} />}
      {question.questionType === 5 && <SimpleInput onChange={onChangeTextAnswer} value={userAnswer.fieldValue} /> }
    </Fragment>
  )
}

QuestionContent.propTypes = {
  question: PropTypes.object,
  onChange: PropTypes.func
}

export default QuestionContent