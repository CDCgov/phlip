import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Avatar from 'components/Avatar'
import { Row, Column } from 'components/Layout'
import Divider from 'material-ui/Divider'
import { getInitials } from 'utils/normalize'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import InputBox from 'components/InputBox'

const userRow = answer => (
  <Fragment key={answer.id}>
    <Row displayFlex style={{ alignItems: 'center', paddingTop: 20, paddingBottom: 20, paddingRight: 5 }}>
      <Avatar
        cardAvatar
        style={{ marginRight: 15 }}
        initials={getInitials(answer.firstName, answer.lastName)}
      />
      <Paper elevation={0}>
        <Typography style={{ whiteSpace: 'pre-wrap' }}>{answer.textAnswer}</Typography>
      </Paper>
    </Row>
    <Divider />
  </Fragment>
)



export const TextFieldQuestions = ({ mergedUserQuestions, validator, validatorAnswer, onChange, answerId, currentUserInitials, style }) => {
  return (
    <Fragment>
      <Column flex displayFlex style={{ overflow: 'auto', paddingLeft: style.paddingLeft }}>
        {mergedUserQuestions.answers.map(userRow)}
      </Column>
      <InputBox
        rows="4"
        name="text-answer"
        onChange={onChange}
        placeholder="Enter answer"
        style={{ paddingLeft: style.paddingLeft }}
        validator={validator === undefined ? currentUserInitials : getInitials(validator.firstName, validator.lastName)}
        value={validatorAnswer}
        answerId={answerId}
        currentUserInitials={currentUserInitials}
        isValidation={true}
      />
    </Fragment>
  )
}

export default TextFieldQuestions