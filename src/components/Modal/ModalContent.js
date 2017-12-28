import React from 'react'
import PropTypes from 'prop-types'
import { DialogContent } from 'material-ui/Dialog'

const ModalContent = ({ children, ...otherProps }) => {
  return (
    <DialogContent {...otherProps}>
      { children }
    </DialogContent>
  )
}

export default ModalContent