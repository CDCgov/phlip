import React from 'react'
import PropTypes from 'prop-types'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Divider from 'material-ui/Divider'

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
          <ListItem button onClick={() => onChooseExport('stat')} style={{ paddingLeft: 25, paddingRight: 25 }}>
            <ListItemText primary="Statistical Data" />
          </ListItem>
          <ListItem button onClick={() => onChooseExport('nonstat')} style={{ paddingLeft: 25, paddingRight: 25 }}>
            <ListItemText primary="Non-statistical Data" />
          </ListItem>
        </List>
      </ModalContent>
      <ModalActions actions={actions} />
    </Modal>
  )
}

export default ExportDialog