import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PageHeader from 'components/PageHeader'
import DocList from './components/DocList'
import SearchBox from './components/SearchBox'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Route } from 'react-router-dom'
import Upload from './scenes/Upload'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import Divider from '@material-ui/core/Divider'
import ProJurSearch from './components/BulkProJurSearch'
import { FlexGrid, CircularLoader, ApiErrorAlert } from 'components'
import actions, { projectAutocomplete, jurisdictionAutocomplete } from './actions'
import ConfirmDocList from './components/ConfirmDocList'
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
    searchValue: PropTypes.string,
    projectSearchValue: PropTypes.string,
    jurisdictionSearchValue: PropTypes.string,
    projectSuggestions: PropTypes.array,
    jurisdictionSuggestions: PropTypes.array,
    documentUpdateInProgress: PropTypes.bool,
    checkedDocs : PropTypes.array,
    checkedCount: PropTypes.number,
    bulkOperationInProgress: PropTypes.bool,
    bulkActionExec : PropTypes.func,
    handleBulkDelete: PropTypes.func,
    handleBulkUpdate: PropTypes.func,
    apiErrorOpen: PropTypes.bool,
    apiErrorInfo: PropTypes.object

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
        alertOpen: false,
        alertInfo: {
            title: '',
            text: ''
        },
        modalTitle: '',
        bulkActionType: '',
    }
  }

  componentDidMount() {
    this.props.actions.getDocumentsRequest()
  }

  componentDidUpdate(prevProps, prevState) {
        if (prevProps.bulkOperationInProgress === true && this.props.bulkOperationInProgress === false) {
            if (this.props.apiErrorOpen){
                console.log('error detected')
            }
            else {
                console.log('no error')
                this.setState({showModal:false})
            }
        }
    }

  getButtonText = text => {
      return this.props.documentUpdateInProgress
        ? (<>
          <span style={{ marginRight: 5 }}>{text}</span>
          <CircularLoader thickness={5} style={{ height: 15, width: 15 }} />
      </>)
        : text
    }

  handleBulkAction = (actionType) => {
    this.setState({showModal:true, bulkActionType: actionType})
    switch (actionType) {
        case 'deleteDoc' :
          this.setState({
              modalTitle : 'Bulk Delete'
          })
          break
        case 'assignProject':
          this.setState({modalTitle: 'Bulk Assign Project',showAddJurisdiction: false})
            break
        case 'assignJurisdiction':
            this.setState({modalTitle: 'Bulk Assign Jurisdiction',showAddJurisdiction: true})
            break
    }
  };

  confirmValidation = (bulkActionType) => {
      switch(bulkActionType) {
          case 'deleteDoc':
              return this.props.checkedCount > 0
          case 'assignProject':
              return (this.state.selectedProject !==null) && this.props.checkedCount > 0
          case 'assignJurisdiction':
              return (this.state.selectedJurisdiction !==null) && this.props.checkedCount > 0
          default:
              return false
      }
  }

  handleSuggestionSelected = (suggestionType) => (event, { suggestionValue }) => {
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
    handleSuggestionSelected = (suggestionType) => (event, { suggestionValue }) => {
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

    handleBulkConfirm = () => {
        console.log('confirmed')
        if (this.state.bulkActionType ==='deleteDoc'){
            this.props.actions.handleBulkDelete(this.props.checkedDocs)
        }
        else {
            let updateData = {
                updateType : this.state.showAddJurisdiction?'jurisdictions':'projects',
                updateProJur : this.state.showAddJurisdiction?this.state.selectedJurisdiction:this.state.selectedProject
            }
            this.props.actions.handleBulkUpdate(updateData,this.props.checkedDocs)
        }
    }

    closeAlert = () => {
        this.props.actions.closeAlert()
    }

    onCloseModal = () => {
        this.handleCloseProJurModal()
    }

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
            showModal: false, selectedJurisdiction: null, selectedProject: null
        })
    }

    render() {
    const cancelButton = {
        value: 'Cancel', type: 'button', otherProps: { 'aria-label': 'Close modal' }, onClick: this.onCloseModal
    }
    const modalAction = [
            cancelButton, {
                value: this.getButtonText('Confirm'),
                type: 'button',
                otherProps: { 'aria-label': 'Confirm' },
                onClick: this.handleBulkConfirm,
                disabled: this.props.bulkOperationInProgress || !this.confirmValidation(this.state.bulkActionType)
            }
        ]

        return (
          <FlexGrid container flex padding="12px 20px 20px 20px">
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
          }}>
              <SearchBox />
            </PageHeader>
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
                onBulkAction= {this.handleBulkAction}
                allowDropdown={this.props.checkedCount > 0}
              />
            </FlexGrid>
            <Modal onClose={this.onCloseModal} open={this.state.showModal} maxWidth="lg" hideOverflow={false}>
              <ModalTitle title={this.state.modalTitle}  />
              <Divider />
              <ModalContent style={{ display: 'flex', flexDirection: 'column', paddingTop: 24, width: 600, height: 275 }}>
                {this.state.modalTitle !=='Bulk Delete'?(
                  <React.Fragment>
                    <ProJurSearch
                      jurisdictionSuggestions={this.props.jurisdictionSuggestions}
                      projectSuggestions={this.props.projectSuggestions}
                      onClearSuggestions={this.handleClearSuggestions}
                      onGetSuggestions={this.handleGetSuggestions}
                      onSearchValueChange={this.handleSearchValueChange}
                      onSuggestionSelected={this.handleSuggestionSelected}
                      jurisdictionSearchValue={this.props.jurisdictionSearchValue}
                      projectSearchValue={this.props.projectSearchValue}
                      showJurSearch={this.state.showAddJurisdiction === true}
                    />
                    <br />
                    <ConfirmDocList documents={this.props.checkedDocs} docCount={this.props.checkedCount} />
                  </React.Fragment>)
                :(
                  <ConfirmDocList documents={this.props.checkedDocs} docCount={this.props.checkedCount} />
                )}
              </ModalContent>
              <Divider />
              <ModalActions actions={modalAction} />
            </Modal>
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
    checkedDocs : docManage.main.documents.checked,
    checkedCount: docManage.main.documents.checked.length,
    docCount: docManage.main.documents.allIds.length,
    page: docManage.main.page,
    rowsPerPage: docManage.main.rowsPerPage,
    allSelected: docManage.main.allSelected,
    projectSuggestions: docManage.upload.projectSuggestions.suggestions,
    jurisdictionSuggestions: docManage.upload.jurisdictionSuggestions.suggestions,
    projectSearchValue: docManage.upload.projectSuggestions.searchValue,
    jurisdictionSearchValue: docManage.upload.jurisdictionSuggestions.searchValue,
    apiErrorInfo: docManage.main.apiErrorInfo,
    apiErrorOpen: docManage.main.apiErrorOpen || false,
    bulkOperationInProgress: docManage.main.bulkOperationInProgress || false
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