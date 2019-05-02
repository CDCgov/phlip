import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { IconButton, Avatar, ExpansionTextPanel, FlexGrid, Icon } from 'components'
import Typography from '@material-ui/core/Typography'
import Collapse from '@material-ui/core/Collapse'
import theme from 'services/theme'

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

export class ValidationTable extends Component {
  state = {
    expanded: false
  }
  
  handleTogglePanel = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }
  
  render() {
    const { mergedUserQuestions, questionFlags, onOpenAlert, userImages } = this.props
    const { expanded } = this.state
    
    const hasFlagsComments = mergedUserQuestions.hasOwnProperty('flagsComments')
    const allFlags = hasFlagsComments
      ? questionFlags.length > 0
        ? checkQuestionFlag(questionFlags[0], mergedUserQuestions.flagsComments)
        : [...mergedUserQuestions.flagsComments]
      : [...questionFlags]
    
    return (
      <FlexGrid
        container
        padding={12}
        style={{
          flexBasis: 'auto',
          flexWrap: 'nowrap',
          backgroundColor: 'white',
          borderTop: `1px solid rgba(${0}, ${0}, ${0}, ${0.12})`
        }}>
        <FlexGrid
          container
          type="row"
          align="center"
          justify="space-between"
          onClick={this.handleTogglePanel}
          style={{ cursor: 'pointer' }}>
          <Typography variant="subheading" style={{ color: '#757575' }}>Flags and Comments</Typography>
          <Icon color="#757575">
            {expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
          </Icon>
        </FlexGrid>
        <Collapse in={expanded} style={{ marginTop: expanded ? 10 : 0 }}>
          <FlexGrid
            container
            //style={{ backgroundColor: '#f1f7f8' }}
            flex>
            {allFlags.map((item, i) => {
              const hasCommentAndFlag = item.type && item.comment
              const user = userImages[item.raisedBy.userId]
              return Object.keys(item).length > 0 &&
                <FlexGrid
                  container
                  type="row"
                  key={`flags-comments-${i}`}
                  align="center"
                  padding={8}
                  style={{ borderBottom: i === allFlags.length - 1 ? '' : '1px solid lightgrey' }}>
                  <FlexGrid
                    container
                    type="row"
                    align="center"
                    padding="0 12px 0 0"
                    style={{ flexBasis: '25%', flexGrow: 1 }}>
                    <Avatar
                      style={{ marginRight: 10 }}
                      initials={user.initials}
                      userName={user.username}
                      avatar={user.avatar}
                    />
                    <Typography variant="caption">{user.username}</Typography>
                  </FlexGrid>
                  <FlexGrid container type="row" flex style={{ flexBasis: '75%', overflow: 'hidden' }}>
                    {item.type &&
                    <FlexGrid container type="row" align="center" flex style={{ overflow: 'hidden', flexBasis: '35%' }}>
                      <FlexGrid padding="0 5px 0 0">
                        <IconButton
                          onClick={() => onOpenAlert(item.id, item.type)}
                          tooltipText="Clear this flag"
                          id="clear-flag"
                          iconSize={20}
                          aria-label="Clear this flag"
                          color={flagColors[item.type]}>
                          {item.type === 3 ? 'report' : 'flag'}
                        </IconButton>
                      </FlexGrid>
                      <FlexGrid container type="row" align="center" flex style={{ overflow: 'hidden' }}>
                        <Typography variant="caption" style={{ fontWeight: 'bold' }}>
                          Reason for flag -
                          <span>&nbsp;</span>
                        </Typography>
                        <ExpansionTextPanel
                          textProps={{ variant: 'caption' }}
                          text={item.notes}
                          dropdownIconProps={{
                            tooltipText: 'Expand notes',
                            id: 'expand-flag-notes',
                            'aria-label': 'Expand notes'
                          }}
                        />
                      </FlexGrid>
                    </FlexGrid>}
                    {hasCommentAndFlag && <span style={{ paddingLeft: 20 }} />}
                    {item.comment &&
                    <FlexGrid
                      container
                      type="row"
                      align="center"
                      justify={hasCommentAndFlag ? 'flex-end' : 'stretch'}
                      flex
                      style={{ overflow: 'hidden', flexBasis: '35%' }}>
                      <Typography variant="caption" style={{ fontWeight: 'bold' }}>
                        Comment -
                        <span>&nbsp;</span>
                      </Typography>
                      <ExpansionTextPanel
                        style={{ zIndex: 1 }}
                        textProps={{ variant: 'caption' }}
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
        </Collapse>
      </FlexGrid>
    )
  }
}

ValidationTable.propTypes = {
  mergedUserQuestions: PropTypes.object,
  questionFlags: PropTypes.array,
  onOpenAlert: PropTypes.func,
  userImages: PropTypes.object
}

export default ValidationTable
