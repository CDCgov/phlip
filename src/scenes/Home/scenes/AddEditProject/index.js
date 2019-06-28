import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from './actions'
import { default as formActions } from 'redux-form/lib/actions'
import { withRouter } from 'react-router'
import { ModalTitle, ModalActions, ModalContent } from 'components/Modal'
import {
  FormModal,
  TextInput,
  Dropdown,
  withFormAlert,
  withTracking,
  CircularLoader,
  Button,
  Alert,
  FlexGrid,
  Autocomplete,
  IconButton
} from 'components'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import InputLabel from '@material-ui/core/InputLabel'
import DetailRow from './components/DetailRow'
import MenuItem from '@material-ui/core/MenuItem'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'

/**
 * For the autocomplete search field
 * @param suggestion
 * @returns {*}
 */
const getSuggestionValue = suggestion => suggestion

/**
 * Renders the user suggestion
 * @param suggestion
 * @param query
 * @param isHighlighted
 * @returns {*}
 */
const renderSuggestion = (suggestion, { query, isHighlighted }) => {
  const matches = match(suggestion.name, query)
  const parts = parse(suggestion.name, matches)
  
  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </strong>
          )
        })}
      </div>
    </MenuItem>
  )
}

/**
 * Main / entry component for all things related to adding and editing a project. This component is a modal and is
 * rendered and mounted when the user clicks the 'Add New Project' button or the name of a project in the Project List
 * scene. The Edit or Add view is determined by the location and location.state props variables. If a project is passed
 * along, then it's edit, otherwise it's Add. This component is wrapped by the withFormAlert, withTracking and
 * react-redux's connect HOCs.
 */
export class AddEditProject extends Component {
  static propTypes = {
    /**
     * redux actions
     */
    actions: PropTypes.object,
    /**
     * redux-form actions
     */
    formActions: PropTypes.object,
    /**
     * Array of all projects, used for making sure project names don't conflict
     */
    projects: PropTypes.arrayOf(PropTypes.object),
    /**
     * redux-form object
     */
    form: PropTypes.object,
    /**
     * Name of form
     */
    formName: PropTypes.string,
    /**
     * react-router location match object
     */
    match: PropTypes.object,
    /**
     * Browser history object
     */
    history: PropTypes.object,
    /**
     * react-router location object
     */
    location: PropTypes.object,
    /**
     * Function passed in from withFormAlert HOC
     */
    onCloseModal: PropTypes.func,
    /**
     * The role of the current user
     */
    userRole: PropTypes.string,
    /**
     * Form error if any that occurred when manipulating the form
     */
    formError: PropTypes.string,
    /**
     * Whether or not to go back (after successfully saving, it will be true)
     */
    goBack: PropTypes.bool,
    /**
     * onSubmitError
     */
    onSubmitError: PropTypes.func,
    /**
     * Submitting status
     */
    submitting: PropTypes.bool
  }
  
  constructor(props, context) {
    super(props, context)
    this.projectDefined = this.props.match.url === '/project/add' ? null : this.props.location.state.projectDefined
    this.state = {
      edit: this.projectDefined,
      submitting: false,
      typeToDelete: '',
      projectToDelete: {},
      alertOpen: false,
      alertInfo: {
        title: '',
        text: ''
      },
      showModal: false
    }
  }
  
  /**
   * update page title using props after component loaded
   */
  componentDidMount() {
    this.prevTitle = document.title
    if (this.state.edit) {
      document.title = `PHLIP - Project ${this.projectDefined.name} - Edit`
    } else {
      document.title = `PHLIP - Add Project`
    }
  }
  
  componentDidUpdate(prevProps) {
    const { formError, onSubmitError, history, goBack, submitting } = this.props
    
    if (prevProps.submitting && !submitting) {
      if (formError !== null) {
        onSubmitError(formError)
      } else if (goBack) {
        history.push('/home')
      }
    }
  }
  
  componentWillUnmount() {
    document.title = this.prevTitle
  }
  
