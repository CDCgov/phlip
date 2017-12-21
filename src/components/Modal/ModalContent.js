import React from 'react'
import PropTypes from 'prop-types'
import { DialogContent } from 'material-ui/Dialog'

const ModalContent = ({ children }) => {
  return (
    <DialogContent>
      { children }
    </DialogContent>
  )
}

export default ModalContent