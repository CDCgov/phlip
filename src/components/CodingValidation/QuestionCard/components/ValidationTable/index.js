import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Container, { Column, Row } from 'components/Layout'
import { TableBody, TableHead } from 'material-ui/Table'
import Table from 'components/Table'
import TableRow from 'components/TableRow'
import TableCell from 'components/TableCell'
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
  const hasFlagsComments = mergedUserQuestions.hasOwnProperty('flagsComments')
  const allFlags = hasFlagsComments ? [...mergedUserQuestions.flagsComments, ...questionFlags] : [...questionFlags]

  return (
    allFlags.length > 0 &&
    <Container flex column style={{ padding: 25, flexBasis: '50%' }}>
      <Row style={{ paddingBottom: 10 }}>
        <Typography type="subheading" style={{ color: '#a7bdc6' }}>Flags and Comments</Typography>
      </Row>
      <Column displayFlex flex style={{ backgroundColor: '#f1f7f8', padding: 12, overflow: 'auto' }}>
        {allFlags.map((item, i) => {
          return Object.keys(item).length > 0 &&
            <Row
              key={`flags-comments-${i}`}
              displayFlex
              style={{
                alignItems: 'center',
                backgroundColor: 'white',
                padding: 8,
                borderBottom: '1px solid lightgrey'
              }}
            >
              <Row displayFlex style={{ alignItems: 'center', paddingRight: 12, flexBasis: '30%', flexGrow: 1 }}>
                <Avatar
                  cardAvatar
                  style={{ marginRight: 10 }}
                  initials={getInitials(item.raisedBy.firstName, item.raisedBy.lastName)}
                  avatarUrl={item.raisedBy.avatarUrl}
                />
                <Typography type="caption">{`${item.raisedBy.firstName} ${item.raisedBy.lastName}`}</Typography>
              </Row>
              <Row displayFlex flex style={{ flexBasis: '70%', overflow: 'hidden' }}>
                {item.type &&
                <Row displayFlex flex style={{ alignItems: 'center', overflow:' hidden' }}>
                  <Column style={{ paddingRight: 8 }}>
                    <IconButton onClick={() => onOpenAlert(item.id, item.type)} color={flagColors[item.type]}>flag</IconButton>
                  </Column>
                  <Row displayFlex flex style={{ alignItems: 'center', overflow: 'hidden' }}>
                    <Typography type="caption" style={{ fontWeight: 'bold' }}>
                      Reason for flag -<span>&nbsp;</span>
                    </Typography>
                    <ExpansionTextPanel textProps={{ type: 'caption' }} text={item.notes} />
                  </Row>
                </Row>}
                {item.comment && item.type && <span style={{ paddingLeft: 30 }}></span>}
                {item.comment &&
                <Row displayFlex flex style={{ alignItems: 'center', overflow: 'hidden' }}>
                  <Typography type="caption" style={{ fontWeight: 'bold' }}>
                    Comment -<span>&nbsp;</span>
                  </Typography>
                  <ExpansionTextPanel textProps={{ type: 'caption' }} text={item.comment} />
                </Row>
                }
              </Row>
          </Row>
        })}
      </Column>
    </Container>
  )
}

export default ValidationTable