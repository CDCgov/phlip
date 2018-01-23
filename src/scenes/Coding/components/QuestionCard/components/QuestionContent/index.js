import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import InputBox from 'components/InputBox'
import RadioGroup from 'components/SelectionControls/RadioGroup'
import CheckboxGroup from 'components/SelectionControls/CheckboxGroup'

const QuestionContent = ({ question, userAnswer, onChange, onChangeTextAnswer }) => {
  return (
    <Fragment>
      {question.questionType === 1 && <RadioGroup choices={question.possibleAnswers} onChange={onChange} userAnswer={userAnswer} onChangePincite={onChangeTextAnswer} />}
      {question.questionType === 2 && <div></div>}
      {question.questionType === 3 && <CheckboxGroup choices={question.possibleAnswers} onChange={onChange} userAnswer={userAnswer} onChangePincite={onChangeTextAnswer}  />}
      {question.questionType === 4 && <RadioGroup choices={question.possibleAnswers} onChange={onChange} userAnswer={userAnswer} onChangePincite={onChangeTextAnswer}  />}
      {question.questionType === 5 && <InputBox name="text-answer" onChange={onChangeTextAnswer} placeholder="Enter answer" value={userAnswer.fieldValue} /> }
    </Fragment>
  )
}

QuestionContent.propTypes = {
  question: PropTypes.object,
  onChange: PropTypes.func
}

export default QuestionContent