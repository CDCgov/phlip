import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import { FlexGrid, IconButton, Avatar } from 'components'
import Collapse from '@material-ui/core/Collapse'
import Typography from '@material-ui/core/Typography'

/**
 * Renders a list of users for when a section on the list is expanded
 */
const UserList = ({ users, section, onClick, onExportValidation }) => {
  return (
    <List component="div" disablePadding>
      {users.map(user => {
        return (
          <ListItem key={`${section}-${user.userId}`} style={{ paddingTop: 8, paddingBottom: 8, fontSize: '.875rem' }}>
            <FlexGrid container type="row" align="center" style={{ width: '100%' }}>
              <Avatar small userId={user.userId} />
              <Typography style={{ flex: '1 1 auto', fontSize: '.875rem', padding: '0 16px' }}>
                {`${user.firstName} ${user.lastName}`}
              </Typography>
              <IconButton iconStyle={{ color: 'black' }} onClick={onClick(user, section)}>
                file_download
              </IconButton>
            </FlexGrid>
          </ListItem>
        )
      })}
    </List>
  )
}

export class ExportDialog extends Component {
  static propTypes = {
    /**
     * Function to call when the modal is closed
     */
    onClose: PropTypes.func,
    /**
     * Function to call when the user chooses an export type
     */
    onChooseExport: PropTypes.func,
    /**
     * Whether or not the modal is open
     */
    open: PropTypes.bool,
    /**
     * List of users on the project
     */
    users: PropTypes.array
  }
  
  state = {
    expanded: 0
  }
  
  onCloseModal = () => {
    const { onClose } = this.props
    this.setState({ expanded: 0 })
    onClose()
  }
  
  /**
   * Expands a dropdown section
   * @param section
   */
  expand = section => () => {
    const { expanded } = this.state
    this.setState({ expanded: expanded === section ? 0 : section })
  }
  
  /**
   * Export specific data for a user
   * @param userId
   * @param section
   */
  onClickUser = (userId, section) => () => {
    const { onChooseExport } = this.props
    onChooseExport(section, userId)
    this.setState({ expanded: 0 })
  }
  
  /**
   * User is exporting validation or codebook
   */
  onChooseExport = type => () => {
    const { onChooseExport } = this.props
    onChooseExport(type, null)
    this.setState({ expanded: 0 })
  }
  
  render() {
    const { open, users } = this.props
    const { expanded } = this.state
    
    const actions = [
      { value: 'Close', onClick: this.onCloseModal, type: 'button', otherProps: { 'aria-label': 'Close modal' } }
    ]
    
    return (
      <Modal open={open} onClose={this.onCloseModal} id="export-modal">
        <ModalTitle title="Choose export type" />
        <Divider />
        <ModalContent style={{ minWidth: 400, padding: 0 }}>
          <List>
            <ListItem>
              <ListItemText primary="Codebook" />
              <IconButton iconStyle={{ color: 'black' }} onClick={this.onChooseExport('codebook')}>
                file_download
              </IconButton>
            </ListItem>
            <ListItem onClick={this.expand('numeric')} selected={expanded === 'numeric'}>
              <ListItemText primary="Coded Data - Numeric" />
              <IconButton iconStyle={{ color: 'black' }}>
                {expanded === 'numeric' ? 'expand_less' : 'expand_more'}
              </IconButton>
            </ListItem>
            <Collapse in={expanded === 'numeric'}>
              <UserList
                users={users}
                section="numeric"
                onClick={this.onClickUser}
                onExportValidation={this.onChooseExport('numeric')}
              />
            </Collapse>
            <ListItem onClick={this.expand('text')} selected={expanded === 'text'}>
              <ListItemText primary="Coded Data - Text" />
              <IconButton iconStyle={{ color: 'black' }}>
                {expanded === 'text' ? 'expand_less' : 'expand_more'}
              </IconButton>
            </ListItem>
            <Collapse in={expanded === 'text'}>
              <UserList
                users={users}
                section="text"
                onClick={this.onClickUser}
                onExportValidation={this.onChooseExport('text')}
              />
            </Collapse>
          </List>
        </ModalContent>
        <ModalActions actions={actions} />
      </Modal>
    )
  }
}

export default ExportDialog
