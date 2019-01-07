import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FileDocument, CalendarRange, Account, FormatSection } from 'mdi-material-ui'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import actions, { projectAutocomplete, jurisdictionAutocomplete } from '../../actions'
import ProJurSearch from './components/ProJurSearch'
import { convertToLocalDate } from 'utils/normalize'
import { Button, FlexGrid, Dropdown, DatePicker, IconButton, Alert, CircularLoader, ApiErrorAlert } from 'components'

export class DocumentMeta extends Component {
  static propTypes = {
    actions: PropTypes.object,
    document: PropTypes.object,
    uploading: PropTypes.bool,
    updating: PropTypes.bool,
    projectList: PropTypes.array,
    jurisdictionList: PropTypes.array,
    alertOpen: PropTypes.bool,
    alertTitle: PropTypes.string,
    alertText: PropTypes.string,
    projectSuggestions: PropTypes.array,
    jurisdictionSuggestions: PropTypes.array,
    projectSearchValue: PropTypes.string,
    jurisdictionSearchValue: PropTypes.string,
    noProjectError: PropTypes.any,
    inEditMode: PropTypes.bool,
    documentUpdateError: PropTypes.any,
    documentUpdatingInProgress: PropTypes.bool
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
      typeToDelete: '',
      projectToDelete: {},
      jurisdictionToDelete: {},
      alertOpen: false,
      alertInfo: {
        title: '',
        text: ''
      }
    }
  }

  showAddProjModal = () => {
    this.setState({
      projectSuggestions: [],
      showAddJurisdiction: false,
      showModal: true
    })
  }

  showAddJurModal = () => {
    this.setState({
      jurisdictionSuggestions: [],
      showAddJurisdiction: true,
      showModal: true
    })
  }

  onCloseModal = () => {
    this.setState({ showModal: false })
  }

  onChangeStatusField = selectedOption => {
    this.props.actions.updateDocumentProperty('status', selectedOption)
  }

  handleEdit = () => {
    this.props.actions.editDocument()
  }

  handleUpdate = () => {
    this.props.actions.updateDocRequest(null, null)
  }

  closeAlert = () => {
    this.props.actions.closeAlert()
  }

  /**
   * Handles when a user has updated a document property
   * @param propName
   * @param value
   */
  handleDocPropertyChange = (propName, value) => {
    this.props.actions.updateDocumentProperty(propName, value)
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

  handleShowDeleteConfirm = (type, index) => {
    const list = this.props[`${type}List`]

    this.setState({
      typeToDelete: type,
      [`${type}ToDelete`]: list[index],
      alertOpen: true,
      alertInfo: {
        title: `Delete ${type}`,
        text: `Are you sure you want to delete ${type}: ${list[index].name} from this document?`
      }
    })
  }

  addProJur = () => {
    if (this.state.selectedJurisdiction !== null) {
      this.props.actions.addProJur('jurisdictions', this.state.selectedJurisdiction)
      this.props.actions.updateDocRequest('jurisdictions', this.state.selectedJurisdiction)
      this.handleClearSuggestions('jurisdiction')
      this.props.actions.jurisdictionAutocomplete.clearAll()
    }

    if (this.state.selectedProject !== null) {
      this.props.actions.addProJur('projects', this.state.selectedProject)
      this.props.actions.updateDocRequest('projects', this.state.selectedProject)
      this.handleClearSuggestions('project')
      this.props.actions.projectAutocomplete.clearAll()
    }

    this.setState({
      showModal: false, selectedJurisdiction: null, selectedProject: null
    })
  }

  /**
   * Handles when the user cancels out of deleting a jurisdiction or project
   */
  onCancelDelete = () => {
    const { typeToDelete } = this.state

    this.setState({
      alertOpen: false,
      alertInfo: {},
      typeToDelete: '',
      [`${typeToDelete}ToDelete`]: {}
    })
  }

  onContinueDelete = () => {
    this.props.actions.deleteProJur(`${this.state.typeToDelete}s`, this.state[`${this.state.typeToDelete}ToDelete`])
    this.props.actions.updateDocRequest(null, null)
    this.onCancelDelete()
  }

  /**
   * Determines the text for the modal button at the bottom
   * @param text
   */
  getButtonText = text => {
    return this.props.uploading
      ? (<>
        <span style={{ marginRight: 5 }}>{text}</span>
        <CircularLoader thickness={5} style={{ height: 15, width: 15 }} />
        </>)
      : text
  }

  render() {
    const options = [
      { value: 'Draft', label: 'Draft' }, { value: 'Approved', label: 'Approved' }
    ]

    const cancelButton = {
      value: 'Cancel', type: 'button', otherProps: { 'aria-label': 'Close modal' }, onClick: this.onCloseModal
    }

    const modalAction = [
      cancelButton, {
        value: this.getButtonText('Update'),
        type: 'button',
        otherProps: { 'aria-label': 'Update' },
        onClick: this.addProJur,
        disabled: this.props.updating
      }
    ]

    const apiErrorActions = [
      {
        value: 'Close',
        type: 'button',
        onClick: this.closeAlert
      }
    ]

    const alertActions = [
      {
        value: 'Cancel',
        type: 'button',
        onClick: this.onCancelDelete
      },
      {
        value: 'Delete',
        type: 'button',
        onClick: this.onContinueDelete
      }
    ]

    const metaStyling = { fontSize: '.8125rem', padding: '0 5px' }
    const iconStyle = { color: '#757575', fontSize: 18 }
    const colStyle = { fontSize: 14, border: 'none', borderBottom: '1px solid green' }

    return (
      <>
        <ApiErrorAlert
          open={this.props.apiErrorOpen}
          actions={apiErrorActions}
          title={this.props.apiErrorInfo.title}
          content={this.props.apiErrorInfo.text}
        />
        <Alert open={this.state.alertOpen} actions={alertActions} title={this.state.alertTitle}>
          {this.state.alertInfo.text}
        </Alert>
        <FlexGrid raised container style={{ overflow: 'hidden', minWidth: '30%', marginBottom: 25, height: '40%' }}>
          <Typography variant="body2" style={{ padding: 10, color: 'black' }}>
            Document Information
          </Typography>
          <Divider />
          <FlexGrid container flex padding={15}>
            <FlexGrid container type="row" align="center" style={{ marginBottom: 20 }}>
              <FileDocument style={iconStyle} />
              <Typography variant="body1" style={metaStyling}>Status:</Typography>
              <Dropdown
                disabled={!this.props.inEditMode}
                name="selecteDocStatus"
                id="selectedDocStatus"
                options={options}
                input={{
                  value: this.props.document.status || 'Draft',
                  onChange: this.onChangeStatusField
                }}
                SelectDisplayProps={{ style: { paddingBottom: 3 } }}
                style={{ fontSize: 13 }}
                formControlStyle={{ minWidth: 180 }}
              />
            </FlexGrid>
            <FlexGrid container type="row" align="center" style={{ marginBottom: 20 }}>
              <FormatSection style={iconStyle} />
              <Typography variant="body1" style={metaStyling}>
                Citation:
              </Typography>
              {this.props.inEditMode
                ? (<input
                  style={colStyle}
                  defaultValue={this.props.document.citation}
                  onChange={e => this.handleDocPropertyChange('citation', e.target.value)}
                />)
                : <Typography style={metaStyling}>{this.props.document.citation}</Typography>}
            </FlexGrid>
            <FlexGrid container type="row" align="center" style={{ marginBottom: 20 }}>
              <CalendarRange style={iconStyle} />
              <Typography variant="body1" style={metaStyling}>
                Effective Date:
              </Typography>
              {this.props.inEditMode
                ? (<DatePicker
                  name="effectiveDate"
                  dateFormat="MM/DD/YYYY"
                  onChange={date => this.handleDocPropertyChange('effectiveDate', date.toISOString())}
                  value={this.props.document.effectiveDate}
                  autoOk={true}
                  InputAdornmentProps={{
                    disableTypography: true,
                    style: {
                      height: 19,
                      width: 19,
                      margin: 0,
                      marginRight: 15,
                      fontSize: 18,
                      alignItems: 'flex-end',
                      marginBottom: -8
                    }
                  }}
                  style={{ marginTop: 0 }}
                  inputProps={{ style: { fontSize: 13, padding: 0 } }}
                />)
                : (
                  <Typography>
                    {!this.props.document.effectiveDate
                      ? ''
                      : convertToLocalDate(this.props.document.effectiveDate.split('T')[0])}
                  </Typography>
                )}
            </FlexGrid>
            <FlexGrid container type="row" align="center" style={{ marginBottom: 20 }}>
              <Account style={iconStyle} />
              <Typography variant="body1" style={metaStyling}>
                {this.props.document.uploadedByName}
              </Typography>
            </FlexGrid>
            <FlexGrid container flex type="row" align="flex-end" justify="space-between">
              <Typography style={{ cursor: 'pointer' }} color="secondary">Delete Document</Typography>
              <Button
                value={this.props.inEditMode
                  ? 'Update'
                  : 'Edit'}
                size="small"
                color="accent"
                style={{ padding: '0 15px' }}
                onClick={this.props.inEditMode ? this.handleUpdate : this.handleEdit}
              />
            </FlexGrid>
          </FlexGrid>
        </FlexGrid>
        <FlexGrid
          raised
          container
          flex
          style={{ overflow: 'hidden', minWidth: '30%', height: '30%', marginBottom: 20 }}>
          <FlexGrid container type="row" align="center" justify="space-between" padding={10} style={{ minHeight: 32 }}>
            <Typography variant="body2" style={{ color: 'black' }}>
            Projects
            </Typography>
            <Button
              onClick={this.showAddProjModal}
              value="Add"
              size="small"
              style={{ backgroundColor: 'white', color: 'black' }}
              aria-label="Add jurisdiction to document"
            />
          </FlexGrid>
          <Divider />
          <FlexGrid type="row" padding={5} style={{ overflow: 'auto' }}>
            {this.props.projectList.map((item, index) => (
              <FlexGrid
                container
                type="row"
                justify="space-between"
                align="center"
                key={`project-${index}`}
                style={{
                  padding: 8,
                  backgroundColor: index % 2 === 0
                    ? '#f9f9f9'
                    : 'white'
                }}>
                <Typography style={{ fontSize: '.8125rem' }}>
                  {item.name}
                </Typography>
                <IconButton
                  color="error"
                  onClick={() => this.handleShowDeleteConfirm('project', index)}>
                  delete_outline
                </IconButton>
              </FlexGrid>)
            )}
          </FlexGrid>
        </FlexGrid>
        <FlexGrid raised container flex style={{ overflow: 'hidden', minWidth: '30%', height: '30%' }}>
          <FlexGrid container type="row" align="center" justify="space-between" padding={10} style={{ minHeight: 32 }}>
            <Typography variant="body2" style={{ color: 'black' }}>
            Jurisdictions
            </Typography>
            <Button
              onClick={this.showAddJurModal}
              value="Add"
              size="small"
              style={{ backgroundColor: 'white', color: 'black' }}
              aria-label="Add jurisdiction to document"
            />
          </FlexGrid>
          <Divider />
          <FlexGrid flex padding={5} style={{ overflow: 'auto' }}>
            {this.props.jurisdictionList.map((item, index) => (
              <FlexGrid
                container
                type="row"
                justify="space-between"
                align="center"
                key={`jurisdiction-${index}`}
                style={{
                  padding: 8,
                  backgroundColor: index % 2 === 0
                    ? '#f9f9f9'
                    : 'white'
                }}>
                <Typography style={{ fontSize: '.8125rem' }}>
                  {item.name}
                </Typography>
                <IconButton
                  color="error"
                  onClick={() => this.handleShowDeleteConfirm('jurisdiction', index)}>
                  delete_outline
                </IconButton>
              </FlexGrid>)
            )}
          </FlexGrid>
          <Modal onClose={this.onCloseModal} open={this.state.showModal} maxWidth="md" hideOverflow={false}>
            {this.props.alertOpen &&
            <Alert actions={this.state.alertActions} open={this.props.alertOpen} title={this.props.alertTitle}>
              {this.props.alertText}
            </Alert>}
            <ModalTitle title={this.state.showAddJurisdiction ? 'Assign Jurisdiction' : 'Assign Project'} />
            <Divider />
            <ModalContent style={{ display: 'flex', flexDirection: 'column', paddingTop: 24, width: 500, height: 275 }}>
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
                showJurSearch={this.state.showAddJurisdiction === true}
              />
            </ModalContent>
            <Divider />
            <ModalActions actions={modalAction} />
          </Modal>
        </FlexGrid>
      </>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const document = state.scenes.docView.inEditMode
    ? state.scenes.docView.documentForm
    : state.scenes.docView.document || { jurisdictions: [], projects: [], status: 1, effectiveDate: '' }

  return {
    document,
    projectList: document.projects.map(proj => {
      return state.data.projects.byId[proj] === undefined
        ? ''
        : { name: state.data.projects.byId[proj].name, id: proj }
    }),
    jurisdictionList: document.jurisdictions.map(jur => {
      return state.data.jurisdictions.byId[jur] === undefined
        ? ''
        : { name: state.data.jurisdictions.byId[jur].name, id: jur }
    }),
    projectSuggestions: state.scenes.docManage.upload.projectSuggestions.suggestions,
    jurisdictionSuggestions: state.scenes.docManage.upload.jurisdictionSuggestions.suggestions,
    projectSearchValue: state.scenes.docManage.upload.projectSuggestions.searchValue,
    jurisdictionSearchValue: state.scenes.docManage.upload.jurisdictionSuggestions.searchValue,
    inEditMode: state.scenes.docView.inEditMode,
    apiErrorInfo: state.scenes.docView.apiErrorInfo,
    apiErrorOpen: state.scenes.docView.apiErrorOpen || false
  }
}

const mapDispatchToProps = dispatch => ({
  actions: {
    ...bindActionCreators(actions, dispatch),
    projectAutocomplete: bindActionCreators(projectAutocomplete, dispatch),
    jurisdictionAutocomplete: bindActionCreators(jurisdictionAutocomplete, dispatch)
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(DocumentMeta)