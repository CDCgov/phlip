import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Typography from '@material-ui/core/Typography/Typography'
import Divider from '@material-ui/core/Divider/Divider'
import actions from './actions'
import { Icon, Alert, withFormAlert, CircularLoader, Grid } from 'components'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import FileRow from './components/FileRow'
import FileUpload from 'components/FileUpload'
import FileList from './components/FileList'

/**
 * Upload documents modal component. In this modal the user can upload documents to the document management system
 */
export class Upload extends Component {

  static propTypes = {
    /**
     * Documents that the user has selected from the file selecter input modal
     */
    selectedDocs: PropTypes.array,

    /**
     * Any error that happened during a request, opens an alert with error
     */
    requestError: PropTypes.string,

    /**
     * Any files that came back from the verify upload request, meaning they already exist in the db
     */
    duplicateFiles: PropTypes.array,

    /**
     * If the uploading request is in progress
     */
    uploading: PropTypes.bool,

    /**
     * If the verifying request is in progress
     */
    verifying: PropTypes.bool,

    /**
     * Text to be shown in an alert modal
     */
    alertText: PropTypes.string,

    /**
     * Whether or not the alert modal should be open
     */
    alertOpen: PropTypes.bool,

    /**
     * Title of the alert modal
     */
    alertTitle: PropTypes.string,

    /**
     * Whoever is currently logged in
     */
    user: PropTypes.object,

    /**
     * Whether or not this form is using redux-form, needed for the withFormAlert HOC
     */
    isReduxForm: PropTypes.bool,

    /**
     * Redux actions
     */
    actions: PropTypes.object
  }

  constructor(props, context) {
    super(props, context)

    this.dismissAlertAction = {
      value: 'Close',
      type: 'button',
      otherProps: { 'aria-label': 'Close' },
      onClick: this.closeAlert
    }

    this.state = {
      alertActions: [
        this.dismissAlertAction
      ]
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.uploading === true && this.props.uploading === false) {
      if (this.props.requestError !== null) {
        this.props.onSubmitError(this.props.requestError)
      } else if (this.props.goBack === true) {
        this.goBack()
      }
    }
  }

