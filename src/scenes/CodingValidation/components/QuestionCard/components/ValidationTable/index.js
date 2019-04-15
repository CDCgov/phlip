import React from 'react'
import PropTypes from 'prop-types'
import { IconButton, Avatar, ExpansionTextPanel, FlexGrid } from 'components'
import Typography from '@material-ui/core/Typography'

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
    <FlexGrid container padding="25px 0 0" style={{ flexBasis: 'auto', flexWrap: 'nowrap', margin: '0 10px' }}>
      <FlexGrid flex padding="0 0 10px 0">
        <Typography variant="subheading" style={{ color: '#a7bdc6' }}>Flags and Comments</Typography>
      </FlexGrid>
      <FlexGrid container flex padding={12} style={{ backgroundColor: '#f1f7f8' }}>
        {allFlags.map((item, i) => {
          const user = userImages[item.raisedBy.userId]
          return Object.keys(item).length > 0 &&
            <FlexGrid
              container
              type="row"
              key={`flags-comments-${i}`}
              align="center"
              padding={8}
              style={{
                backgroundColor: 'white',
                borderBottom: '1px solid lightgrey'
              }}>
              <FlexGrid
                container
                type="row"
                align="center"
                padding="0 12px 0 0"
                style={{ flexBasis: '30%', flexGrow: 1 }}>
                <Avatar
                  cardAvatar
                  style={{ marginRight: 10 }}
                  initials={user.initials}
                  userName={user.username}
                  avatar={user.avatar}
                />
                <Typography variant="caption">{user.username}</Typography>
              </FlexGrid>
              <FlexGrid container type="row" flex style={{ flexBasis: '70%', overflow: 'hidden' }}>
                {item.type &&
                <FlexGrid container type="row" align="center" flex style={{ overflow: ' hidden' }}>
                  <FlexGrid padding="0 8px 0 0">
                    <IconButton
                      onClick={() => onOpenAlert(item.id, item.type)}
                      tooltipText="Clear this flag"
                      id="clear-flag"
                      aria-label="Clear this flag"
                      color={flagColors[item.type]}>{item.type === 3 ? 'report' : 'flag'}
                    </IconButton>
                  </FlexGrid>
                  <FlexGrid container type="row" align="center" flex style={{ overflow: 'hidden' }}>
                    <Typography variant="caption" style={{ fontWeight: 'bold' }}>
                      Reason for flag -
                      <span>&nbsp;</span>
                    </Typography>
                    <ExpansionTextPanel
                      textProps={{ type: 'caption' }}
                      text={item.notes}
                      dropdownIconProps={{
                        tooltipText: 'Expand notes',
                        id: 'expand-flag-notes',
                        'aria-label': 'Expand notes'
                      }}
                    />
                  </FlexGrid>
                </FlexGrid>}
                {item.comment && item.type && <span style={{ paddingLeft: 30 }} />}
                {item.comment &&
                <FlexGrid container type="row" align="center" flex style={{ overflow: 'hidden' }}>
                  <Typography variant="caption" style={{ fontWeight: 'bold' }}>
                    Comment -
                    <span>&nbsp;</span>
                  </Typography>
                  <ExpansionTextPanel
                    style={{ zIndex: 1 }}
                    textProps={{ type: 'caption' }}
                    text={item.comment}
                    dropdownIconProps={{
                      tooltipText: 'Expand comment',
                      id: 'expand-comment',
                      'aria-label': 'Expand comment'
                    }}
                  />
                </FlexGrid>
                }
              </FlexGrid>
            </FlexGrid>
        })}
      </FlexGrid>
    </FlexGrid>
  )
}

ValidationTable.propTypes = {
  mergedUserQuestions: PropTypes.object,
  questionFlags: PropTypes.array,
  onOpenAlert: PropTypes.func,
  userImages: PropTypes.object
}

export default ValidationTable
