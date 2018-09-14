import React, { Component } from 'react'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import Typography from '@material-ui/core/Typography/Typography'
import Divider from '@material-ui/core/Divider/Divider'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from './actions'

export class Upload extends Component {
  constructor(props, context) {
    super(props, context)
  }

  /**
   * Closes main modal, and pushes '/docs' onto browser history
   * @public
   */
  onCloseModal = () => {
    this.props.history.push('/docs')
  }

  onUploadDocs = () => {

  }

  render() {
    const closeButton = {
      value: 'Close',
      type: 'button',
      otherProps: { 'aria-label': 'Close modal' },
      onClick: this.onCloseModal
    }

    const modalActions = this.props.selectedDocs.length > 0
      ? [closeButton, { value: 'Upload', type: 'button', otherProps: { 'aria-label': 'Upload' } }]
      : [closeButton]

    return (
      <Modal onClose={this.onCloseModal} open={true} maxWidth="md" hideOverflow>
        <ModalTitle
          title={
            <Typography variant="title">
              <span style={{ paddingRight: 10 }}>Upload Documents</span>
            </Typography>
          }
        />
        <Divider />
        <ModalContent style={{ display: 'flex', flexDirection: 'column' }}>

        </ModalContent>
        <ModalActions actions={modalActions} />
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  selectedDocs: state.scenes.docManage.upload.selectedDocs,
  uploadError: state.scenes.docManage.upload.uploadError,
  uploadedDocs: state.scenes.docManage.upload.uploadedDocs,
  uploading: state.scenes.docManage.upload.uploading
})

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(Upload)