import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Route } from 'react-router-dom'
import Divider from '@material-ui/core/Divider'
import ProJurSearch from './components/BulkProJurSearch'
import { FlexGrid, CircularLoader, ApiErrorAlert, PageLoader, ApiErrorView, PageHeader } from 'components'
import actions, { projectAutocomplete, jurisdictionAutocomplete } from './actions'
import { projectAutocomplete as searchProjectAutocomplete } from './components/SearchBox/actions'
import DocList from './components/DocList'
import SearchBox from './components/SearchBox'
import ConfirmDocList from './components/ConfirmDocList'
import { checkIfMultiWord } from 'utils/commonHelpers'
import Upload from './scenes/Upload'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'

/**
 * DocumentManagement main scene component. This is the first view the user sees when they switch over to the
 * document management global menu item
 */
export class DocumentManagement extends Component {
  static propTypes = {
    /**
     * An array of document Ids
     */
    documents: PropTypes.array,
    /**
     * Total number of documents
     */
    docCount: PropTypes.number,
    /**
     * Currently selected number of rows to show per page
     */
    rowsPerPage: PropTypes.string,
    /**
     * Current page in table
     */
    page: PropTypes.number,
    /**
     * Redux actions
     */
    actions: PropTypes.object,
    /**
     * Whether or not the checkbox table header has been clicked, selecting all files
     */
    allSelected: PropTypes.bool,
    /**
     * Search value for document search box
     */
    searchValue: PropTypes.string,
    /**
     * Project autocomplete search value
     */
    projectSearchValue: PropTypes.string,
    /**
     * Jurisdiction autocomplete search value
     */
    jurisdictionSearchValue: PropTypes.string,
    /**
     * Project autocomplete suggestions
     */
    projectSuggestions: PropTypes.array,
    /**
     * Jurisdiction autocomplete suggestions
     */
    jurisdictionSuggestions: PropTypes.array,
    /**
     * List of selected documents
     */
    checkedDocs: PropTypes.array,
    /**
     * Number of selected documents
     */
    checkedCount: PropTypes.number,
    /**
     * Whether or not a bulk api action is in progress
     */
    bulkOperationInProgress: PropTypes.bool,
    /**
     * Whether or not api error is open
     */
    apiErrorOpen: PropTypes.bool,
    /**
     * Content to show in the api error alert
     */
    apiErrorInfo: PropTypes.object,
    /**
     * Current field by which to sort the table
     */
    sortBy: PropTypes.string,
    /**
     * Direction asc or desc the list is currently sorted
     */
    sortDirection: PropTypes.string,
    /**
     * Whether retrieving the documents request is in progress
     */
    getDocumentsInProgress: PropTypes.bool,
    /**
     * Browser location object
     */
    location: PropTypes.object,
    /**
     * Whether there is an error we need to show as a page error
     */
    pageError: PropTypes.string
  }
  
  constructor(props, context) {
    super(props, context)
    this.state = {
      showAddJurisdiction: false,
      showAddProject: false,
      showModal: false,
      selectedJurisdiction: null,
      selectedProject: null,
      projectSuggestions: [],
      jurisdictionSuggestions: [],
      hoveringOn: '',
      hoverIndex: null,
      modalTitle: '',
      bulkActionType: ''
    }
  }
  
  componentDidMount() {
    document.title = 'PHLIP - Document List'
    this.props.actions.getDocumentsRequest()
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.getDocumentsInProgress && !this.props.getDocumentsInProgress) {
      if (this.props.location.state !== undefined) {
        if (this.props.location.state.projectDefined) {
          let name = this.props.location.state.project.name
          if (checkIfMultiWord(name)) {
            name = `(${name})`
          }
          this.props.actions.handleSearchValueChange(`project:${name}`, {
            project: this.props.location.state.project,
            jurisdiction: {}
          })
          this.props.actions.handleFormValueChange('project', this.props.location.state.project)
          this.props.actions.searchProjectAutocomplete.onSuggestionSelected(this.props.location.state.project)
        }
      }
    }
    
