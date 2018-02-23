import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Modal, { ModalContent, ModalActions } from 'components/Modal'

export const Alert = ({ text, actions, open }) => {
  return (
    <Modal open={open}>
      <ModalContent>
        <Typography variant="body1">
          {text}
        </Typography>
      </ModalContent>
      <ModalActions actions={actions} />
    </Modal>
  )
}

Alert.propTypes = {
  text: PropTypes.string,
  open: PropTypes.bool.isRequired,
  actions: PropTypes.array.isRequired
}

Alert.defaultProps = {
  text: 'You have un-saved changes. Do you want to exit and clear those save or save?',
  open: false
}

export default Alert