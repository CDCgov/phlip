import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from './actions'
import ModalForm from 'components/ModalForm'
import { withRouter } from 'react-router'
import EditView from './components/EditView'
import DetailsView from './components/DetailsView'

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
    this.onCancel = this.onCancel.bind(this)
    this.projectDefined = this.props.match.url === '/add/project' ? null : this.props.location.state.projectDefined
    this.state = {
      edit: !this.projectDefined
    }
  }

  onCancel() {
    this.state.edit
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

  // The function passed to asyncValidate for reduxForm has to return a promise, so that's why
  // there's the sleep function in there.
  validateProjectName = values => {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    const names = this.props.projects.map(project => project.name.toLowerCase())
    return sleep(1).then(() => {
      if (names.includes(values.name.toLowerCase()) && !(this.projectDefined && this.projectDefined.name === values.name)) {
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

  render() {
    const actions = [
      { value: 'Cancel', onClick: this.onCancel, type: 'button' },
      {
        value: this.projectDefined
          ? 'Save'
          : 'Create',
        type: 'submit',
        disabled: !!(this.props.form.asyncErrors || this.props.form.syncErrors)
      }
    ]

    return (
      <ModalForm
        open={true}
        title={this.getModalTitle()}
        actions={actions}
        form="newProject"
        handleSubmit={this.handleSubmit}
        asyncValidate={this.validateProjectName}
        asyncBlurFields={['name']}
        onClose={this.onCancel}
        editButton={!!this.projectDefined}
        editForm={this.onEditForm}
        edit={this.state.edit}
        initialValues={this.props.location.state.projectDefined || {}}
        width="600px"
        height="400px">
        {this.state.edit
          ? <EditView validate={this.required} />
          : <DetailsView project={this.projectDefined} />}
      </ModalForm>
    )
  }
}

const mapStateToProps = (state) => ({
  projects: state.scenes.home.main.projects || [],
  form: state.form.newProject || {}
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddEditProject))
