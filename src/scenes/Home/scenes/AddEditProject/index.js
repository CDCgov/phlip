import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from './actions'
import { default as formActions } from 'redux-form/lib/actions'
import { withRouter } from 'react-router'
import { ModalTitle, ModalActions, ModalContent } from 'components/Modal'
import Divider from 'material-ui/Divider'
import FormModal from 'components/FormModal'
import TextInput from 'components/TextInput'
import Dropdown from 'components/Dropdown'
import Container, { Row } from 'components/Layout'
import DetailRow from './components/DetailRow'
import withFormAlert from 'components/withFormAlert'

export class AddEditProject extends Component {
  static propTypes = {
    actions: PropTypes.object,
    formActions: PropTypes.object,
    projects: PropTypes.arrayOf(PropTypes.object),
    form: PropTypes.object,
    formName: PropTypes.string,
    match: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object,
    onCloseModal: PropTypes.func
  }

  constructor(props, context) {
    super(props, context)
    this.projectDefined = this.props.match.url === '/project/add' ? null : this.props.location.state.projectDefined
    this.state = {
      edit: !this.projectDefined,
      submitting: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.submitting === true) {
      if (nextProps.formError !== null) {
        this.setState({
          submitting: false
        })
        this.props.onSubmitError(nextProps.formError)
      } else if (nextProps.goBack === true) {
        this.props.history.goBack()
      }
    }
  }

  onCancel = () => {
    this.props.formActions.reset('projectForm')
    return this.state.edit
      ? this.projectDefined
        ? this.setState({ edit: !this.state.edit })
        : this.props.history.goBack()
      : this.props.history.goBack()
  }

  handleSubmit = values => {
    this.setState({
      submitting: true
    })

    this.projectDefined
      ? this.props.actions.updateProjectRequest({ ...values, name: this.capitalizeFirstLetter(values.name) })
      : this.props.actions.addProjectRequest({ type: 1, ...values, name: this.capitalizeFirstLetter(values.name) })
  }

  capitalizeFirstLetter = text => text.trim()[0].toUpperCase() + text.trim().slice(1)

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

  required = value => (
    value ? undefined : 'Required'
  )

  onEditForm = () => {
    this.setState({
      edit: !this.state.edit
    })
  }

  getModalTitle = () => this.projectDefined
    ? this.state.edit
      ? 'Edit Project'
      : 'Project Details'
    : 'Create New Project'

  formatDate = (value, name) => new Date(value).toLocaleDateString()

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
            ? 'Save'
            : 'Create',
          type: 'submit',
          disabled: !!(this.props.form.asyncErrors || this.props.form.syncErrors),
          otherProps: { 'aria-label': 'Save form' }
        }
      ]

    const options = [
      { value: 1, label: 'Assessment' },
      { value: 2, label: 'Policy Surveillance' },
      { value: 3, label: 'Environmental Scan' }
    ]

    return (
      <FormModal
        form="projectForm"
        handleSubmit={this.handleSubmit}
        asyncValidate={this.validateProjectName}
        asyncBlurFields={['name']}
        onClose={this.props.onCloseModal}
        initialValues={this.props.location.state.projectDefined || {}}
        width="600px" height="400px"
      >
        <ModalTitle
          title={this.getModalTitle()}
          closeButton={!!this.projectDefined} onEditForm={this.onEditForm} onCloseForm={this.onCancel}
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
              disabled={!this.state.edit}
            />
            <DetailRow
              name="type"
              component={Dropdown}
              label="Type"
              defaultValue={1}
              options={options}
              id="type"
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withFormAlert(AddEditProject)))