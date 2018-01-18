import React from 'react'
import PropTypes from 'prop-types'
import SelectionControls from 'components/SelectionControls'
import SimpleInput from 'components/SimpleInput'

const QuestionContent = ({ question, onChange }) => {
  return (
    [1, 3, 4].includes(question.questionType)
      ? <SelectionControls type={question.questionType} choices={question.possibleAnswers} onChange={onChange} />
      : question.questionType === 5
        ? <SimpleInput onChange={onChange} value={{}} />
        : <div></div>
  )
}

QuestionContent.propTypes = {
  question: PropTypes.object,
  onChange: PropTypes.func
}

export default QuestionContent