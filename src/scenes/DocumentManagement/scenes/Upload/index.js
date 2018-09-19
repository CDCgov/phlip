import React, { Component } from 'react'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import Grid from 'components/Grid'
import Typography from '@material-ui/core/Typography/Typography'
import Divider from '@material-ui/core/Divider/Divider'
import FileRow from './components/FileRow'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from './actions'
import CircularLoader from 'components/CircularLoader'
import withFormAlert from 'components/withFormAlert'
import InputFileContainer from './components/InputFileContainer'
import Alert from 'components/Alert'

export class Upload extends Component {
  state = {
    alertActions: []
  }

  constructor(props, context) {
    super(props, context)

    this.inputDropRef = React.createRef()

    this.dismissAlertAction = {
      value: 'Close',
      type: 'button',
      otherProps: { 'aria-label': 'Close' },
      onClick: this.props.actions.closeAlert
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.uploading === true && this.props.uploading === false) {
      if (this.props.requestError !== null) {
        this.props.onSubmitError(this.props.requestError)
      } else if (this.props.goBack === true) {
        this.props.history.push('/docs')
      }
    }
  }

  /**
   * Closes main modal, and pushes '/docs' onto browser history
   * @public
   */
  onCloseModal = () => {
    if (this.props.selectedDocs.length > 0) {

      this.setState({
        alertActions: [
          this.dismissAlertAction,
          {
            value: 'Continue',
            type: 'button',
            otherProps: { 'aria-label': 'Continue' },
            onClick: this.goBack
          }
        ]
      }, () => this.props.actions.openAlert('Your unsaved changes will be lost.'))
    } else {
      this.goBack()
    }
  }

  goBack = () => {
    this.props.history.push('/docs')
    this.props.actions.clearSelectedFiles()
    this.props.actions.closeAlert()
  }

  initiateFileSelecter = () => {
    this.inputDropRef.current.click()
  }

  addFilesToList = (e) => {
    e.preventDefault()
    let files = []

    Array.from(Array(e.target.files.length).keys()).map(x => {
      const i = e.target.files.item(x)
      files.push({ name: i.name, lastModifiedDate: i.lastModifiedDate, tags: [], file: i })
    })

    this.props.actions.addSelectedDocs(files)
    this.props.actions.verifyUploadRequest(files)
  }

  onUploadFiles = () => {
    let fd = { files: [] }, md = {}
    const formData = new FormData()
    formData.append('userId', this.props.user.id)
    formData.append('userFirstName', this.props.user.firstName)
    formData.append('userLastName', this.props.user.lastName)

    this.props.selectedDocs.map((doc, i) => {
      const { file, ...otherProps } = doc
      formData.append('files', file, doc.name)
      md[doc.name] = otherProps
      fd.files = [...fd.files, file]
    })

    formData.append('metadata', JSON.stringify(md))
    this.props.actions.uploadDocumentsRequest(formData)
  }

  getButtonText = text => {
    return this.props.uploading
      ? (
        <>
          <span style={{ marginRight: 5 }}>{text}</span>
          <CircularLoader thickness={5} style={{ height: 15, width: 15 }} />
        </>
      )
      : <>{text}</>
  }

  render() {
    const closeButton = {
      value: 'Close',
      type: 'button',
      otherProps: { 'aria-label': 'Close modal' },
      onClick: this.onCloseModal
    }

    const modalActions = this.props.selectedDocs.length > 0
      ? [
        closeButton,
        {
          value: this.getButtonText('Upload'),
          type: 'button',
          otherProps: { 'aria-label': 'Upload' },
          onClick: this.onUploadFiles,
          disabled: this.props.uploading
        }
      ]
      : [closeButton]

    return (
      <Modal onClose={this.onCloseModal} open={true} maxWidth="lg" hideOverflow>
        <Alert actions={this.state.alertActions} open={this.props.alertOpen} title={this.props.alertTitle}>
          {this.props.alertText}
        </Alert>
        <ModalTitle
          title={
            <Typography variant="title">
              <span style={{ paddingRight: 10 }}>Upload Documents</span>
            </Typography>
          }
        />
        <Divider />
        <ModalContent style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <InputFileContainer
            handleAddFilesToList={this.addFilesToList}
            handleInitiateFileSelecter={this.initiateFileSelecter}
            inputRef={this.inputDropRef}
          />
          <Grid flex style={{ overflow: 'auto' }}>
            {this.props.selectedDocs.map((doc, i) => {
              return <FileRow
                key={`selectedDoc-${i}`}
                index={i}
                name={doc.name}
                tags={doc.tags}
                onAddTag={this.props.actions.addTag}
                onRemoveTag={this.props.actions.removeTag}
                onChangeProperty={this.props.actions.updateDocumentProperty}
                onRemoveDoc={this.props.actions.removeDoc}
              />
            })}
          </Grid>
        </ModalContent>
        <ModalActions actions={modalActions} />
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  selectedDocs: state.scenes.docManage.upload.selectedDocs,
  requestError: state.scenes.docManage.upload.requestError,
  uploadedDocs: state.scenes.docManage.upload.uploadedDocs,
  duplicateFiles: state.scenes.docManage.upload.duplicateFiles,
  uploading: state.scenes.docManage.upload.uploading,
  verifying: state.scenes.docManage.upload.verifying,
  alertText: state.scenes.docManage.upload.alertText,
  alertOpen: state.scenes.docManage.upload.alertOpen,
  alertTitle: state.scenes.docManage.upload.alertTitle,
  user: state.data.user.currentUser,
  isReduxForm: false
})

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(withFormAlert(Upload))