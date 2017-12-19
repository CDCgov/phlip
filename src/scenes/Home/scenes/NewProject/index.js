import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from './actions'
import Dropdown from 'components/Dropdown'
import { withRouter } from 'react-router'
import { Field } from 'redux-form'
import Container, { Row, Column } from 'components/Layout'
import ModalForm from 'components/ModalForm'
import FormTextInput from 'components/TextInput'

export class NewProject extends Component {
  static propTypes = {
    actions: PropTypes.object,
    projects: PropTypes.arrayOf(PropTypes.object),
    form: PropTypes.object,
    history: PropTypes.object
  }

  constructor(props, context) {
    super(props, context)
    this.onCancel = this.onCancel.bind(this)
  }

  onCancel() {
    this.props.history.goBack()
  }

  handleSubmit = values => {
    this.props.actions.addProjectRequest(
      {
        type: 'Assessment',
        ...values,
        name: this.capitalizeFirstLetter(values.name)
      }
    )
    this.props.history.goBack()
  }

  capitalizeFirstLetter = text => text.trim()[0].toUpperCase() + text.trim().slice(1)

  // The function passed to asyncValidate for reduxForm has to return a promise, so that's why
  // there's the sleep function in there.
  validateProjectName = values => {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    const names = this.props.projects.map(project => project.name.toLowerCase())
    return sleep(1).then(() => {
      if (names.includes(values.name.toLowerCase())) {
        throw { name: 'There is already a project with this name.' }
      }
    })
  }

  required = value => (
    value ? undefined : 'Required'
  )

  render() {
    const actions = [
      { value: 'Cancel', onClick: this.onCancel, type: 'button' },
      { value: 'Create', type: 'submit', disabled: !!(this.props.form.asyncErrors || this.props.form.syncErrors) }
    ]

    const options = [
      { value: 'Assessment', label: 'Assessment' },
      { value: 'Policy Surveillance', label: 'Policy Surveillance' },
      { value: 'Environment Scan', label: 'Environmental Scan' }
    ]

    return (
      <ModalForm
        open={true}
        title="Create New Project"
        actions={actions}
        form="newProject"
        handleSubmit={this.handleSubmit}
        asyncValidate={this.validateProjectName}
        asyncBlurFields={['name']}
        width="600px"
        height="400px">
        <Container column style={{ minWidth: 550, minHeight: 230, padding: '30px 15px' }}>
          <Row style={{ paddingBottom: '20px' }}>
            <Field
              name="name"
              component={FormTextInput}
              label="Project Name"
              placeholder="Enter Project Name"
              validate={this.required}
              fullWidth={true}
            />
          </Row>
          <Row>
            <Field
              name="type"
              component={Dropdown}
              label="Type"
              defaultValue="Assessment"
              options={options}
              id="type"
              style={{ display: 'flex' }}
            />
          </Row>
        </Container>
      </ModalForm>
    )
  }
}

const mapStateToProps = (state) => ({
  projects: Object.values(state.scenes.home.main.projects.byId) || [],
  form: state.form.newProject || {}
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewProject))
