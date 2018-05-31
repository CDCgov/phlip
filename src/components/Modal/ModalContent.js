import React from 'react'
import PropTypes from 'prop-types'
import { DialogContent } from 'material-ui/Dialog'

/**
 * Wrapper for material-ui's DialogContent component
 */
export const ModalContent = ({ children, ...otherProps }) => {
  return (
    <DialogContent {...otherProps}>
      {children}
    </DialogContent>
  )
}

ModalContent.propTypes = {
  /**
   * Content of div
   */
  children: PropTypes.any
}


export default ModalContent