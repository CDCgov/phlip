import React from 'react'
import PropTypes from 'prop-types'
import Container, { Column, Row } from 'components/Layout'
import IconButton from 'components/IconButton'
import Avatar from 'components/Avatar'
import { getInitials } from 'utils/normalize'
import Typography from 'material-ui/Typography'
import ExpansionTextPanel from 'components/ExpansionTextPanel'

const flagColors = {
  1: '#2E7D32',
  2: '#CE4A00',
  3: '#D50000'
}

const checkQuestionFlag = (questionFlag, flagsComments) => {
  let sameUser = false, updatedItems = []
  updatedItems = flagsComments.map(item => {
    if ((questionFlag.raisedBy.userId === item.raisedBy.userId) && !item.hasOwnProperty('type')) {
      sameUser = true
      return { ...item, ...questionFlag }
    } else {
      return item
    }
  })

  if (sameUser) return updatedItems

  return [...updatedItems, { ...questionFlag }]
}

export const ValidationTable = props => {
  const { mergedUserQuestions, questionFlags, onOpenAlert, userImages } = props
  const hasFlagsComments = mergedUserQuestions.hasOwnProperty('flagsComments')
  const allFlags = hasFlagsComments
    ? questionFlags.length > 0
      ? checkQuestionFlag(questionFlags[0], mergedUserQuestions.flagsComments)
      : [...mergedUserQuestions.flagsComments]
    : [...questionFlags]

  return (
    allFlags.length > 0 &&
    <Container column style={{ padding: '25px 25px 0 25px', flexBasis: 'auto', flexWrap: 'nowrap' }}>
      <Row style={{ paddingBottom: 10 }}>
        <Typography type="subheading" style={{ color: '#a7bdc6' }}>Flags and Comments</Typography>
      </Row>
      <Column displayFlex flex style={{ backgroundColor: '#f1f7f8', padding: 12 }}>
        {allFlags.map((item, i) => {
          return Object.keys(item).length > 0 &&
            <Row
              key={`flags-comments-${i}`} displayFlex style={{
                alignItems: 'center',
                backgroundColor: 'white',
                padding: 8,
                borderBottom: '1px solid lightgrey'
              }}>
              <Row displayFlex style={{ alignItems: 'center', paddingRight: 12, flexBasis: '30%', flexGrow: 1 }}>
                <Avatar
                  cardAvatar
                  style={{ marginRight: 10 }}
                  initials={getInitials(item.raisedBy.firstName, item.raisedBy.lastName)}
                  avatar={userImages[item.raisedBy.userId].avatar} />
                <Typography type="caption">{`${item.raisedBy.firstName} ${item.raisedBy.lastName}`}</Typography>
              </Row>
              <Row displayFlex flex style={{ flexBasis: '70%', overflow: 'hidden' }}>
                {item.type &&
                  <Row displayFlex flex style={{ alignItems: 'center', overflow: ' hidden' }}>
                    <Column style={{ paddingRight: 8 }}>
                      <IconButton
                        onClick={() => onOpenAlert(item.id, item.type)}
                        tooltipText="Clear this flag"
                        id="clear-flag"
                        aria-label="Clear this flag"
                        color={flagColors[item.type]}>flag</IconButton>
                    </Column>
                    <Row displayFlex flex style={{ alignItems: 'center', overflow: 'hidden' }}>
                      <Typography type="caption" style={{ fontWeight: 'bold' }}>
                        Reason for flag -<span>&nbsp;</span>
                      </Typography>
                      <ExpansionTextPanel
                        textProps={{ type: 'caption' }} text={item.notes} dropdownIconProps={{
                          tooltipText: 'Expand notes',
                          id: 'expand-flag-notes',
                          'aria-label': 'Expand notes'
                        }} />
                    </Row>
                  </Row>}
                {item.comment && item.type && <span style={{ paddingLeft: 30 }}></span>}
                {item.comment &&
                  <Row displayFlex flex style={{ alignItems: 'center', overflow: 'hidden' }}>
                    <Typography type="caption" style={{ fontWeight: 'bold' }}>
                      Comment -<span>&nbsp;</span>
                    </Typography>
                    <ExpansionTextPanel
                      textProps={{ type: 'caption' }}
                      text={item.comment}
                      dropdownIconProps={{
                        tooltipText: 'Expand comment',
                        id: 'expand-comment',
                        'aria-label': 'Expand comment'
                      }}
                    />
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