import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import { withStyles } from 'material-ui/styles'

const paper = {
  display: 'flex',
  flexDirection: 'column',
  flex: '0 1 auto',
  position: 'relative',
  maxHeight: '90vh',
  overflowY: 'auto', // Fix IE11 issue, to remove at some point.
  '&:focus': {
    outline: 'none'
  }
}

const classes = theme => ({
  paperNormal: {
    ...paper,
    margin: theme.spacing.unit * 4,
  },
  hideOverflow: {
    ...paper,
    margin: theme.spacing.unit * 4,
    overflowY: 'hidden',
    width: '100%',
    height: '100%'
  }
})

const Modal = ({ open, onClose, children, classes, hideOverflow, ...otherProps }) => (
  <Dialog open={open} onClose={onClose} {...otherProps}
          classes={{ paper: hideOverflow ? classes.hideOverflow : classes.paperNormal }}>
    {children}
  </Dialog>
)

Modal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node
}

Modal.defaultProps = {
  open: true,
  hideOverflow: false
}

export default withStyles(classes)(Modal)
export { default as ModalTitle } from './ModalTitle'
export { default as ModalActions } from './ModalActions'
export { default as ModalContent } from './ModalContent'