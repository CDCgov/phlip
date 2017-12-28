import React from 'react'
import PropTypes from 'prop-types'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog'
import Button from 'components/Button'

const Modal = ({ open, onClose, children, ...otherProps }) => (
  <Dialog open={open} onClose={onClose} {...otherProps}>
    { children }
  </Dialog>
)

Modal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node
}

Modal.defaultProps = {
  open: true
}

export default Modal
export { default as ModalTitle } from './ModalTitle'
export { default as ModalActions } from './ModalActions'
export { default as ModalContent } from './ModalContent'