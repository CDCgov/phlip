import React from 'react'
import PropTypes from 'prop-types'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog'
import Button from 'components/Button'

const Modal = ({ open, onClose, title, actions, children }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      {children}
    </DialogContent>
    <DialogActions>
      {actions.map(action => (
          <Button key={action.value} raised={false} value={action.value} type={action.type}
                  onClick={action.onClick} />
        )
      )}
    </DialogActions>
  </Dialog>
)

Modal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
  children: PropTypes.node
}

export default Modal
export { default as ModalTitle } from './ModalTitle'
export { default as ModalActions } from './ModalActions'
export { default as ModalContent } from './ModalContent'