import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from './actions'
import { withRouter } from 'react-router'
import { ModalTitle, ModalActions, ModalContent } from 'components/Modal'
import Divider from 'material-ui/Divider'
import FormModal from 'components/FormModal'
import TextInput from 'components/TextInput'
import Dropdown from 'components/Dropdown'
import { Field } from 'redux-form'
import Container, { Row } from 'components/Layout'

export class AddEditProject extends Component {
  static propTypes = {
    actions: PropTypes.object,
    projects: PropTypes.arrayOf(PropTypes.object),
    form: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object
  }

  constructor (props, context) {
    super(props, context)
    this.onCancel = this.onCancel.bind(this)
    this.projectDefined = this.props.match.url === '/add/project' ? null : this.props.location.state.projectDefined
    this.state = {
      edit: !this.projectDefined
    }
  }

  onCancel () {
    this.state.edit
      ? this.projectDefined
        ? this.setState({edit: !this.state.edit})
        : this.props.history.goBack()
        : this.props.history.goBack()
  }

  handleSubmit = values => {
    this.projectDefined
      ? this.props.actions.updateProjectRequest({...values, name: this.capitalizeFirstLetter(values.name)})
      : this.props.actions.addProjectRequest({type: 1, ...values, name: this.capitalizeFirstLetter(values.name)})

    this.props.history.goBack()
  }

  capitalizeFirstLetter = text => text.trim()[0].toUpperCase() + text.trim().slice(1)

  validateProjectName = values => {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    const names = this.props.projects.map(project => project.name.toLowerCase())
    return sleep(1).then(() => {
      if (names.includes(values.name.toLowerCase()) &&
        !(this.projectDefined && this.projectDefined.name === values.name)) {
        throw {name: 'There is already a project with this name.'}
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

  render () {
    const actions = [
      {value: 'Cancel', onClick: this.onCancel, type: 'button'},
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
        form="newProject"
        handleSubmit={this.handleSubmit}
        asyncValidate={this.validateProjectName}
        asyncBlurFields={['name']} onClose={this.onCancel}
        initialValues={this.props.location.state.projectDefined || {}}
        width="600px" height="400px"
      >
        <ModalTitle title={this.getModalTitle()} edit={this.state.edit} editButton={!!this.projectDefined}
                    onEditForm={this.onEditForm} onCloseForm={this.onCancel} />
        <Divider />
        <ModalContent>
          <Container column style={{minWidth: 550, minHeight: 230, padding: '30px 15px'}}>
            <Row style={{paddingBottom: '10px'}}>
              <Field
                name="name"
                component={TextInput}
                label="Project Name"
                placeholder="Enter Project Name"
                validate={this.required}
                fullWidth={true}
                disabled={!this.state.edit}
                disableUnderline={!this.state.edit}
              />
            </Row>
            <Row>
             <Field
               name="type"
               component={Dropdown}
               label="Type"
               defaultValue={1}
               options={options}
               id="type"
               style={{display: 'flex'}}
               disabled={!this.state.edit}
               disableUnderline={!this.state.edit}
             />
            </Row>
          </Container>
        </ModalContent>
        <ModalActions edit={this.state.edit} actions={actions} />
      </FormModal>
    )
  }
}

const mapStateToProps = (state) => ({
  projects: state.scenes.home.main.projects || [],
  form: state.form.newProject || {}
})

const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators(actions, dispatch)})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddEditProject))