  /**
   * Resets the alert actions and calls redux action to close alert
   */
  closeAlert = () => {
    this.props.actions.closeAlert()
    this.setState({
      alertActions: [
        this.dismissAlertAction
      ]
    })
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
      }, () => this.props.actions.openAlert('Your unsaved changes will be lost'))
    } else {
      this.goBack()
    }
  }

  /**
   * Closes modal and goes back to main doc list
   */
  goBack = () => {
    this.props.history.push('/docs')
    this.props.actions.clearSelectedFiles()
    this.props.actions.closeAlert()
  }

  /**
   * Adds an excel file to redux
   */
  addExcelFile = (e) => {
    const fr = new FileReader()
    fr.onload = (e) => {
      const text = fr.result
    }
    const excelFile = e.target.files.item(0)
    fr.readAsText(excelFile, excelFile.type)
    //this.props.actions.extractInfoRequest(excelFile)
  }

  /**
   * Adds selected files to redux, sends a request to verify the documents can be uploaded
   * @param e
   */
  addFilesToList = e => {
    let files = []

    Array.from(Array(e.target.files.length).keys()).map(x => {
      const i = e.target.files.item(x)
      files.push({
        name: i.name,
        lastModifiedDate: i.lastModifiedDate,
        tags: [],
        file: i,
        effectiveDate: '',
        citation: '',
        jurisdictions: []
      })
    })

    this.props.actions.addSelectedDocs(files)
    //this.props.actions.verifyUploadRequest(files)
  }

  /**
   * Creates a formData object to send to api to upload documents
   */
  onUploadFiles = () => {
    if (this.props.duplicateFiles.length > 0) {
      this.props.actions.openAlert(
        'There are still duplicate files selected. Please remove them from the list',
        'Remove duplicates'
      )
    } else {
      let fd = { files: [] }, md = {}
      const formData = new FormData()
      formData.append('userId', this.props.user.id)
      formData.append('userFirstName', this.props.user.firstName)
      formData.append('userLastName', this.props.user.lastName)

      this.props.selectedDocs.map((doc, i) => {
        const { file, ...otherProps } = doc
        formData.append('files', file.value, doc.name.value)
        md[doc.name.value] = Object.keys(otherProps).reduce((obj, prop) => {
          return {
            ...obj,
            [prop]: otherProps[prop].value
          }
        }, {})
        fd.files = [...fd.files, file]
      })

      formData.append('metadata', JSON.stringify(md))
      this.props.actions.uploadDocumentsRequest(formData)
    }
  }

  handleDocPropertyChange = (index, propName, value) => {
    this.props.actions.updateDocumentProperty(index, propName, value)
  }

  /**
   * Determines the text for the modal button at the bottom
   * @param text
   * @returns {*}
   */
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
        {this.props.alertOpen &&
        <Alert actions={this.state.alertActions} open={this.props.alertOpen} title={this.props.alertTitle}>
          {this.state.alertActions.length === 1
            ? <>
              {this.props.alertText}. Duplicates are indicated by: <Icon color="#fc515a" size={20}>error</Icon>
            </>
            : this.props.alertText
          }
        </Alert>}
        <ModalTitle
          title={
            <Typography variant="title">
              <span style={{ paddingRight: 10 }}>Upload Documents</span>
            </Typography>
          }
        />
        <Divider />
        <ModalContent style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Grid container type="row" align="center" justify="space-between" padding={10}>
            <FileUpload
              handleAddFiles={this.addFilesToList}
              allowedFileTypes=".doc,.docx,.pdf,.rtf,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              allowMultiple
            />
            <Grid padding={10} />
            <FileUpload
              handleAddFiles={this.addExcelFile}
              buttonText="Select excel file"
              containerBgColor="#f4f9ef"
              containerBorderColor="#c2e3b6"
              allowedFileTypes="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.csv,application/vnd.ms-excel"
            />
          </Grid>
          {this.props.selectedDocs.length > 0 &&
          <FileList
            selectedDocs={this.props.selectedDocs}
            handleDocPropertyChange={this.handleDocPropertyChange}
            handleRemoveDoc={this.props.actions.removeDoc}
            handleJurisdictionFetchRequest={this.props.actions.searchJurisdicationList}
            suggestions={this.props.suggestions}
          />
          }
          {/*this.props.selectedDocs.map((doc, i) => {
              return <FileRow
                key={`selectedDoc-${i}`}
                index={i}
                name={doc.name}
                tags={doc.tags}
                onAddTag={this.props.actions.addTag}
                onRemoveTag={this.props.actions.removeTag}
                onChangeProperty={this.props.actions.updateDocumentProperty}
                onRemoveDoc={this.props.actions.removeDoc}
                onRemoveDuplicate={this.props.actions.removeDuplicate}
                isDuplicate={this.props.duplicateFiles.find(file => file.name === doc.name) !== undefined}
              />
            })*/}
        </ModalContent>
        <ModalActions actions={modalActions} />
      </Modal>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  selectedDocs: state.scenes.docManage.upload.selectedDocs,
  requestError: state.scenes.docManage.upload.requestError,
  duplicateFiles: state.scenes.docManage.upload.duplicateFiles,
  uploading: state.scenes.docManage.upload.uploading,
  verifying: state.scenes.docManage.upload.verifying,
  alertText: state.scenes.docManage.upload.alertText,
  alertOpen: state.scenes.docManage.upload.alertOpen,
  alertTitle: state.scenes.docManage.upload.alertTitle,
  user: state.data.user.currentUser,
  goBack: state.scenes.docManage.upload.goBack,
  isReduxForm: false,
  suggestions: state.scenes.docManage.upload.suggestions
})

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  actions: {
    ...bindActionCreators(actions, dispatch),
    resetFormError: bindActionCreators(actions.closeAlert, dispatch)
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(withFormAlert(Upload))