  /**
   * In edit mode, the user clicks the cancel button. Resets to form values to whatever they were before editing.
   * @public
   */
  onCancel = () => {
    const { formActions, history } = this.props
    formActions.reset('projectForm')
    history.push('/home')
  }
  
  /**
   * Function called when the form is submitted, dispatches a redux action for updating or adding depending on state.
   *
   * @public
   * @param {Object} values
   */
  handleSubmit = values => {
    const { actions } = this.props
    
    this.setState({ submitting: true })
    this.projectDefined
      ? actions.updateProjectRequest({ ...values, name: this.capitalizeFirstLetter(values.name) })
      : actions.addProjectRequest({ type: 1, ...values, name: this.capitalizeFirstLetter(values.name) })
  }
  
  /**
   * Capitalizes first letter of string
   *
   * @public
   * @param {String} text
   * @returns {String}
   */
  capitalizeFirstLetter = text => text.trim()[0].toUpperCase() + text.trim().slice(1)
  
  /**
   * Validates the name of the project in add or edit does not conflict with another project
   *
   * @public
   * @param {Object} values
   */
  validateProjectName = values => {
    const { projects } = this.props
    
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    const names = projects.map(project => project.name.toLowerCase())
    return sleep(1).then(() => {
      if (names.includes(values.name.toLowerCase()) &&
        !(this.projectDefined && this.projectDefined.name === values.name)) {
        throw { name: 'There is already a project with this name.' }
      }
    })
  }
  
  /**
   * Checks to see if a value is defined and if not return 'required' string
   *
   * @public
   * @param {*} value
   * @returns {String}
   */
  required = value => value ? undefined : 'Required'
  
  /**
   * Determines the modal title depending on whether it's add / edit / view
   *
   * @public
   * @returns {String}
   */
  getModalTitle = () => this.projectDefined
    ? 'Edit Project'
    : 'Create New Project'
  
  /**
   * Gets button text adds a spinner if a saving is happening
   * @param text
   * @returns {*}
   */
  getButtonText = text => {
    return (
      <>
        {text}
        {this.props.submitting && <CircularLoader size={15} style={{ marginLeft: 10 }} />}
      </>
    )
  }
  
  /**
   * Shows a modal asking user to confirm deletion of project
   */
  handleShowDeleteConfirm = () => {
    this.setState({
      typeToDelete: 'Project',
      [`projectToDelete`]: this.projectDefined.id,
      alertOpen: true,
      alertInfo: {
        title: 'Warning',
        text: `Are you sure you want to delete ${this.projectDefined.name}? The project's coding scheme, protocol, as well as coded and validated questions will be deleted.`
      }
    })
  }
  
  /*
   * Handles when the user confirms deletion of project
   */
  handleDeleteConfirm = () => {
    this.onCancel()
    this.props.actions.deleteProjectRequest(this.projectDefined.id)
  }
  
  /**
   * Handles when the user confirms cancels deletion of project
   */
  onCancelDelete = () => {
    this.setState({
      alertOpen: false,
      alertInfo: {},
      typeToDelete: ''
    })
  }
  
  /**
   * Closes an alert on the page
   */
  closeAlert = () => {
    this.props.actions.closeAlert()
  }
  
  /**
   * Search user list for adding a user
   * @param value
   */
  onUsersFetchRequest = ({ value }) => {
    this.props.actions.searchUserList(value)
  }
  
  /**
   * When a user was selected
   * @param event
   * @param suggestionValue
   */
  onUserSelected = (event, { suggestionValue }) => {
    this.props.actions.onUserSelected(suggestionValue)
  }
  
  /**
   * User changed their search value
   * @param event
   */
  onUserSuggestionChange = event => {
    this.props.actions.onSuggestionValueChanged(event.target.value)
  }
  
  /**
   * Clears suggestion list
   */
  onClearUserSuggestions = () => {
    this.props.actions.onClearSuggestions()
  }
  
