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
    title: PropTypes.string
  }
  
  constructor(props, context) {
    super(props, context)
    
    this.state = {
      alertActions: [],
      showLoadingAlert: false
    }
  }
  
  componentDidMount() {
    this.prevTitle = document.title
    document.title = 'PHLIP - Upload Documents'
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.uploading && !this.props.uploading) {
      if (this.props.requestError !== null) {
        this.props.onSubmitError(this.props.requestError)
      } else if (this.props.goBack) {
        this.goBack()
      }
    }
    
    if (prevProps.infoRequestInProgress !== this.props.infoRequestInProgress) {
      if (!prevProps.infoRequestInProgress && this.props.infoRequestInProgress) {
        this.loadingAlertTimeout = setTimeout(this.showInfoLoadingAlert, 1000)
      } else {
        if (this.props.requestError !== null) {
          this.props.onSubmitError(this.props.requestError)
        }
        this.setState({
          showLoadingAlert: false
        })
        clearTimeout(this.loadingAlertTimeout)
      }
    }
    
    if (prevProps.uploading !== this.props.uploading) {
      if (!prevProps.uploading && this.props.uploading) {
        this.loadingAlertTimeout = setTimeout(this.showUploadLoadingAlert, 1000)
      } else {
        this.setState({
          showLoadingAlert: false
        })
        clearTimeout(this.loadingAlertTimeout)
      }
    }
  }
  
  componentWillUnmount() {
    document.title = this.prevTitle
    clearTimeout(this.loadingAlertTimeout)
  }
  
  /**
   * Determines whether or not the 'processing' alert should be shown
   */
  showInfoLoadingAlert = () => {
    if (!this.props.infoRequestInProgress) {
      clearTimeout(this.loadingAlertTimeout)
      this.setState({
        showLoadingAlert: false
      })
    } else {
      this.setState({
        showLoadingAlert: true
      })
    }
  }
  
  showUploadLoadingAlert = () => {
    if (!this.props.uploading) {
      clearTimeout(this.loadingAlertTimeout)
      this.setState({
        showLoadingAlert: false
      })
    } else {
      this.setState({
        showLoadingAlert: true
      })
    }
  }
  
  /**
   * Resets the alert actions and calls redux action to close alert
   */
  closeAlert = () => {
    this.props.actions.closeAlert()
    this.setState({ alertActions: [] })
  }
  
  /**
   * Closes main modal, and pushes '/docs' onto browser history
   * @public
   */
  onCloseModal = () => {
    if (this.props.selectedDocs.length > 0) {
      this.setState({
        alertActions: [
          {
            value: 'Continue',
            type: 'button',
            otherProps: { 'aria-label': 'Continue', 'id': 'uploadCloseContBtn' },
            onClick: this.goBack
          }
        ]
      }, () => this.props.actions.openAlert('Your unsaved changes will be lost.', 'Warning', 'basic'))
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
        `The number of files selected for upload has exceeded the limit of ${this.props.maxFileCount} files per upload. Please consider uploading files in smaller batches.`,
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
      
      this.props.infoSheetSelected
        ? this.props.actions.mergeInfoWithDocs(files)
        : this.props.actions.addSelectedDocs(files)
      
      this.props.actions.verifyFiles(files)
    }
  }
  
  /**
   * Creates a formData object to send to api to upload documents
   */
  onUploadFiles = () => {
    let fd = { files: [] }, md = {}, sd = []
    const formData = new FormData()
    formData.append('userId', this.props.user.id)
    formData.append('userFirstName', this.props.user.firstName)
    formData.append('userLastName', this.props.user.lastName)
    
    this.props.selectedDocs.map(doc => {
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
      sd = [...sd, md[doc.name.value]]
    })
    
    formData.append('metadata', JSON.stringify(md))
    this.props.actions.uploadDocumentsRequest(formData, sd)
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
        this.props.actions.projectAutocomplete.searchForSuggestionsRequest(searchString, '')
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
    const {
      selectedDocs, uploading, actions, invalidFiles, alert,
      projectSearchValue, projectSuggestions, jurisdictionSearchValue,
      jurisdictionSuggestions, noProjectError,
      infoSheetSelected, infoSheet
    } = this.props
    
    const { alertActions, showLoadingAlert } = this.state
    
    const closeButton = {
      value: 'Close',
      type: 'button',
      otherProps: { 'aria-label': 'Close modal', 'id': 'uploadCloseBtn' },
      onClick: this.onCloseModal
    }
    
    const modalActions = selectedDocs.length > 0
      ? [
        closeButton,
        {
          value: this.getButtonText('Upload'),
          type: 'button',
          otherProps: { 'aria-label': 'Upload', 'id': 'uploadFilesBtn' },
          onClick: this.onUploadFiles,
          disabled: uploading
        }
      ]
      : [closeButton]
    
    return (
      <Modal onClose={this.onCloseModal} open maxWidth="lg" hideOverflow>
        {alert.open &&
        <Alert
          actions={alertActions}
          onCloseAlert={this.closeAlert}
          closeButton={{ value: 'Dismiss' }}
          open={alert.open}
          title={alert.title}
          id="uploadAlert">
          <Typography variant="body1">
            {alert.text}
          </Typography>
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
        {showLoadingAlert &&
        <Alert open={showLoadingAlert} hideClose>
          <FlexGrid container align="center">
            <CircularLoader type="indeterminate" />
            <span style={{ paddingTop: 20 }}>
              {uploading ? 'Uploading documents' : 'Processing document'}... This could take a couple minutes...
            </span>
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
    maxFileCount: uploadState.maxFileCount || 20
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
