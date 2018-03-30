import React from 'react'
import { DialogContent } from 'material-ui/Dialog'

const ModalContent = ({ children, ...otherProps }) => {
  return (
    <DialogContent {...otherProps}>
      {children}
    </DialogContent>
  )
}

export default ModalContent