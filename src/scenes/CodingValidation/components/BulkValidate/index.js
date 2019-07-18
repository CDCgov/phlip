import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FlexGrid } from 'components'
import Modal, { ModalActions, ModalContent, ModalTitle } from 'components/Modal'
import Divider from '@material-ui/core/Divider'
import Stepper from '@material-ui/core/Stepper'

export class BulkValidate extends Component {
  static propTypes = {
    open: PropTypes.bool,
    onConfirmValidate: PropTypes.func,
    onClose: PropTypes.func
  }
  
  render() {
    const { open, onConfirmValidate, onClose } = this.props
    
    return (
      <Modal open={open} onClose={onClose}>
        <ModalTitle>Validate</ModalTitle>
        <Divider />
        <ModalContent>
          <FlexGrid></FlexGrid>
        </ModalContent>
      </Modal>
    )
  }
}

export default BulkValidate
