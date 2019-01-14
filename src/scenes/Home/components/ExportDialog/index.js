import React from 'react'
import PropTypes from 'prop-types'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Icon from 'components/Icon'

export const ExportDialog = ({ onClose, onChooseExport, open }) => {
  const actions = [
    { value: 'Cancel', onClick: onClose, type: 'button', otherProps: { 'aria-label': 'Close modal' } },
  ]

  return (
    <Modal open={open} onClose={onClose}>
      <ModalTitle title="Choose export type"/>
      <Divider />
      <ModalContent style={{ minWidth: 400, padding: 0 }}>
        <List>
          <ListItem button onClick={() => onChooseExport('numeric')} style={{ paddingLeft: 25, paddingRight: 25 }}>
            <ListItemIcon><Icon style={{ color: 'black' }}>file_download</Icon></ListItemIcon>
            <ListItemText primary="Coded Data - Numeric" />
          </ListItem>
          <ListItem button onClick={() => onChooseExport('text')} style={{ paddingLeft: 25, paddingRight: 25 }}>
            <ListItemIcon><Icon style={{ color: 'black' }}>file_download</Icon></ListItemIcon>
            <ListItemText primary="Coded Data - Text" />
          </ListItem>
          <ListItem button onClick={() => onChooseExport('codebook')} style={{ paddingLeft: 25, paddingRight: 25 }}>
            <ListItemIcon><Icon style={{ color: 'black' }}>file_download</Icon></ListItemIcon>
            <ListItemText primary="Codebook" />
          </ListItem>
        </List>
      </ModalContent>
      <ModalActions actions={actions} />
    </Modal>
  )
}

ExportDialog.propTypes = {
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
  open: PropTypes.bool
}

export default ExportDialog