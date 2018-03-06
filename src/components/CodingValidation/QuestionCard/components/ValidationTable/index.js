import React from 'react'
import PropTypes from 'prop-types'
import Container, { Column, Row } from 'components/Layout'
import { TableBody, TableHead } from 'material-ui/Table'
import Table from 'components/Table'
import TableRow from 'components/TableRow'
import TableCell from 'components/TableCell'
import Icon from 'components/Icon'
import IconButton from 'components/IconButton'
import Avatar from 'components/Avatar'
import { getInitials } from 'utils/normalize'
import Typography from 'material-ui/Typography'
import { checkIfExists } from 'utils/codingSchemeHelpers'
import ExpansionTextPanel from 'components/ExpansionTextPanel'

const flagColors = {
  1: '#2cad73',
  2: '#fca63a',
  3: '#d90525'
}

export const ValidationTable = props => {
  const { mergedUserQuestions, questionFlags, onOpenAlert } = props
  const allFlags = [...mergedUserQuestions.flagsComments, ...questionFlags]

  return (
    allFlags.length > 0 &&
    <Container column style={{ padding: 20 }}>
      <Row style={{ paddingBottom: 10 }}><Typography type="title" style={{ color: '#a7bdc6' }}>
        Flags and Notes
      </Typography></Row>
      <Row displayFlex style={{ backgroundColor: '#f1f7f8', padding: 12 }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#fff' }}>
              <TableCell style={{ padding: '5px 15px' }}>User</TableCell>
              <TableCell>Question Comment</TableCell>
              <TableCell padding="none">Flag</TableCell>
              <TableCell>Reason For Flag</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allFlags.map((item, i) => {
              return (
                <TableRow key={`flag-${i}`}>
                  <TableCell
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '5px 12px'
                    }}>
                    <Avatar
                      cardAvatar
                      style={{ marginRight: 15 }}
                      initials={getInitials(item.raisedBy.firstName, item.raisedBy.lastName)}
                      avatarUrl={item.raisedBy.avatarUrl}
                    />
                    <Typography type="caption">{`${item.raisedBy.firstName} ${item.raisedBy.lastName}`}</Typography>
                  </TableCell>
                  <TableCell>
                    {item.comment && <ExpansionTextPanel textProps={{ type: 'caption' }} text={item.comment} />}
                  </TableCell>
                  <TableCell padding="none">
                    {item.type &&
                    <IconButton onClick={() => onOpenAlert(item.id)} color={flagColors[item.type]}>flag</IconButton>}
                  </TableCell>
                  <TableCell>
                    {item.type && <ExpansionTextPanel textProps={{ type: 'caption' }} text={item.notes} />}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Row>
    </Container>
  )
}

export default ValidationTable