import React from 'react'
import PropTypes from 'prop-types'
import { Avatar, FlexGrid, Icon, IconButton } from 'components'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Collapse from '@material-ui/core/Collapse'
import ListItemText from '@material-ui/core/ListItemText'

/**
 * Renders the expandable part for a export dialog list section
 * @param props
 * @returns {*}
 * @constructor
 */
export const ListSection = props => {
  const { users, section, expanded, sectionText, onExport, onExpand } = props
  const listItemStyle = { paddingTop: 8, paddingBottom: 8, fontSize: '.875rem' }
  const validatorUser = {
    avatarInfo: {
      initials: <Icon size={20} color="white" style={{ fontWeight: 800 }}>check</Icon>,
      style: { backgroundColor: '#80d134' },
      avatar: ''
    },
    userId: null,
    firstName: 'Validated',
    lastName: 'Codes'
  }
  const allUsers = [...users, validatorUser]
  
  return (
    <>
      <ListItem onClick={onExpand(section)} selected={expanded}>
        <ListItemText primary={sectionText} />
        <IconButton iconStyle={{ color: 'black' }}>
          {expanded ? 'expand_less' : 'expand_more'}
        </IconButton>
      </ListItem>
      <Collapse in={expanded}>
        <List component="div" disablePadding>
          {allUsers.map(user => {
            return (
              <ListItem key={`${section}-${user.userId}`} style={listItemStyle}>
                <FlexGrid container type="row" align="center" style={{ width: '100%' }}>
                  <Avatar small userId={user.userId} {...user.avatarInfo} />
                  <Typography style={{ flex: '1 1 auto', fontSize: '.875rem', padding: '0 16px' }}>
                    {`${user.firstName} ${user.lastName}`}
                  </Typography>
                  <IconButton iconStyle={{ color: 'black' }} onClick={onExport(section, user.userId)}>
                    file_download
                  </IconButton>
                </FlexGrid>
              </ListItem>
            )
          })}
        </List>
      </Collapse>
    </>
  )
}

ListSection.propTypes = {
  /**
   * Is this section expanded
   */
  expanded: PropTypes.bool,
  /**
   * List of users available for export
   */
  users: PropTypes.array,
  /**
   * String name of section (type of export)
   */
  section: PropTypes.string,
  /**
   * Section list header
   */
  sectionText: PropTypes.string,
  /**
   * User clicked the download button for a user or validator
   */
  onExport: PropTypes.func,
  /**
   * Expand or collapse section
   */
  onExpand: PropTypes.func
}

export default ListSection
