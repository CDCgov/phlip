import React from 'react'
import PropTypes from 'prop-types'
import Modal, { ModalContent, ModalActions, ModalTitle } from 'components/Modal'

export const Alert = ({ actions, open, title, children }) => {
  return (
    <Modal open={open}>
      {title !== null && <ModalTitle style={{ display: 'flex', alignItems: 'center' }} title={title} />}
      <ModalContent style={{ minWidth: 350 }}>
        {children}
      </ModalContent>
      <ModalActions actions={actions} />
    </Modal>
  )
}

Alert.propTypes = {
  open: PropTypes.bool.isRequired,
  actions: PropTypes.array.isRequired
}

Alert.defaultProps = {
  open: false
}

export default Alert