  render() {
    const { alertOpen, alertInfo } = this.state
    const { userRole, location, onCloseModal, submitting, userSuggestions, userSearchValue, newUsers } = this.props
    
    const actions = [
      { value: 'Cancel', onClick: this.onCancel, type: 'button', otherProps: { 'aria-label': 'Cancel edit view' } },
      {
        value: this.projectDefined
          ? this.getButtonText('Save')
          : this.getButtonText('Create'),
        type: 'submit',
        disabled: submitting,
        otherProps: { 'aria-label': 'Save form' }
      }
    ]
    
    const options = [
      { value: 1, label: 'Legal Scan' },
      { value: 2, label: 'Policy Surveillance' }
    ]
    
    const alertActions = [
      {
        value: 'Delete',
        type: 'button',
        onClick: this.handleDeleteConfirm
      }
    ]
    
    const users = this.projectDefined ? [...this.projectDefined.projectUsers, ...newUsers] : [...newUsers]
    
    return (
      <>
        <Alert open={alertOpen} actions={alertActions} onCloseAlert={this.onCancelDelete} title={alertInfo.title}>
          <Typography variant="body1">{alertInfo.text}</Typography>
        </Alert>
        <FormModal
          form="projectForm"
          handleSubmit={this.handleSubmit}
          asyncValidate={this.validateProjectName}
          asyncBlurFields={['name']}
          onClose={onCloseModal}
          maxWidth="lg"
          style={{ height: '80%', width: '80%' }}
          formStyle={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          initialValues={location.state.projectDefined || {}}>
          <ModalTitle
            title={this.getModalTitle()}
            closeButton={!!this.projectDefined}
            onCloseForm={this.onCancel}
            buttons={(this.projectDefined && userRole === 'Admin')
              ? <Button color="error" onClick={this.handleShowDeleteConfirm}>Delete</Button>
              : undefined}
          />
          <Divider />
          <ModalContent>
            <FlexGrid container padding="30px 15px 0" style={{ minWidth: 500, minHeight: 230 }}>
              <DetailRow
                name="name"
                component={TextInput}
                label="Project Name"
                validate={this.required}
                placeholder="Enter Project Name"
                fullWidth
                required={true}
              />
              <DetailRow
                name="type"
                component={Dropdown}
                label="Type"
                defaultValue={1}
                options={options}
                id="type"
                required={true}
                style={{ display: 'flex' }}
              />
              <FlexGrid container padding="0 0 25px">
                <InputLabel>Project Users</InputLabel>
                {users.map((user, i) => {
                  return <Typography key={`project-user-${i}`}>{user.firstName}{' '}{user.lastName}</Typography>
                })}
              </FlexGrid>
              <FlexGrid container>
                <InputLabel shrink>Add New User</InputLabel>
                <Autocomplete
                  name="name"
                  suggestions={userSuggestions}
                  handleGetSuggestions={this.onUsersFetchRequest}
                  handleClearSuggestions={this.onClearUserSuggestions}
                  InputProps={{
                    placeholder: 'Search for user by name'
                  }}
                  inputProps={{
                    value: userSearchValue,
                    onChange: this.onUserSuggestionChange,
                    id: 'add-user-name'
                  }}
                  handleSuggestionSelected={this.onUserSelected}
                />
              </FlexGrid>
            </FlexGrid>
          </ModalContent>
          <ModalActions actions={actions} />
        </FormModal>
      </>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = state => ({
  projects: Object.values(state.data.projects.byId) || [],
  form: state.form.projectForm || {},
  formName: 'projectForm',
  userRole: state.data.user.currentUser.role,
  formError: state.scenes.home.addEditProject.formError,
  goBack: state.scenes.home.addEditProject.goBack,
  submitting: state.scenes.home.addEditProject.submitting,
  userSearchValue: state.scenes.home.addEditProject.userSearchValue || '',
  userSuggestions: state.scenes.home.addEditProject.userSuggestions || [],
  newUsers: state.scenes.home.addEditProject.newUsers || []
})

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
  formActions: bindActionCreators(formActions, dispatch)
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(withFormAlert(withTracking(AddEditProject, 'Project Form'))))
