import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FlexGrid from 'components/FlexGrid'
import PageHeader from 'components/PageHeader'
import DocList from './components/DocList'
import SearchBox from './components/SearchBox'
import actions, { projectAutocomplete, jurisdictionAutocomplete } from './actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Route } from 'react-router-dom'
import Upload from './scenes/Upload'

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
    allSelected: PropTypes.bool
  }

  constructor(props, context) {
    super(props, context)
  }

  state = {
      showSearchBox : false,
      searchSubmit : false,
      projectSuggestionsValue : {},
      jurisdictionSuggestionValue : {},
      docNameSearchValue : 'doc1',
      uploadedBySearchValue : '',
      uploadedDateSearchValue :'',

    }
  componentDidMount() {
    this.props.actions.getDocumentsRequest()
  }

  componentWillUnmount() {
    this.props.actions.projectAutocomplete.clearAll()
    this.props.actions.jurisdictionAutocomplete.clearAll()
  }

  /**
   * Get suggestions for some type of autocomplete search
   * @param suggestionType
   * @param searchString
   * @param index
   */
  handleGetSuggestions = (suggestionType, { value: searchString }, index = null) => {
    suggestionType === 'project'
      ? this.props.actions.projectAutocomplete.searchForSuggestionsRequest(searchString, '_MAIN')
      : this.props.actions.jurisdictionAutocomplete.searchForSuggestionsRequest(searchString, '_MAIN', index)
  }

  /**
   * When a user has chosen a suggestion from the autocomplete project or jurisdiction list
   */
  handleSuggestionSelected = (suggestionType) => (event, { suggestionValue }) => {
    suggestionType === 'project'
      // ? this.props.actions.projectAutocomplete.onSuggestionSelected(suggestionValue)
      // : this.props.actions.jurisdictionAutocomplete.onSuggestionSelected(suggestionValue)
        ? this.setState({projectSuggestionValue:suggestionValue})
        : this.setState({jurisdictionSuggestionValue:suggestionValue})
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

  handleSearchDocsChange = event => {
    this.props.actions.handleSearchFieldChange(event.target.value)
  }

    /**
     * Function called when the form is submitted, dispatches a redux action for updating or adding depending on state.
     *
     * @public
     * @param {Object} values
     */
    handleSearchSubmit = values => {
        this.setState({
            submitting: true
        })
    }

    onDocNameSearchChange = (searchValue) => {
        this.setState({docNameSearchValue:searchValue})
    };

    onUploadByChange = (searchValue) => {
        this.setState({uploadedBySearchValue: searchValue})
    }

    onUploadedDateChange = (searchValue) =>{
        this.setState({uploadedDateSearchValue: searchValue})
    };
    onShowSearchBox = () => {
        this.setState({showSearchBox : true})
    }

    onSearchSubmit = () => {
        this.setState({showSearchBox: false})
        this.setState({searchSubmit: true})
        console.log(this.state)
    }

    onSearchCancel = () => {
        this.setState({showSearchBox: false})
        this.props.actions.jurisdictionAutocomplete.clearAll()
        this.props.actions.projectAutocomplete.clearAll()
    }

  render() {
    return (
      <FlexGrid container flex padding="20px 30px">
        <FlexGrid container type='row' justify="space-between">
            <FlexGrid type='column' padding="20px">
                <PageHeader
                  pageTitle="Document Management"
                  protocolButton={false}
                  projectName=""
                  entryScene={true}
                  icon="description"
                  otherButton={{
                    isLink: true,
                    text: '+ Upload New',
                    path: '/docs/upload',
                    state: { modal: true },
                    props: { 'aria-label': 'Upload New Documents' },
                    show: true
                    }}
                />
            </FlexGrid>
            <FlexGrid flex style={{textAlign:'center'}}/>
            <FlexGrid flex style={{marginLeft:'auto',width:'30%'}} align="flex-end">
                <SearchBox
                      searchValue={this.props.searchValue}
                      projectSearchValue={this.props.projectSearchValue}
                      jurisdictionSearchValue={this.props.jurisdictionSearchValue}
                      docNameSearchValue = {this.state.docNameSearchValue}
                      uploadedBySearchValue = {this.state.uploadedBySearchValue}
                      uploadedDateSearchValue = {this.state.uploadedDateSearchValue}
                      projectSuggestions={this.props.projectSuggestions}
                      jurisdictionSuggestions={this.props.jurisdictionSuggestions}
                      onClearSuggestions={this.handleClearSuggestions}
                      onGetSuggestions={this.handleGetSuggestions}
                      onSearchValueChange={this.handleSearchValueChange}
                      onSuggestionSelected={this.handleSuggestionSelected}
                      onSearchDocs={this.handleSearchDocsChange}
                      onSearchSubmit={this.onSearchSubmit}
                      showSearchBox = {this.state.showSearchBox}
                      onShowSearchBox = {this.onShowSearchBox}
                      onSearchCancel = {this.onSearchCancel}
                      onDocNameSearchChange = {this.onDocNameSearchChange}
                      onUploadByChange = {this.onUploadByChange}
                      onUploadedDateChange = {this.onUploadedDateChange}

                  />
            </FlexGrid>
        </FlexGrid>
        <FlexGrid container flex raised>
          <DocList
            documents={this.props.documents}
            docCount={this.props.docCount}
            onChangePage={this.props.actions.handlePageChange}
            onChangeRows={this.props.actions.handleRowsChange}
            onSelectAllFiles={this.props.actions.handleSelectAll}
            onSelectOneFile={this.props.actions.handleSelectOneFile}
            allSelected={this.props.allSelected}
            page={this.props.page}
            rowsPerPage={this.props.rowsPerPage}
          />
        </FlexGrid>
        <Route path="/docs/upload" component={Upload} />
      </FlexGrid>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = state => {
  const docManage = state.scenes.docManage
  return {
    documents: docManage.main.documents.visible,
    docCount: docManage.main.documents.allIds.length,
    page: docManage.main.page,
    rowsPerPage: docManage.main.rowsPerPage,
    allSelected: docManage.main.allSelected,
    searchValue: docManage.main.searchValue,
    projectSuggestions: docManage.projectSuggestions.suggestions,
    jurisdictionSuggestions: docManage.jurisdictionSuggestions.suggestions,
    projectSearchValue: docManage.projectSuggestions.searchValue,
    jurisdictionSearchValue: docManage.jurisdictionSuggestions.searchValue,
    selectedJurisdiction: docManage.jurisdictionSuggestions.selectedSuggestion,
    selectedProject: docManage.projectSuggestions.selectedSuggestion,
    searchByProject: docManage.main.searchByProject,
    searchByJurisdiction: docManage.main.searchByJurisdiction,
    showSearchBox : false
  }
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  actions: {
    ...bindActionCreators(actions, dispatch),
    projectAutocomplete: bindActionCreators(projectAutocomplete, dispatch),
    jurisdictionAutocomplete: bindActionCreators(jurisdictionAutocomplete, dispatch)
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(DocumentManagement)