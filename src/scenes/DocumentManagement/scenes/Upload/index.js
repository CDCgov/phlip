import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Divider from '@material-ui/core/Divider/Divider'
import Typography from '@material-ui/core/Typography'
import actions, { projectAutocomplete, jurisdictionAutocomplete } from './actions'
import { Alert, withFormAlert, CircularLoader, FlexGrid, FileUpload, Button } from 'components'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import { Download } from 'mdi-material-ui'
import FileList from './components/FileList'
import ProJurSearch from './components/ProJurSearch'
import LinearProgress from '@material-ui/core/LinearProgress'

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
     * If the uploading request is in progress
     */
    uploading: PropTypes.bool,
    /**
     * If the verifying request is in progress
     */
    verifying: PropTypes.bool,
    /**
     * Alert information
     */
    alert: PropTypes.shape({
      open: PropTypes.bool,
      text: PropTypes.string,
      title: PropTypes.string,
      type: PropTypes.oneOf(['basic', 'files'])
    }),
    /**
     * Whoever is currently logged in
     */
    user: PropTypes.object,
    /**
     * Whether or not this form is using redux-form, needed for the withFormAlert HOC
     */
    isReduxForm: PropTypes.bool,
    /**
     * max number of files to be upload at one time
     */
    maxFileCount: PropTypes.number,
    /**
     * Redux actions
     */
    actions: PropTypes.object,
    onSubmitError: PropTypes.func,
    goBack: PropTypes.bool,
    infoRequestInProgress: PropTypes.bool,
    history: PropTypes.object,
    infoSheetSelected: PropTypes.bool,
    selectedJurisdiction: PropTypes.object,
    selectedProject: PropTypes.object,
    jurisdictionSuggestions: PropTypes.array,
    projectSuggestions: PropTypes.array,
    jurisdictionSearchValue: PropTypes.string,
    projectSearchValue: PropTypes.string,
    noProjectError: PropTypes.any,
    infoSheet: PropTypes.object,
    invalidFiles: PropTypes.array,
    title: PropTypes.string,
    uploadProgress: PropTypes.object
  }
  
  constructor(props, context) {
    super(props, context)
    
    this.state = {
      alertActions: [],
      closeButton: {}
    }
  }
  
  componentDidMount() {
    this.prevTitle = document.title
    document.title = 'PHLIP - Upload Documents'
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.infoRequestInProgress && !this.props.infoRequestInProgress) {
      if (this.props.requestError !== null) {
        this.props.onSubmitError(this.props.requestError)
      }
    }
  }
  
  componentWillUnmount() {
    document.title = this.prevTitle
  }
  
  /**
   * Resets the alert actions and calls redux action to close alert
   */
  closeAlert = () => {
    this.props.actions.closeAlert()
    this.setState({ alertActions: [], closeButton: {} })
  }
  
  /**
   * Closes main modal, and pushes '/docs' onto browser history
   * @public
   */
  onCloseModal = () => {
    if (this.props.selectedDocs.length > 0) {
      this.setState(
        {
          alertActions: [
            {
              value: 'Continue',
              type: 'button',
              otherProps: { 'aria-label': 'Continue', 'id': 'uploadCloseContBtn' },
              onClick: this.goBack
            }
          ],
          closeButton: { value: 'Cancel' }
        },
        () => this.props.actions.openAlert(
          'Your unsaved changes will be lost. Do you want to continue?',
          'Warning',
          'basic'
        )
      )
    } else {
      this.goBack()
    }
  }
  
  /**
   * Closes modal and goes back to main doc list
   */
  goBack = () => {
    this.props.history.push('/docs')
    this.props.actions.projectAutocomplete.clearAll()
    this.props.actions.jurisdictionAutocomplete.clearAll()
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
    if (e.target.files.length + this.props.selectedDocs.length > this.props.maxFileCount) {
      this.props.actions.openAlert(
        `The number of files selected for upload has exceeds the limit of ${this.props.maxFileCount} files per upload. Please consider uploading files in smaller batches.`,
        'Maximum Number of Files Exceeded',
        'basic'
      )
    } else {
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
      
      if (this.props.infoSheetSelected) {
        this.props.actions.setInfoRequestProgress()
        this.props.actions.mergeInfoWithDocs(files)
      } else {
        this.props.actions.addSelectedDocs(files)
      }
      
      this.props.actions.verifyFiles(files)
    }
  }
  
  /**
   * Creates a formData object to send to api to upload documents
   */
  onUploadFiles = () => {
    let md = {}, sd = []
    
    this.props.selectedDocs.map(doc => {
      md[doc.name.value] = Object.keys(doc).reduce((obj, prop) => {
        return {
          ...obj,
          [prop]: doc[prop].value
        }
      }, {})
      
      md[doc.name.value].jurisdictions = this.props.selectedJurisdiction.id
        ? [this.props.selectedJurisdiction.id]
        : [doc.jurisdictions.value.id]
      
      md[doc.name.value].projects = [this.props.selectedProject.id]
      sd = [...sd, md[doc.name.value]]
    })
    
    this.props.actions.uploadDocumentsStart(sd)
  }
  
  /**
   * Handles when a user has updated a document property in the file list
   * @param index
   * @param propName
   * @param value
   */
  handleDocPropertyChange = (index, propName, value) => {
    this.props.actions.updateDocumentProperty(index, propName, value)
  }
  
  /**
   * Get suggestions for some type of autocomplete search
   * @param suggestionType
   * @param searchString
   * @param index
   */
  handleGetSuggestions = (suggestionType, { value: searchString }, index = null) => {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      if (suggestionType === 'project') {
        searchString === ''
          ? this.props.actions.projectAutocomplete.getProjectsByUserRequest(this.props.user.id, 30)
          : this.props.actions.projectAutocomplete.searchForSuggestionsRequest(searchString, '')
      } else {
        this.props.actions.jurisdictionAutocomplete.searchForSuggestionsRequest(searchString, '', index)
      }
    }, 300)
  }
  
  /**
   * When a user has chosen a suggestion from the autocomplete project or jurisdiction list
   */
  handleSuggestionSelected = (suggestionType) => (event, { suggestionValue }) => {
    suggestionType === 'project'
      ? this.props.actions.projectAutocomplete.onSuggestionSelected(suggestionValue)
      : this.props.actions.jurisdictionAutocomplete.onSuggestionSelected(suggestionValue)
  }
  
  handleSearchValueChange = (suggestionType, value) => {
    suggestionType === 'jurisdiction'
      ? this.props.actions.jurisdictionAutocomplete.updateSearchValue(value)
      : this.props.actions.projectAutocomplete.updateSearchValue(value)
  }
  
  handleClearSuggestions = suggestionType => {
    suggestionType === 'jurisdiction'
      ? this.props.actions.jurisdictionAutocomplete.clearSuggestions()
      : this.props.actions.projectAutocomplete.clearSuggestions()
  }
  
  /**
   * Handles enabled or disabling edit mode on a row in the file list
   * @param index
   * @param property
   */
  handleToggleEditMode = (index, property) => {
    this.props.actions.toggleRowEditMode(index, property)
  }
  
  /**
   * Handles when a user wants to remove a document from the file list
   * @param index
   */
  removeDoc = index => {
    this.props.actions.removeDoc(index)
  }
  
  /**
   * Determines the text for the modal button at the bottom
   * @param text
   */
  getButtonText = text => {
    return (
      <>
        {text}
        {this.props.uploading && <CircularLoader thickness={5} style={{ height: 15, width: 15, marginLeft: 5 }} />}
      </>
    )
  }
  /**
   * Check if the mouse click event valid for this component.  if not valid, ignore event
   * @param e
   */
  
  onMouseDown = e => {
    if (['react-autowhatever-1', 'jurisdiction-form'].includes(e.target.id)) {
      e.preventDefault()
    }
  }
  
  closeUploadingAlert = () => {
    const { uploadProgress, actions } = this.props
    
    if (uploadProgress.failures) {
      actions.acknowledgeUploadFailures()
    } else {
      this.goBack()
    }
  }
  
  render() {
    const {
      selectedDocs, uploading, actions, invalidFiles, alert, projectSearchValue, projectSuggestions, infoSheet,
      jurisdictionSearchValue, jurisdictionSuggestions, noProjectError, infoSheetSelected, uploadProgress,
      infoRequestInProgress
    } = this.props
    
    const processingPercentage = (uploadProgress.index / uploadProgress.total) * 100
    const { alertActions, closeButton } = this.state
    
    const modalCloseButton = {
      value: 'Close',
      type: 'button',
      otherProps: { 'aria-label': 'Close modal', 'id': 'uploadCloseBtn' },
      onClick: this.onCloseModal
    }
    
    const modalActions = selectedDocs.length > 0
      ? [
        modalCloseButton,
        {
          value: this.getButtonText('Upload'),
          type: 'button',
          otherProps: { 'aria-label': 'Upload', 'id': 'uploadFilesBtn' },
          onClick: this.onUploadFiles,
          disabled: uploading
        }
      ]
      : [modalCloseButton]
    
    return (
      <Modal onClose={this.onCloseModal} open maxWidth="lg" hideOverflow>
        {alert.open &&
        <Alert
          actions={alertActions}
          onCloseAlert={this.closeAlert}
          closeButton={{ value: 'Dismiss', ...closeButton }}
          open={alert.open}
          title={alert.title}
          id="uploadAlert">
          <Typography variant="body1">{alert.text}</Typography>
          {alert.type !== 'basic' &&
          <FlexGrid type="row" style={{ overflow: 'auto', paddingTop: 20 }}>
            {invalidFiles.map((item, index) => {
              return (
                <FlexGrid
                  container
                  type="row"
                  justify="space-between"
                  align="center"
                  key={`doc-${index}`}
                  style={{
                    padding: 8,
                    backgroundColor: index % 2 === 0
                      ? '#f9f9f9'
                      : 'white',
                    minHeight: 24
                  }}>
                  <Typography style={{ fontSize: '.9125rem' }}>
                    {item.name}
                  </Typography>
                  {item.badSize && <Typography style={{ fontSize: '.9125rem' }}>
                    {(item.file.size / (1000 * 1000)).toFixed(1)} MB
                  </Typography>}
                </FlexGrid>
              )
            })}
          </FlexGrid>}
        </Alert>}
        
        {(uploading || infoRequestInProgress) &&
        <Alert
          open={(uploading || infoRequestInProgress)}
          hideClose={processingPercentage < 100}
          onCloseAlert={this.closeUploadingAlert}
          closeButton={{ value: 'Dismiss' }}>
          <FlexGrid container align="center">
            {!uploading && <span style={{ paddingBottom: 10 }}>
              {'Processing document... This could take a couple of minutes...'}
            </span>}
            {uploading && <span style={{ paddingBottom: 30 }}>
              {processingPercentage === 100
                ? !uploadProgress.failures
                  ? 'All documents successfully uploaded!'
                  : 'Some of the documents failed to upload. They are still present in the list if you want to retry.'
                : `Uploading document ${uploadProgress.index + 1} out of ${uploadProgress.total}`
              }
            </span>}
            {!uploading && <CircularLoader type="indeterminate" />}
            {uploading && <LinearProgress
              variant="determinate"
              value={processingPercentage}
              style={{ width: '100%', borderRadius: 6 }}
            />}
          </FlexGrid>
        </Alert>}
        <FlexGrid container type="row" align="center">
          <FlexGrid flex>
            <ModalTitle
              title="Upload Documents"
              buttons={
                selectedDocs.length > 0 &&
                <ProJurSearch
                  jurisdictionSuggestions={jurisdictionSuggestions}
                  projectSuggestions={projectSuggestions}
                  onClearSuggestions={this.handleClearSuggestions}
                  onGetSuggestions={this.handleGetSuggestions}
                  onSearchValueChange={this.handleSearchValueChange}
                  onSuggestionSelected={this.handleSuggestionSelected}
                  jurisdictionSearchValue={jurisdictionSearchValue}
                  projectSearchValue={projectSearchValue}
                  showProjectError={noProjectError === true}
                  showJurSearch={infoSheetSelected === false}
                  onMouseDown={this.onMouseDown}
                />}
            />
          </FlexGrid>
          <FlexGrid padding="0 24px 0 0">
            <Button color="white" style={{ color: 'black' }} href="/PHLIP-Upload-Template.xlsx" download>
              <Download style={{ fontSize: 18, marginRight: 10 }} /> Excel Template
            </Button>
          </FlexGrid>
        </FlexGrid>
        <Divider />
        <ModalContent style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <FlexGrid container type="row" align="center" justify="space-between" padding={10}>
            <FileUpload
              handleAddFiles={this.addFilesToList}
              allowedFileTypes=".doc,.docx,.pdf,.rtf,.odt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              allowMultiple
              numOfFiles={selectedDocs.length}
            />
            <FlexGrid padding={10} />
            <FileUpload
              handleAddFiles={this.addExcelFile}
              infoSheetSelected={infoSheetSelected}
              buttonText="Select excel file"
              containerBgColor="#f4f9ef"
              containerBorderColor="#c2e3b6"
              allowedFileTypes="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              containerText={infoSheetSelected
                ? `Selected file: ${infoSheet.name}`
                : 'or drag and drop here'}
              numOfFiles={infoSheetSelected ? 1 : 0}
            />
          </FlexGrid>
          {selectedDocs.length > 0 &&
          <FileList
            selectedDocs={selectedDocs}
            handleDocPropertyChange={this.handleDocPropertyChange}
            handleRemoveDoc={this.removeDoc}
            onGetSuggestions={this.handleGetSuggestions}
            jurisdictionSuggestions={jurisdictionSuggestions}
            toggleRowEditMode={this.handleToggleEditMode}
            onClearSuggestions={actions.clearRowJurisdictionSuggestions}
            invalidFiles={invalidFiles}
          />}
        </ModalContent>
        <Divider />
        <FlexGrid container type="row" align="center" justify="space-between" padding="0 0 0 20px">
          <Typography style={{ fontSize: '0.875rem' }}>
            File Count: {selectedDocs.length}
          </Typography>
          <ModalActions actions={modalActions} />
        </FlexGrid>
      </Modal>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = state => {
  const uploadState = state.scenes.docManage.upload
  return {
    selectedDocs: uploadState.list.selectedDocs,
    requestError: uploadState.list.requestError,
    uploading: uploadState.list.uploading,
    verifying: uploadState.list.verifying,
    alert: uploadState.list.alert,
    invalidFiles: uploadState.list.invalidFiles,
    goBack: uploadState.list.goBack,
    projectSuggestions: uploadState.projectSuggestions.suggestions,
    jurisdictionSuggestions: uploadState.jurisdictionSuggestions.suggestions,
    projectSearchValue: uploadState.projectSuggestions.searchValue,
    jurisdictionSearchValue: uploadState.jurisdictionSuggestions.searchValue,
    selectedJurisdiction: uploadState.jurisdictionSuggestions.selectedSuggestion,
    selectedProject: uploadState.projectSuggestions.selectedSuggestion,
    noProjectError: uploadState.list.noProjectError,
    isReduxForm: false,
    user: state.data.user.currentUser,
    infoRequestInProgress: uploadState.list.infoRequestInProgress,
    infoSheet: uploadState.list.infoSheet,
    infoSheetSelected: uploadState.list.infoSheetSelected,
    maxFileCount: uploadState.maxFileCount || 20,
    uploadProgress: uploadState.list.uploadProgress
  }
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  actions: {
    ...bindActionCreators(actions, dispatch),
    resetFormError: bindActionCreators(actions.closeAlert, dispatch),
    projectAutocomplete: bindActionCreators(projectAutocomplete, dispatch),
    jurisdictionAutocomplete: bindActionCreators(jurisdictionAutocomplete, dispatch)
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(withFormAlert(Upload))
