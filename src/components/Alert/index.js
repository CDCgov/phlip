import React from 'react'
import PropTypes from 'prop-types'
import Modal, { ModalContent, ModalActions, ModalTitle } from 'components/Modal'

/**
 * Popup modal alert
 */
export const Alert = ({ actions, open, title, children,id }) => {
  return (
    <Modal open={open} id={id}>
      {title !== null && <ModalTitle style={{ display: 'flex', alignItems: 'center' }} title={title} />}
      <ModalContent style={{ minWidth: 350 }}>
        {children}
      </ModalContent>
      <ModalActions actions={actions} />
    </Modal>
  )
}

Alert.propTypes = {
  /**
   * Whether the alert should be open (visible)
   */
  open: PropTypes.bool.isRequired,

  /**
   * Array of objects which are the Alert actions
   */
  actions: PropTypes.array.isRequired,

  /**
   * Title of the alert
   */
  title: PropTypes.any,

  /**
   * The body of the alert
   */
  children: PropTypes.any,
  /**
   * The id of the alert
   */
  id: PropTypes.string
}

Alert.defaultProps = {
  open: false,
  title: null
}

export default Alert