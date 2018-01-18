import React from 'react'
import PropTypes from 'prop-types'
import SelectionControls from 'components/SelectionControls'
import SimpleInput from 'components/SimpleInput'

const QuestionContent = ({ question, userAnswer, onChange, onChangePincite }) => {
  return (
    [1, 3, 4].includes(question.questionType)
      ? <SelectionControls
        type={question.questionType}
        choices={question.possibleAnswers}
        userAnswer={userAnswer}
        onChange={onChange}
        onChangePincite={onChangePincite}
      />
      : question.questionType === 5
      ? <SimpleInput onChange={onChange} value={userAnswer} />
      : <div></div>
  )
}

QuestionContent.propTypes = {
  question: PropTypes.object,
  onChange: PropTypes.func
}

export default QuestionContent