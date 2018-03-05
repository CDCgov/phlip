import React from 'react'
import PropTypes from 'prop-types'
import Container, { Column, Row } from 'components/Layout'
import { TableBody, TableHead } from 'material-ui/Table'
import Table from 'components/Table'
import TableRow from 'components/TableRow'
import TableCell from 'components/TableCell'
import Icon from 'components/Icon'
import Avatar from 'components/Avatar'
import { getInitials } from 'utils/normalize'
import Typography from 'material-ui/Typography'
import { checkIfExists } from 'utils/codingSchemeHelpers'

const flagColors = {
  1: '#2cad73',
  2: '#fca63a',
  3: '#d90525'
}

export const ValidationTable = props => {
  const { mergedUserQuestions, questionFlags } = props

  const hasFlags = mergedUserQuestions.hasOwnProperty('flag')
  const hasComments = mergedUserQuestions.hasOwnProperty('comment')
  const allFlags = [...mergedUserQuestions.flag, ...questionFlags]

  return (
    ((hasFlags && mergedUserQuestions.flag.length > 0) || (hasComments && mergedUserQuestions.comment.length > 0)) &&
    <Container column style={{ padding: 20 }}>
      <Row style={{ paddingBottom: 10 }}><Typography type="title" style={{ color: '#a7bdc6' }}>
        Flags and Notes
      </Typography></Row>
      <Row displayFlex style={{ backgroundColor: '#f1f7f8', padding: 12 }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#fff' }}>
              <TableCell>User</TableCell>
              <TableCell padding="none">Flag</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allFlags.map((flag, i) => {
              return (<TableRow key={`flag-${i}`}>
                <TableCell style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '5px 12px' }}>
                  <Avatar
                    cardAvatar
                    style={{ marginRight: 15 }}
                    initials={getInitials(flag.raisedBy.firstName, flag.raisedBy.lastName)}
                    avatarUrl={flag.raisedBy.avatarUrl}
                  />
                  <Typography type="caption">{`${flag.raisedBy.firstName} ${flag.raisedBy.lastName}`}</Typography>
                </TableCell>
                <TableCell padding="none">
                  <Icon color={flagColors[flag.type]}>flag</Icon>
                </TableCell>
                <TableCell>
                  <Typography type="caption">{flag.notes}</Typography>
                </TableCell>
              </TableRow>)}
            )}
          </TableBody>
        </Table>
      </Row>
    </Container>
  )
}

export default ValidationTable