    if (prevProps.bulkOperationInProgress && !this.props.bulkOperationInProgress) {
      if (!this.props.apiErrorOpen) {
        this.setState({
          showModal: false, selectedJurisdiction: null, selectedProject: null, bulkActionType: ''
        })
      }
    }
  }
  
  getButtonText = text => {
    return (
      <>
        {text}
        {this.props.bulkOperationInProgress &&
        <CircularLoader thickness={5} style={{ height: 15, width: 15, marginRight: 5 }} />
        }
      </>
    )
  }
  
  handleBulkAction = actionType => {
    this.props.actions.jurisdictionAutocomplete.clearAll()
    this.props.actions.projectAutocomplete.clearAll()
    if (actionType !== 'bulk') {
      this.setState({ showModal: true, bulkActionType: actionType })
      switch (actionType) {
        case 'deleteDoc' :
          this.setState({
            modalTitle: 'Delete', showAddJurisdiction: undefined
          })
          break
        case 'assignProject':
          this.setState({ modalTitle: 'Assign Project', showAddJurisdiction: false })
          break
        case 'assignJurisdiction':
          this.setState({ modalTitle: 'Assign Jurisdiction', showAddJurisdiction: true })
          break
        case 'approveDoc':
          this.setState({
            modalTitle: 'Approve', showAddJurisdiction: undefined
          })
          break
      }
    }
  }
  
  confirmValidation = bulkActionType => {
    switch (bulkActionType) {
      case 'deleteDoc':
        return this.props.checkedCount > 0
      case 'assignProject':
        return (this.state.selectedProject !== null) && this.props.checkedCount > 0
      case 'assignJurisdiction':
        return (this.state.selectedJurisdiction !== null) && this.props.checkedCount > 0
      case 'approveDoc':
        return this.props.checkedCount > 0
      default:
        return false
    }
  }
  
  handleSuggestionSelected = suggestionType => (event, { suggestionValue }) => {
    if (suggestionType === 'project') {
      this.setState({
        selectedProject: suggestionValue
      })
    } else {
      this.setState({
        selectedJurisdiction: suggestionValue
      })
    }
    
    this.handleClearSuggestions(suggestionType)
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
  handleSuggestionSelected = suggestionType => (event, { suggestionValue }) => {
    if (suggestionType === 'project') {
      this.setState({
        selectedProject: suggestionValue
      })
    } else {
      this.setState({
        selectedJurisdiction: suggestionValue
      })
    }
    
    this.handleClearSuggestions(suggestionType)
  }
  
  /**
   * When the search field value changes
   * @param suggestionType
   * @param value
   */
  handleSearchValueChange = (suggestionType, value) => {
    suggestionType === 'jurisdiction'
      ? this.props.actions.jurisdictionAutocomplete.updateSearchValue(value)
      : this.props.actions.projectAutocomplete.updateSearchValue(value)
  }
  
  /**
   * Clears autocomplete lists
   * @param suggestionType
   */
  handleClearSuggestions = suggestionType => {
    suggestionType === 'jurisdiction'
      ? this.props.actions.jurisdictionAutocomplete.clearSuggestions()
      : this.props.actions.projectAutocomplete.clearSuggestions()
  }
  
  /**
   * Alert to confirm bulk update / delete / approve of documents
   */
  handleBulkConfirm = () => {
    if (this.state.bulkActionType === 'deleteDoc') {
      this.props.actions.handleBulkDelete(this.props.checkedDocs)
    } else {
      let updateData = {}
      if (this.state.bulkActionType === 'approveDoc') { // update type is status
        updateData = {
          updateType: 'status'
        }
      } else { // update type is either projects or jurisdictions
        updateData = {
          updateType: this.state.showAddJurisdiction ? 'jurisdictions' : 'projects',
          updateProJur: this.state.showAddJurisdiction ? this.state.selectedJurisdiction : this.state.selectedProject
        }
      }
      this.props.actions.handleBulkUpdate(updateData, this.props.checkedDocs)
    }
  }
  
  /**
   * Closes alerts
   */
  closeAlert = () => {
    this.props.actions.closeAlert()
  }
  
  /**
   * Closes the autocomplete search modal
   */
  onCloseModal = () => {
    this.handleCloseProJurModal()
  }
  
  /**
   *
   */
  handleCloseProJurModal = () => {
    if (this.state.selectedJurisdiction !== null) {
      this.handleClearSuggestions('jurisdiction')
      this.props.actions.jurisdictionAutocomplete.clearAll()
    }
    
    if (this.state.selectedProject !== null) {
      this.handleClearSuggestions('project')
      this.props.actions.projectAutocomplete.clearAll()
    }
    
    this.setState({
      showModal: false, selectedJurisdiction: null, selectedProject: null, bulkActionType: ''
    })
  }
  
  render() {
    const {
      apiErrorOpen, apiErrorInfo, bulkOperationInProgress, getDocumentsInProgress, pageError, documents, docCount,
      actions, allSelected, page, rowsPerPage, checkedCount, sortBy, sortDirection, jurisdictionSearchValue,
      jurisdictionSuggestions, projectSearchValue, projectSuggestions, checkedDocs
    } = this.props
    
    const { bulkActionType, showModal, modalTitle, showAddJurisdiction } = this.state
    
    const cancelButton = {
      value: 'Cancel',
      type: 'button',
      otherProps: { 'aria-label': 'Close modal' },
      preferred: true,
      onClick: this.onCloseModal
    }
    
    const modalAction = [
      cancelButton, {
        value: this.getButtonText('Confirm'),
        type: 'button',
        otherProps: { 'aria-label': 'Confirm', 'id': 'bulkConfirmBtn' },
        onClick: this.handleBulkConfirm,
        disabled: bulkOperationInProgress || !this.confirmValidation(bulkActionType)
      }
    ]
    
    return (
      <>
        <ApiErrorAlert open={apiErrorOpen} content={apiErrorInfo.text} onCloseAlert={this.closeAlert} />
        <FlexGrid container flex padding="12px 20px 20px 20px">
          <PageHeader
            pageTitle="Document Management"
            protocolButton={false}
            projectName=""
            entryScene
            icon="description"
            otherButton={{
              isLink: true,
              text: 'Upload New',
              path: '/docs/upload',
              state: { modal: true },
              props: { 'aria-label': 'Upload New Documents', 'id': 'uploadNewBtn' },
              show: true
            }}>
            <SearchBox />
          </PageHeader>
          {getDocumentsInProgress ?
            <PageLoader circularLoaderProps={{ color: 'primary', size: 50 }} />
            : <FlexGrid container flex raised>
              {pageError === '' && <DocList
                documents={documents}
                docCount={docCount}
                onChangePage={actions.handlePageChange}
                onChangeRows={actions.handleRowsChange}
                onSelectAllFiles={actions.handleSelectAll}
                onSelectOneFile={actions.handleSelectOneFile}
                allSelected={allSelected}
                page={page}
                rowsPerPage={rowsPerPage}
                onBulkAction={this.handleBulkAction}
                allowDropdown={checkedCount > 0}
                sortBy={sortBy}
                sortDirection={sortDirection}
                handleSortRequest={actions.handleSortRequest}
              />}
              {pageError !== '' && <ApiErrorView error={pageError} />}
            </FlexGrid>
          }
          <Modal
            onClose={this.onCloseModal}
            open={showModal}
            maxWidth="md"
            hideOverflow={false}
            id="bulkConfirmBox">
            <ModalTitle title={modalTitle} />
            <Divider />
            <ModalContent
              style={{
                display: 'flex',
                flexDirection: 'column',
                paddingTop: 24,
                width: 500,
                height: 100
              }}>
              {showAddJurisdiction !== undefined ? (
                <>
                  <ProJurSearch
                    jurisdictionSuggestions={jurisdictionSuggestions}
                    projectSuggestions={projectSuggestions}
                    onClearSuggestions={this.handleClearSuggestions}
                    onGetSuggestions={this.handleGetSuggestions}
                    onSearchValueChange={this.handleSearchValueChange}
                    onSuggestionSelected={this.handleSuggestionSelected}
                    jurisdictionSearchValue={jurisdictionSearchValue}
                    projectSearchValue={projectSearchValue}
                    showJurSearch={showAddJurisdiction}
                  />
                  <br />
                  <ConfirmDocList docCount={checkedCount} />
                </>
              ) : <ConfirmDocList documents={checkedDocs} docCount={checkedCount} />
              }
            </ModalContent>
            <Divider />
            <ModalActions actions={modalAction} />
          </Modal>
          <Route path="/docs/upload" component={Upload} />
        </FlexGrid>
      </>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = state => {
  const docManage = state.scenes.docManage
  return {
    documents: docManage.main.documents.visible,
    checkedDocs: docManage.main.documents.checked,
    checkedCount: docManage.main.documents.checked.length,
    docCount: docManage.main.matchedDocs.length !== 0
      ? docManage.main.matchedDocs.length
      : docManage.main.documents.allIds.length,
    page: docManage.main.page,
    rowsPerPage: docManage.main.rowsPerPage,
    allSelected: docManage.main.allSelected,
    projectSuggestions: docManage.upload.projectSuggestions.suggestions,
    jurisdictionSuggestions: docManage.upload.jurisdictionSuggestions.suggestions,
    projectSearchValue: docManage.upload.projectSuggestions.searchValue,
    jurisdictionSearchValue: docManage.upload.jurisdictionSuggestions.searchValue,
    apiErrorInfo: docManage.main.apiErrorInfo,
    apiErrorOpen: docManage.main.apiErrorOpen || false,
    bulkOperationInProgress: docManage.main.bulkOperationInProgress || false,
    sortBy: docManage.main.sortBy,
    sortDirection: docManage.main.sortDirection,
    getDocumentsInProgress: docManage.main.getDocumentsInProgress || false,
    pageError: docManage.main.pageError
  }
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  actions: {
    ...bindActionCreators(actions, dispatch),
    projectAutocomplete: bindActionCreators(projectAutocomplete, dispatch),
    jurisdictionAutocomplete: bindActionCreators(jurisdictionAutocomplete, dispatch),
    searchProjectAutocomplete: bindActionCreators(searchProjectAutocomplete, dispatch)
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(DocumentManagement)
