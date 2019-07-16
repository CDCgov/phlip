import React, { Component } from 'react'
import PropTypes from 'prop-types'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import { IconButton } from 'components'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import ListSection from './components/ListSection'

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
   * User is exporting validation or codebook
   */
  onChooseExport = (type, userId = null) => () => {
    const { onChooseExport } = this.props
    onChooseExport(type, userId)
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
            <ListSection
              onExpand={this.expand}
              sectionText="Coded Data - Numeric"
              expanded={expanded === 'numeric'}
              users={users}
              section="numeric"
              onExport={this.onChooseExport}
            />
            <ListSection
              onExpand={this.expand}
              sectionText="Coded Data - Text"
              expanded={expanded === 'text'}
              users={users}
              section="text"
              onExport={this.onChooseExport}
            />
          </List>
        </ModalContent>
        <ModalActions actions={actions} />
      </Modal>
    )
  }
}

export default ExportDialog
