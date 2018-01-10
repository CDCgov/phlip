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

export class AddEditProject extends Component {
  static propTypes = {
    actions: PropTypes.object,
    projects: PropTypes.arrayOf(PropTypes.object),
    form: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object
  }

  constructor(props, context) {
    super(props, context)
    this.projectDefined = this.props.match.url === '/project/add' ? null : this.props.location.state.projectDefined
    this.state = {
      edit: !this.projectDefined
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
    this.projectDefined
      ? this.props.actions.updateProjectRequest({ ...values, name: this.capitalizeFirstLetter(values.name) })
      : this.props.actions.addProjectRequest({ type: 1, ...values, name: this.capitalizeFirstLetter(values.name) })

    this.props.history.goBack()
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
    const editAction = [{ value: 'Edit', onClick: this.onEditForm, type: 'button' }]

    const actions = this.projectDefined && !this.state.edit
      ? editAction
      : [{ value: 'Cancel', onClick: this.onCancel, type: 'button' },
      {
        value: this.projectDefined
          ? 'Save'
          : 'Create',
        type: 'submit',
        disabled: !!(this.props.form.asyncErrors || this.props.form.syncErrors)
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
        asyncBlurFields={['name']} onClose={this.onCancel}
        initialValues={this.props.location.state.projectDefined || {}}
        width="600px" height="400px">
        <ModalTitle title={this.getModalTitle()} edit={this.state.edit}
          closeButton={!!this.projectDefined} onEditForm={this.onEditForm} onCloseForm={this.onCancel} />
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
        <ModalActions edit={this.state.edit} actions={actions} />
      </FormModal>
    )
  }
}

const mapStateToProps = (state) => ({
  projects: Object.values(state.scenes.home.main.projects.byId) || [],
  form: state.form.projectForm || {}
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  formActions: bindActionCreators(formActions, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddEditProject))
