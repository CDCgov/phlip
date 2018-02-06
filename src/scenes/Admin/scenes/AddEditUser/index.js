import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Grid from 'material-ui/Grid'
import * as actions from './actions'
import Dropdown from 'components/Dropdown'
import { withRouter } from 'react-router-dom'
import { Field, reduxForm } from 'redux-form'
import ModalForm from 'components/ModalForm'
import FormTextInput from 'components/FormTextInput'
import isEmail from 'sane-email-validation'
import Container, { Row, Column } from 'components/Layout'
import { trimWhitespace } from 'utils/formHelpers'

export class AddEditUser extends Component {
  constructor(props, context) {
    super(props, context)
    this.onCancel = this.onCancel.bind(this)
    this.selectedUser = undefined
  }

  onCancel() {
    this.props.history.goBack()
  }

  handleSubmit = (values) => {
    let updatedValues = { ...values }
    for (let field of ['firstName', 'lastName']) {
      updatedValues[field] = trimWhitespace(values[field])
    }

    if (this.props.match.params.id) {
      this.props.actions.updateUserRequest({ role: 'Coordinator', ...updatedValues })
      if (this.props.currentUser.id === updatedValues.id) {
        this.props.actions.updateCurrentUser({ ...this.props.currentUser, ...updatedValues })
      }
    } else {
      this.props.actions.addUserRequest({ role: 'Coordinator', ...updatedValues })
    }
    this.props.history.goBack()
  }

  validateEmail = values => {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    const emails = this.props.users.map(user => user.email)
    return sleep(1).then(() => {
      if (emails.includes(values.email) && !this.props.match.params.id) {
        throw { email: 'This email is already associated with a user account.' }
      }
      if (values.email && !isEmail(values.email)) {
        throw { email: 'Invalid email address' }
      }
    })
  }

  componentWillMount() {
    const id = this.props.match.params.id

    if (id && this.props.users.length > 0) {
      this.selectedUser = getUserById(this.props.users, id)
    }
  }

  // required = value => value ? undefined : 'Required'
  required = value => {
    if (!value && !this.props.match.params.id) {
      return 'Required'
    } else {
      return undefined
    }
  }

  render() {
    const actions = [
      { value: 'Cancel', onClick: this.onCancel, type: 'button' },
      { value: 'Save', type: 'submit', disabled: !!(this.props.form.asyncErrors || this.props.form.syncErrors) }
    ]

    const roles = [
      { value: 'Admin', label: 'Admin' },
      { value: 'Coordinator', label: 'Coordinator' },
      { value: 'Coder', label: 'Coder' },
    ]

    return (

      <ModalForm
        open={true}
        title="Add/Edit User"
        actions={actions}
        form="addEditUser"
        handleSubmit={this.handleSubmit}
        asyncValidate={this.validateEmail}
        initialValues={this.selectedUser}
        asyncBlurFields={['email']}
        width="600px"
        height="400px">
        <Container column style={{ minWidth: 550, minHeight: 275, padding: '30px 15px' }}>
          <Row>
            <Container spacing={24}>
              <Row flex>
                <Field
                  name="firstName"
                  component={FormTextInput}
                  label="First Name"
                  placeholder="Enter First Name"
                  validate={this.required}
                  fullWidth={true}
                />
              </Row>
              <Row flex >
                <Field
                  name="lastName"
                  component={FormTextInput}
                  label="Last Name"
                  placeholder="Enter Last Name"
                  validate={this.required}
                  fullWidth={true}
                />
              </Row>
            </Container>

          </Row>

          <Row>
            <Field
              name="email"
              component={FormTextInput}
              label="Email"
              placeholder="Enter Email"
              validate={this.required}
              fullWidth={true}
            />
          </Row>
          <Row style={{ paddingBottom: '25px' }}>
            <Field
              name="password"
              component={FormTextInput}
              label="Password"
              placeholder="Enter Password"
              validate={this.required}
              fullWidth={true}
            />
          </Row>
          <Row>
            <Field
              name="role"
              component={Dropdown}
              label="Role"
              options={roles}
              defaultValue=""
              id="role"
              style={{ display: 'flex' }}
            />
          </Row>
        </Container>
      </ModalForm>
    )
  }
}

function getUserById(users, id) {
  const user = users.filter(user => user.id == id);
  if (user.length) return user[0];
  return null;
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.data.user.currentUser || {},
    users: state.scenes.admin.main.users || [],
    form: state.form.addEditUser || {},
  }
}


const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddEditUser))

