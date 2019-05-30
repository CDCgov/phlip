import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Route } from 'react-router-dom'
import { FlexGrid, ApiErrorAlert, PageLoader, ApiErrorView, PageHeader } from 'components'
import actions, { projectAutocomplete, jurisdictionAutocomplete } from './actions'
import { projectAutocomplete as searchProjectAutocomplete } from './components/SearchBox/actions'
import DocList from './components/DocList'
import SearchBox from './components/SearchBox'
import { checkIfMultiWord } from 'utils/commonHelpers'
import Upload from './scenes/Upload'
import BulkModal from './components/BulkModal'

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
      showModal: false,
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
        this.onCloseModal()
      }
    }
  }
  
  /*
   * opens bulk action modal
   */
  handleBulkAction = actionType => {
    this.props.actions.jurisdictionAutocomplete.clearAll()
    this.props.actions.projectAutocomplete.clearAll()
    
    if (actionType !== 'bulk') {
      this.setState({ showModal: true, bulkActionType: actionType })
    }
  }

  /**
   * Get suggestions for some type of autocomplete search
   * @param suggestionType
   * @param searchString
   * @param index
   */
  handleGetSuggestions = (suggestionType, { value: searchString }, index = null) => {
    suggestionType === 'project'
      ? this.props.actions.projectAutocomplete.searchForSuggestionsRequest(searchString, '_BULK')
      : this.props.actions.jurisdictionAutocomplete.searchForSuggestionsRequest(searchString, '_BULK', index)
  }
  
  /**
   * When a user has chosen a suggestion from the autocomplete project or jurisdiction list
   */
  handleSuggestionSelected = suggestionType => (event, { suggestionValue }) => {
    suggestionType === 'project'
      ? this.props.actions.projectAutocomplete.onSuggestionSelected(suggestionValue)
      : this.props.actions.jurisdictionAutocomplete.onSuggestionSelected(suggestionValue)
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
    const { bulkActionType } = this.state
    const { actions, selectedProject, selectedJurisdiction, checkedDocs } = this.props
    
    if (bulkActionType === 'delete') {
      actions.handleBulkDelete(checkedDocs)
    } else {
      let updateData = {}
      if (bulkActionType === 'approve') {
        updateData = {
          updateType: 'status'
        }
      } else {
        updateData = {
          updateType: `${bulkActionType}s`,
          updateProJur: bulkActionType === 'project' ? selectedProject : selectedJurisdiction
        }
      }
      actions.handleBulkUpdate(updateData, checkedDocs)
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
    if (this.state.bulkActionType === 'jurisdiction') {
      this.handleClearSuggestions('jurisdiction')
      this.props.actions.jurisdictionAutocomplete.clearAll()
    }
  
    if (this.state.bulkActionType === 'project') {
      this.handleClearSuggestions('project')
      this.props.actions.projectAutocomplete.clearAll()
    }
    
    this.setState({
      showModal: false,
      bulkActionType: ''
    })
  }
  
  /**
   * Gets bulk action modal button props
   * @returns {{inProgress: DocumentManagement.props.bulkOperationInProgress, disabled: boolean}}
   */
  getButtonInfo = () => {
    const { bulkActionType } = this.state
    const { selectedProject, selectedJurisdiction, checkedCount, bulkOperationInProgress } = this.props
    
    let info = {
      disabled: false,
      inProgress: bulkOperationInProgress
    }
    
    switch (bulkActionType) {
      case 'delete':
      case 'approve':
        info.disabled = checkedCount === 0
        break
      case 'project':
        info.disabled = Object.keys(selectedProject).length === 0 || checkedCount === 0
        break
      case 'jurisdiction':
        info.disabled = Object.keys(selectedJurisdiction).length === 0 || checkedCount === 0
        break
      default:
        info.disabled = false
        break
    }
    
    return info
  }
  
  render() {
    const {
      apiErrorOpen, apiErrorInfo, getDocumentsInProgress, pageError, documents, docCount,
      actions, allSelected, page, rowsPerPage, checkedCount, sortBy, sortDirection, jurisdictionSearchValue,
      jurisdictionSuggestions, projectSearchValue, projectSuggestions
    } = this.props
    
    const { bulkActionType, showModal } = this.state
    
    const suggestionProps = {
      suggestions: bulkActionType === 'project' ? projectSuggestions : jurisdictionSuggestions,
      searchValue: bulkActionType === 'project' ? projectSearchValue : jurisdictionSearchValue
    }
    
    return (
      <FlexGrid container flex padding="12px 20px 20px 20px">
        <ApiErrorAlert open={apiErrorOpen} content={apiErrorInfo.text} onCloseAlert={this.closeAlert} />
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
        <BulkModal
          open={showModal}
          onCloseModal={this.onCloseModal}
          bulkType={bulkActionType}
          onClearSuggestions={this.handleClearSuggestions}
          onGetSuggestions={this.handleGetSuggestions}
          onSearchValueChange={this.handleSearchValueChange}
          docCount={checkedCount}
          onSuggestionSelected={this.handleSuggestionSelected}
          onConfirmAction={this.handleBulkConfirm}
          buttonInfo={this.getButtonInfo()}
          {...suggestionProps}
        />
        <Route path="/docs/upload" component={Upload} />
      </FlexGrid>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = state => {
  const docManage = state.scenes.docManage.main
  return {
    documents: docManage.list.documents.visible,
    checkedDocs: docManage.list.documents.checked,
    checkedCount: docManage.list.documents.checked.length,
    docCount: docManage.list.matchedDocs.length !== 0
      ? docManage.list.matchedDocs.length
      : docManage.list.documents.allIds.length,
    page: docManage.list.page,
    rowsPerPage: docManage.list.rowsPerPage,
    allSelected: docManage.list.allSelected,
    apiErrorInfo: docManage.list.apiErrorInfo,
    apiErrorOpen: docManage.list.apiErrorOpen || false,
    bulkOperationInProgress: docManage.list.bulkOperationInProgress || false,
    sortBy: docManage.list.sortBy,
    sortDirection: docManage.list.sortDirection,
    getDocumentsInProgress: docManage.list.getDocumentsInProgress || false,
    pageError: docManage.list.pageError,
    projectSuggestions: docManage.projectSuggestions.suggestions,
    selectedProject: docManage.projectSuggestions.selectedSuggestion,
    projectSearchValue: docManage.projectSuggestions.searchValue,
    jurisdictionSuggestions: docManage.jurisdictionSuggestions.suggestions,
    jurisdictionSearchValue: docManage.jurisdictionSuggestions.searchValue,
    selectedJurisdiction: docManage.jurisdictionSuggestions.selectedSuggestion
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
