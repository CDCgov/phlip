import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Divider from '@material-ui/core/Divider/Divider'
import actions, { projectAutocomplete, jurisdictionAutocomplete } from './actions'
import { Alert, withFormAlert, CircularLoader, Grid } from 'components'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import FileUpload from 'components/FileUpload'
import FileList from './components/FileList'
import ProJurSearch from './components/ProJurSearch'
import FlexGrid from 'components/FlexGrid'

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
    infoSheet: PropTypes.object
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
      if (prevProps.infoRequestInProgress === false && this.props.infoRequestInProgress === true) {
        this.loadingAlertTimeout = setTimeout(this.showInfoLoadingAlert, 1000)
      } else {
        clearTimeout(this.loadingAlertTimeout)
      }
    }

    if (prevProps.uploading !== this.props.uploading) {
      if (prevProps.uploading === false && this.props.uploading === true) {
        this.loadingAlertTimeout = setTimeout(this.showUploadLoadingAlert, 1000)
      } else {
        clearTimeout(this.loadingAlertTimeout)
      }
    }
  }

  componentWillUnmount() {
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
    suggestionType === 'project'
      ? this.props.actions.projectAutocomplete.searchForSuggestionsRequest(searchString, '')
      : this.props.actions.jurisdictionAutocomplete.searchForSuggestionsRequest(searchString, '', index)
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
   * @param isDuplicate
   */
  removeDoc = (index, isDuplicate) => {
    this.props.actions.removeDoc(index)
    if (isDuplicate) {
      this.props.actions.removeDuplicate(index)
    }
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
          {this.props.alertText}
        </Alert>}
        {this.state.showLoadingAlert &&
        <Alert actions={[]} open={this.state.showLoadingAlert}>
          <FlexGrid container align="center">
            <CircularLoader type="indeterminate" />
            <span style={{ paddingTop: 20 }}>
              {this.props.uploading
                ? 'Uploading documents'
                : 'Processing document'}... This could take a couple minutes...
            </span>
          </FlexGrid>
        </Alert>
        }
        <ModalTitle
          title="Upload Documents"
          buttons={
            this.props.selectedDocs.length > 0 &&
            <ProJurSearch
              jurisdictionSuggestions={this.props.jurisdictionSuggestions}
              projectSuggestions={this.props.projectSuggestions}
              onClearSuggestions={this.handleClearSuggestions}
              onGetSuggestions={this.handleGetSuggestions}
              onSearchValueChange={this.handleSearchValueChange}
              onSuggestionSelected={this.handleSuggestionSelected}
              jurisdictionSearchValue={this.props.jurisdictionSearchValue}
              projectSearchValue={this.props.projectSearchValue}
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
            handleRemoveDoc={this.removeDoc}
            onGetSuggestions={this.handleGetSuggestions}
            jurisdictionSuggestions={this.props.jurisdictionSuggestions}
            toggleRowEditMode={this.handleToggleEditMode}
            onClearSuggestions={this.props.actions.clearRowJurisdictionSuggestions}
            duplicateFiles={this.props.duplicateFiles}
          />
          }
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
    selectedDocs: uploadState.list.selectedDocs,
    requestError: uploadState.list.requestError,
    uploading: uploadState.list.uploading,
    verifying: uploadState.list.verifying,
    alertText: uploadState.list.alertText,
    alertOpen: uploadState.list.alertOpen,
    alertTitle: uploadState.list.alertTitle,
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
    duplicateFiles: uploadState.list.duplicateFiles
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