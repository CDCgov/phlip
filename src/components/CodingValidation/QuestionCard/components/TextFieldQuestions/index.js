import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import ExpansionTextPanel from 'components/ExpansionTextPanel'
import Avatar from 'components/Avatar'
import Container, { Row, Column } from 'components/Layout'
import Divider from 'material-ui/Divider'
import { getInitials } from 'utils/normalize'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import InputBox from 'components/InputBox'

export const TextFieldQuestions = ({ mergedUserQuestions, validatorAnswer, onChange, answerId, currentUserInitials }) => {
  return (
    <Fragment>
      <Column flex displayFlex style={{ overflow: 'auto' }}>
      {mergedUserQuestions.answers.map(answer => {
        return (
          <Fragment key={answer.id}>
            <Row displayFlex style={{ alignItems: 'center', paddingTop: 20, paddingBottom: 20, paddingRight: 5 }}>
              <Avatar
                cardAvatar
                style={{ marginRight: 15 }}
                initials={getInitials(answer.firstName, answer.lastName)}
              />
              <Paper elevation={0}>
                <Typography>{answer.textAnswer}</Typography>
              </Paper>
            </Row>
            <Divider />
          </Fragment>
        )
      })}
      </Column>
      <Row displayFlex style={{ alignItems: 'center', paddingTop: 20, paddingBottom: 20, paddingRight: 20 }}>
        <Avatar cardAvatar style={{ marginRight: 15 }} initials={currentUserInitials} />
        <InputBox
          rows="4" name="text-answer" onChange={onChange} placeholder="Enter answer"
          value={validatorAnswer} answerId={answerId}
        />
      </Row>
    </Fragment>
  )
}

export default TextFieldQuestions