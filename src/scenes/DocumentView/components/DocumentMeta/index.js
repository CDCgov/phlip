import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FileDocument, CalendarRange, Account, FormatSection, FileUpload } from 'mdi-material-ui'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import actions, { projectAutocomplete, jurisdictionAutocomplete } from '../../actions'
import ProJurSearch from './components/ProJurSearch'
import { convertToLocalDate } from 'utils/normalize'
import { capitalizeFirstLetter } from 'utils/formHelpers'
import { Button, FlexGrid, Dropdown, DatePicker, IconButton, Alert, CircularLoader, ApiErrorAlert } from 'components'

export class DocumentMeta extends Component {
  static propTypes = {
    actions: PropTypes.object,
    document: PropTypes.object,
    uploading: PropTypes.bool,
    updating: PropTypes.bool,
    projectList: PropTypes.array,
    jurisdictionList: PropTypes.array,
    projectSuggestions: PropTypes.array,
    jurisdictionSuggestions: PropTypes.array,
    projectSearchValue: PropTypes.string,
    jurisdictionSearchValue: PropTypes.string,
    noProjectError: PropTypes.any,
    inEditMode: PropTypes.bool,
    documentUpdateInProgress: PropTypes.bool,
    documentDeleteInProgress: PropTypes.bool,
    documentDeleteError: PropTypes.any,
    goBack: PropTypes.func,
    apiErrorOpen: PropTypes.bool,
    apiErrorInfo: PropTypes.shape({ title: PropTypes.string, text: PropTypes.string }),
    id: PropTypes.string
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
      hoveringOn: '',
      hoverIndex: null,
      alertOpen: false,
      alertInfo: {
        title: '',
        text: ''
      },
      alertType: ''
    }
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.documentDeleteInProgress && !this.props.documentDeleteInProgress) {
      if (!this.props.documentDeleteError) {
        this.props.goBack()
      }
    }
    
    if (prevProps.documentUpdateInProgress && !this.props.documentUpdateInProgress) {
      if (!this.props.apiErrorOpen) {
        this.handleCloseProJurModal()
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
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      suggestionType === 'project'
        ? this.props.actions.projectAutocomplete.searchForSuggestionsRequest(searchString, '')
        : this.props.actions.jurisdictionAutocomplete.searchForSuggestionsRequest(searchString, '', index)
    }, 500)
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
        title: `Delete ${capitalizeFirstLetter(type)}`,
        text: `Do you want to delete ${type}: ${list[index].name} from this document?`
      },
      alertType: 'delete'
    })
  }
  
  handleShowDocDeleteConfirm = (type, id) => {
    this.setState({
      typeToDelete: type,
      [`${type}ToDelete`]: id,
      alertOpen: true,
      alertInfo: {
        title: 'Warning',
        text: `Do you want to delete ${this.props.document.name}? Deleting a document will remove all associated annotations for every project and jurisdiction.`
      }
    })
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
  
  addProJur = () => {
    if (this.state.showAddJurisdiction) {
      if (this.state.selectedJurisdiction !== null) {
        this.props.actions.addProJur('jurisdictions', this.state.selectedJurisdiction)
        this.props.actions.updateDocRequest('jurisdictions', this.state.selectedJurisdiction, 'add')
      } else {
        // should show an error message here
        this.setState({
          alertOpen: true,
          alertInfo: {
            title: 'Invalid Jurisdiction',
            text: `You must select a jurisdiction from the drop-down list`
          },
          alertType: 'projur'
        })
      }
    } else {
      if (this.state.selectedProject !== null) {
        this.props.actions.addProJur('projects', this.state.selectedProject)
        this.props.actions.updateDocRequest('projects', this.state.selectedProject, 'add')
      } else {
        // should show error message here
        this.setState({
          alertOpen: true,
          alertInfo: {
            title: 'Invalid Project',
            text: `You must select a project from the drop-down list`
          },
          alertType: 'projur'
        })
      }
    }
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
      [`${typeToDelete}ToDelete`]: {},
      alertType: ''
    })
  }

  /**
     * Handles when the user cancels out of deleting a jurisdiction or project
     */
  onCancelUpdateProJur = () => {
    this.setState({
      alertOpen: false,
      alertInfo: {},
      alertType: ''
    })
  }
  
  onContinueDelete = () => {
    if (this.state.typeToDelete === 'document') {
      this.props.actions.deleteDocRequest(this.props.document._id)
    } else {
      this.props.actions.deleteProJur(`${this.state.typeToDelete}s`, this.state[`${this.state.typeToDelete}ToDelete`])
      this.props.actions.updateDocRequest(
        `${this.state.typeToDelete}s`,
        this.state[`${this.state.typeToDelete}ToDelete`],
        'delete'
      )
    }
    this.onCancelDelete()
  }
  
  /**
   * Handles when a user hovers over a row in the jurisdiction or project card info
   * @param card
   * @param index
   */
  onToggleHover = (card, index) => () => {
    if (this.state.hoveringOn === true) {
      this.setState({
        hoveringOn: '',
        hoverIndex: null
      })
    } else {
      this.setState({
        hoveringOn: card,
        hoverIndex: index
      })
    }
  }
  
  /**
   * Determines the text for the modal button at the bottom
   * @param text
   */
  getButtonText = text => {
    return this.props.documentUpdateInProgress
      ? (<>
        <span style={{ marginRight: 5 }}>{text}</span>
        <CircularLoader thickness={5} style={{ height: 15, width: 15 }} />
        </>)
      : text
  }
  
  render() {
    const {
      documentUpdateInProgress, apiErrorInfo, apiErrorOpen, inEditMode, document, projectList, jurisdictionList,
      noProjectError, projectSearchValue, jurisdictionSearchValue, projectSuggestions, jurisdictionSuggestions
    } = this.props
    
    const {
      alertOpen, alertInfo, hoveringOn, hoverIndex, showModal, showAddJurisdiction, alertType
    } = this.state
    
    const options = [
      { value: 'Draft', label: 'Draft' }, { value: 'Approved', label: 'Approved' }
    ]
    
    const cancelButton = {
      value: 'Cancel',
      type: 'button',
      otherProps: { 'aria-label': 'Close modal' },
      onClick: this.onCloseModal,
      preferred: true
    }
    
    const modalAction = [
      cancelButton, {
        value: this.getButtonText('Update'),
        type: 'button',
        otherProps: { 'aria-label': 'Update' },
        onClick: this.addProJur,
        disabled: documentUpdateInProgress
      }
    ]
    
    const alertActions = [
      {
        value: 'Delete',
        type: 'button',
        onClick: this.onContinueDelete
      }
    ]

    const projurActions = [
      {
        value: 'Dismiss',
        type: 'button',
        onClick: this.onCancelUpdateProJur
      }
    ]
    
    const metaStyling = { fontSize: '.8125rem', padding: '0 5px' }
    const iconStyle = { color: '#757575', fontSize: 18 }
    const colStyle = { fontSize: 14, border: 'none', borderBottom: '1px solid green' }
    
    return (
      <>
        <ApiErrorAlert open={apiErrorOpen} content={apiErrorInfo.text} onCloseAlert={this.closeAlert} />
        <Alert open={alertOpen && alertType === 'delete'} actions={alertActions} title={alertInfo.title} onCloseAlert={this.onCancelDelete}>
          <Typography variant="body1">
            {alertInfo.text}
          </Typography>
        </Alert>
        <Alert open={alertOpen && alertType === 'projur'} hideClose actions={projurActions} title={alertInfo.title} onCloseAlert={this.onCancelUpdateProJur}>
          <Typography variant="body1">
            {alertInfo.text}
          </Typography>
        </Alert>
        <FlexGrid raised container style={{ overflow: 'hidden', minWidth: '30%', marginBottom: 25, height: '40%' }}>
          <Typography variant="body2" style={{ padding: 10, color: 'black' }}>
            Document Information
          </Typography>
          <Divider />
          <FlexGrid container flex padding={10} style={{ overflow: 'auto' }}>
            <FlexGrid container type="row" align="center" style={{ marginBottom: 15 }}>
              <FileDocument style={iconStyle} />
              <Typography variant="body1" style={metaStyling}>Status:</Typography>
              <Dropdown
                disabled={!inEditMode}
                name="selecteDocStatus"
                id="selectedDocStatus"
                options={options}
                input={{
                  value: document.status || 'Draft',
                  onChange: this.onChangeStatusField
                }}
                SelectDisplayProps={{ style: { paddingBottom: 3 } }}
                style={{ fontSize: 13 }}
                formControlStyle={{ minWidth: 180 }}
              />
            </FlexGrid>
            <FlexGrid container type="row" align="center" style={{ marginBottom: 15 }}>
              <FormatSection style={iconStyle} />
              <Typography variant="body1" style={metaStyling}>
                Citation:
              </Typography>
              {inEditMode
                ? (<input
                  style={colStyle}
                  defaultValue={document.citation}
                  onChange={e => this.handleDocPropertyChange('citation', e.target.value)}
                />)
                : <Typography style={metaStyling}>{document.citation}</Typography>}
            </FlexGrid>
            <FlexGrid container type="row" align="center" style={{ marginBottom: 15 }}>
              <CalendarRange style={iconStyle} />
              <Typography variant="body1" style={metaStyling}>
                Effective Date:
              </Typography>
              {inEditMode
                ? (<DatePicker
                  name="effectiveDate"
                  dateFormat="MM/DD/YYYY"
                  onChange={date => this.handleDocPropertyChange('effectiveDate', date.toISOString())}
                  value={document.effectiveDate}
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
                    {!document.effectiveDate
                      ? ''
                      : convertToLocalDate(document.effectiveDate.split('T')[0])}
                  </Typography>
                )}
            </FlexGrid>
            <FlexGrid container type="row" align="center" style={{ marginBottom: 15 }}>
              <Account style={iconStyle} />
              <Typography variant="body1" style={metaStyling}>
                {document.uploadedByName}
              </Typography>
            </FlexGrid>
            <FlexGrid container type="row" align="center" style={{ marginBottom: 15 }}>
              <FileUpload style={iconStyle} />
              <Typography variant="body1" style={metaStyling}>
                Upload Date: {convertToLocalDate(document.uploadedDate)}
              </Typography>
            </FlexGrid>
            <FlexGrid container type="row" flex align="flex-end" justify="space-between" style={{ minHeight: 30 }}>
              <Button
                value="Delete Document"
                raised={false}
                color="accent"
                style={{ paddingLeft: 0, textTransform: 'none', backgroundColor: 'transparent' }}
                aria-label="Delete the current document"
                onClick={() => this.handleShowDocDeleteConfirm('document', document._id)}
              />
              <Button
                value={inEditMode
                  ? 'Update'
                  : 'Edit'}
                size="small"
                color="accent"
                style={{ padding: '0 15px' }}
                onClick={inEditMode ? this.handleUpdate : this.handleEdit}
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
            {projectList.map((item, index) => {
              return (
                <FlexGrid
                  onMouseEnter={this.onToggleHover('project', index)}
                  onMouseLeave={this.onToggleHover('', null)}
                  container
                  type="row"
                  justify="space-between"
                  align="center"
                  key={`project-${index}`}
                  style={{
                    padding: 8,
                    backgroundColor: index % 2 === 0
                      ? '#f9f9f9'
                      : 'white',
                    minHeight: 24
                  }}>
                  <Typography style={{ fontSize: '.8125rem' }}>{item.name}</Typography>
                  {(hoveringOn === 'project' && hoverIndex === index) &&
                  <IconButton color="#757575" onClick={() => this.handleShowDeleteConfirm('project', index)}>
                    delete
                  </IconButton>}
                </FlexGrid>
              )
            })}
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
            {jurisdictionList.map((item, index) => (
              <FlexGrid
                onMouseEnter={this.onToggleHover('jurisdiction', index)}
                onMouseLeave={this.onToggleHover('', null)}
                container
                type="row"
                justify="space-between"
                align="center"
                key={`jurisdiction-${index}`}
                style={{
                  padding: 8,
                  backgroundColor: index % 2 === 0
                    ? '#f9f9f9'
                    : 'white',
                  minHeight: 24
                }}>
                <Typography style={{ fontSize: '.8125rem' }}>{item.name}</Typography>
                {(hoveringOn === 'jurisdiction' && hoverIndex === index) &&
                <IconButton color="#757575" onClick={() => this.handleShowDeleteConfirm('jurisdiction', index)}>
                  delete
                </IconButton>}
              </FlexGrid>))}
          </FlexGrid>
          <Modal onClose={this.onCloseModal} open={showModal} maxWidth="md" hideOverflow={false}>
            <ModalTitle title={showAddJurisdiction ? 'Assign Jurisdiction' : 'Assign Project'} />
            <Divider />
            <ModalContent style={{ display: 'flex', flexDirection: 'column', paddingTop: 24, width: 500, height: 275 }}>
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
                showJurSearch={showAddJurisdiction === true}
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

const mapStateToProps = state => {
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
    apiErrorOpen: state.scenes.docView.apiErrorOpen || false,
    documentUpdateInProgress: state.scenes.docView.documentUpdateInProgress || false
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

export default connect(mapStateToProps, mapDispatchToProps)(DocumentMeta)
