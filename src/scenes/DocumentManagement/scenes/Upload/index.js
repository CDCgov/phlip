import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Divider from '@material-ui/core/Divider/Divider'
import actions from './actions'
import { Alert, withFormAlert, CircularLoader, Grid } from 'components'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import FileUpload from 'components/FileUpload'
import FileList from './components/FileList'
import ProJurSearch from './components/ProJurSearch'
import { hot } from 'react-hot-loader'

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
      ],
      showLoadingAlert: false
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

    if (prevProps.infoRequestInProgress !== this.props.infoRequestInProgress) {
      this.showLoadingAlert()
    }
  }

  showLoadingAlert = () => {
    if (this.props.infoRequestInProgress) {
      setTimeout(() => {
        this.setState({
          showLoadingAlert: true
        })
      }, 1000)
    } else {
      this.setState({
        showLoadingAlert: false
      })
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
      }, () => this.props.actions.openAlert('Your unsaved changes will be lost.'))
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
  addExcelFile = e => {
    const excelFile = e.target.files.item(0)
    const formData = new FormData()
    formData.append('file', excelFile, excelFile.name)
    this.props.actions.extractInfoRequest(formData, excelFile)
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
        jurisdictions: { searchValue: '', suggestions: [], name: '' }
      })
    })

    this.props.infoSheetSelected
      ? this.props.actions.mergeInfoWithDocs(files)
      : this.props.actions.addSelectedDocs(files)
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
        md[doc.name.value].jurisdictions = this.props.selectedJurisdiction.id
          ? [this.props.selectedJurisdiction.id]
          : [otherProps.jurisdictions.value.id]
        md[doc.name.value].projects = [this.props.selectedProject.id]
        fd.files = [...fd.files, file]
      })

      formData.append('metadata', JSON.stringify(md))
      this.props.actions.uploadDocumentsRequest(formData)
    }
  }

  handleDocPropertyChange = (index, propName, value) => {
    this.props.actions.updateDocumentProperty(index, propName, value)
  }

  handleGetSuggestions = (suggestionType, { value: searchString }, index = null) => {
    suggestionType === 'project'
      ? this.props.actions.searchProjectListRequest(searchString)
      : this.props.actions.searchJurisdictionListRequest(searchString, index)
  }

  handleProjectSuggestionSelected = (event, { suggestionValue }) => {
    this.props.actions.onProjectSuggestionSelected(suggestionValue)
  }

  handleJurisdictionSuggestionSelected = (event, { suggestionValue }) => {
    this.props.actions.onJurisdictionSuggestionSelected(suggestionValue)
  }

  handleToggleEditMode = (index, property) => {
    this.props.actions.toggleRowEditMode(index, property)
  }

  /**
   * Determines the text for the modal button at the bottom
   * @param text
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
            ? (
              /*<>
                {this.props.alertText}. Duplicates are indicated by: <Icon color="#fc515a" size={20}>error</Icon>
              </>*/
              this.props.alertText
            )
            : this.props.alertText
          }
        </Alert>}
        {this.state.showLoadingAlert &&
        <Alert actions={[]} open={this.state.showLoadingAlert}>
          <CircularLoader type="indeterminate" />
          Processing document... This could take a second...
        </Alert>
        }
        <ModalTitle
          title="Upload Documents"
          buttons={
            this.props.selectedDocs.length > 0 &&
            <ProJurSearch
              jurisdictionSuggestions={this.props.jurisdictionSuggestions}
              projectSuggestions={this.props.projectSuggestions}
              onClearSuggestions={this.props.actions.clearSuggestions}
              onGetSuggestions={this.handleGetSuggestions}
              jurisdictionSearchValue={this.props.jurisdictionSearchValue}
              projectSearchValue={this.props.projectSearchValue}
              onSearchValueChange={this.props.actions.onSearchValueChange}
              onJurisdictionSelected={this.handleJurisdictionSuggestionSelected}
              onProjectSelected={this.handleProjectSuggestionSelected}
              showProjectError={this.props.noProjectError === true}
              showJurSearch={this.props.infoSheetSelected === false}
            />}
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
              containerText={this.props.infoSheetSelected
                ? `Selected file: ${this.props.infoSheet.name}`
                : 'or drag and drop here'}
            />
          </Grid>
          {this.props.selectedDocs.length > 0 &&
          <FileList
            selectedDocs={this.props.selectedDocs}
            handleDocPropertyChange={this.handleDocPropertyChange}
            handleRemoveDoc={this.props.actions.removeDoc}
            onGetSuggestions={this.handleGetSuggestions}
            jurisdictionSuggestions={this.props.jurisdictionSuggestions}
            toggleRowEditMode={this.handleToggleEditMode}
            onClearSuggestions={this.props.actions.clearRowJurisdictionSuggestions}
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
        <Divider />
        <ModalActions actions={modalActions} />
      </Modal>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = state => {
  const uploadState = state.scenes.docManage.upload
  return {
    selectedDocs: uploadState.selectedDocs,
    requestError: uploadState.requestError,
    duplicateFiles: uploadState.duplicateFiles,
    uploading: uploadState.uploading,
    verifying: uploadState.verifying,
    alertText: uploadState.alertText,
    alertOpen: uploadState.alertOpen,
    alertTitle: uploadState.alertTitle,
    goBack: uploadState.goBack,
    projectSuggestions: uploadState.projectSuggestions,
    jurisdictionSuggestions: uploadState.jurisdictionSuggestions,
    projectSearchValue: uploadState.projectSearchValue,
    jurisdictionSearchValue: uploadState.jurisdictionSearchValue,
    selectedJurisdiction: uploadState.selectedJurisdiction,
    selectedProject: uploadState.selectedProject,
    noProjectError: uploadState.noProjectError,
    isReduxForm: false,
    user: state.data.user.currentUser,
    infoRequestInProgress: uploadState.infoRequestInProgress,
    infoSheet: uploadState.infoSheet,
    infoSheetSelected: uploadState.infoSheetSelected
  }
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  actions: {
    ...bindActionCreators(actions, dispatch),
    resetFormError: bindActionCreators(actions.closeAlert, dispatch)
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(withFormAlert(Upload))