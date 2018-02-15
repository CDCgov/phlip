import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import ExpansionTextPanel from 'components/ExpansionTextPanel'
import Avatar from 'components/Avatar'
import Container, { Row, Column } from 'components/Layout'
import Divider from 'material-ui/Divider'
import { getInitials } from 'utils/normalize'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'

export const TextFieldQuestions = ({ mergedUserQuestions }) => {
  return (
    <Column flex displayFlex style={{ overflow: 'hidden' }}>
      {mergedUserQuestions.answers.map(answer => {
        return (
          <Fragment key={answer.id}>
            <Row displayFlex style={{ alignItems: 'center', paddingTop: 20, paddingBottom: 20 }}>
              <Avatar
                cardAvatar
                style={{ marginRight: 15 }}
                initials={getInitials(answer.firstName, answer.lastName)}
              />
              {/*<ExpansionTextPanel text={answer.textAnswer} />*/}
              <Paper elevation={0}>
                <Typography>{answer.textAnswer}</Typography>
              </Paper>
            </Row>
            <Divider />
          </Fragment>
        )
      })}
    </Column>
  )
}

export default TextFieldQuestions