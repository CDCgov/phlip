import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from './actions'
import { default as formActions } from 'redux-form/lib/actions'
import { withRouter } from 'react-router'
import { ModalTitle, ModalActions, ModalContent } from 'components/Modal'
import Divider from '@material-ui/core/Divider'
import FormModal from 'components/FormModal'
import TextInput from 'components/TextInput'
import Dropdown from 'components/Dropdown'
import Container from 'components/Layout'
import DetailRow from './components/DetailRow'
import withFormAlert from 'components/withFormAlert'
import withTracking from 'components/withTracking'
import CircularLoader from 'components/CircularLoader'

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

    onSubmitError: PropTypes.func
  }

  constructor(props, context) {
    super(props, context)
    this.projectDefined = this.props.match.url === '/project/add' ? null : this.props.location.state.projectDefined
    this.state = {
      edit: this.props.location.state.directEditMode || !this.projectDefined,
      submitting: false
    }
  }

  componentDidUpdate() {
    if (this.state.submitting === true) {
      if (this.props.formError !== null) {
        this.setState({
          submitting: false
        })
        this.props.onSubmitError(this.props.formError)
      } else if (this.props.goBack === true) {
        this.props.history.goBack()
      }
    }
  }

  /**
   * In edit mode, the user clicks the cancel button. Resets to form values to whatever they were before editing.
   *
   * @public
   */
  onCancel = () => {
    this.props.formActions.reset('projectForm')
    if (this.props.location.state.directEditMode) {
      this.props.history.goBack()
    } else {
      return this.state.edit
        ? this.projectDefined
          ? this.setState({ edit: !this.state.edit })
          : this.props.history.goBack()
        : this.props.history.goBack()
    }
  }

  /**
   * Function called when the form is submitted, dispatches a redux action for updating or adding depending on state.
   *
   * @public
   * @param {Object} values
   */
  handleSubmit = values => {
    this.setState({
      submitting: true
    })

    this.projectDefined
      ? this.props.actions.updateProjectRequest({ ...values, name: this.capitalizeFirstLetter(values.name) })
      : this.props.actions.addProjectRequest({ type: 1, ...values, name: this.capitalizeFirstLetter(values.name) })
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
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    const names = this.props.projects.map(project => project.name.toLowerCase())
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
  required = value => (
    value ? undefined : 'Required'
  )

  /**
   * Sets the form to edit mode
   * @public
   */
  onEditForm = () => {
    this.setState({
      edit: !this.state.edit
    })
  }

  /**
   * Determines the modal title depending on whether it's add / edit / view
   *
   * @public
   * @returns {String}
   */
  getModalTitle = () => this.projectDefined
    ? this.state.edit
      ? 'Edit Project'
      : 'Project Details'
    : 'Create New Project'

  /**
   * Formats dates in form to locale date string
   *
   * @public
   * @param {*} value
   * @param {String} name
   * @returns {String}
   */
  formatDate = (value, name) => new Date(value).toLocaleDateString()

  getButtonText = text => {
    if (this.state.submitting) {
      return (
        <>
          {text}
          <CircularLoader size={18} style={{ paddingLeft: 10 }} />
        </>
      )
    } else {
      return <>{text}</>
    }
  }

  render() {
    const editAction = [
      { value: 'Cancel', onClick: this.onCancel, type: 'button', otherProps: { 'aria-label': 'Close modal' } },
      {
        value: 'Edit',
        onClick: this.onEditForm,
        disabled: this.props.userRole === 'Coder',
        type: 'button',
        otherProps: { 'aria-label': 'Edit this project' }
      }
    ]

    const actions = this.projectDefined && !this.state.edit
      ? editAction
      : [
        { value: 'Cancel', onClick: this.onCancel, type: 'button', otherProps: { 'aria-label': 'Cancel edit view' } },
        {
          value: this.projectDefined
            ? this.getButtonText('Save')
            : this.getButtonText('Create'),
          type: 'submit',
          disabled: this.state.submitting === true,
          otherProps: { 'aria-label': 'Save form' }
        }
      ]

    const options = [
      { value: 1, label: 'Legal Scan' },
      { value: 2, label: 'Policy Surveillance' }
      //{ value: 3, label: 'Environmental Scan' }
    ]

    return (
      <FormModal
        form="projectForm"
        handleSubmit={this.handleSubmit}
        asyncValidate={this.validateProjectName}
        asyncBlurFields={['name']}
        onClose={this.props.onCloseModal}
        initialValues={this.props.location.state.projectDefined || {}}
        width="600px"
        height="400px">
        <ModalTitle
          title={this.getModalTitle()}
          closeButton={!!this.projectDefined}
          onEditForm={this.onEditForm}
          onCloseForm={this.onCancel}
        />
        <Divider />
        <ModalContent>
          <Container column style={{ minWidth: 550, minHeight: 230, padding: '30px 15px 0 15px' }}>
            <DetailRow
              name="name"
              component={TextInput}
              label="Project Name"
              validate={this.required}
              placeholder="Enter Project Name"
              fullWidth
              required={this.projectDefined ? this.state.edit : true}
              disabled={!this.state.edit}
            />
            <DetailRow
              name="type"
              component={Dropdown}
              label="Type"
              defaultValue={1}
              options={options}
              id="type"
              required={this.projectDefined ? this.state.edit : true}
              style={{ display: 'flex' }}
              disabled={!this.state.edit}
            />
            {this.projectDefined &&
            <DetailRow
              component={TextInput}
              disabled={true}
              label="Created By"
              name="createdBy"
            />}
            {this.projectDefined &&
            <DetailRow
              component={TextInput}
              disabled={true}
              label="Created Date"
              name="dateCreated"
              format={this.formatDate}
              style={{ paddingBottom: 0 }}
            />
            }
          </Container>
        </ModalContent>
        <ModalActions actions={actions} />
      </FormModal>
    )
  }
}

const mapStateToProps = (state) => ({
  projects: Object.values(state.scenes.home.main.projects.byId) || [],
  form: state.form.projectForm || {},
  formName: 'projectForm',
  userRole: state.data.user.currentUser.role || '',
  formError: state.scenes.home.addEditProject.formError || null,
  goBack: state.scenes.home.addEditProject.goBack || false
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  formActions: bindActionCreators(formActions, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withFormAlert(withTracking(AddEditProject, 'Project Form'))))
