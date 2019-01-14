import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Row, Column } from 'components/Layout'
import Divider from 'material-ui/Divider'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import InputBox from 'components/InputBox'
import ValidationAvatar from 'components/ValidationAvatar'

export const TextFieldQuestions = props => {
  const {
    mergedUserQuestions, validator, validatorAnswer,
    onChange, answerId, style, userImages, disabled, question
  } = props

  return (
    <Fragment>
      <Column flex displayFlex style={{ overflow: 'auto', paddingLeft: style.paddingLeft }}>
        {mergedUserQuestions.answers.map((answer, index) =>
          <Fragment key={answer.id}>
            <Row displayFlex style={{ alignItems: 'center', paddingTop: 20, paddingBottom: 20, paddingRight: 5 }}>
              <ValidationAvatar
                answer={answer}
                avatar={userImages[answer.userId].avatar !== undefined
                  ? userImages[answer.userId].avatar
                  : ''}
                key={`user-answer-${index}`} />
              <Paper elevation={0} style={{ marginLeft: 20 }}>
                <Typography style={{ whiteSpace: 'pre-wrap' }}>{answer.textAnswer}</Typography>
              </Paper>
            </Row>
            <Divider />
          </Fragment>
        )}
      </Column>
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
      />
    </Fragment>
  )
}

export default TextFieldQuestions