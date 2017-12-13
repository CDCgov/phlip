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
    if (this.props.match.params.id) {
      this.props.actions.updateUserRequest({ role: 'Coordinator', ...values })
    } else {
      this.props.actions.addUserRequest({ role: 'Coordinator', ...values })
    }
    this.props.history.goBack()
  }

  validateEmail = values => {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    const emails = this.props.users.map(user => user.email)
    return sleep(1).then(() => {
      if (emails.includes(values.email)) {
        throw { email: 'This email is already associated with a user account.' }
      }
      if (!isEmail(values.email)) {
        throw { email: 'Invalid email address' }
      }
    })
  }

  componentWillMount() {
    const userId = this.props.match.params.id

    if (userId && this.props.users.length > 0) {
      this.selectedUser = getUserById(this.props.users, userId)
    }

  }

  required = value => value ? undefined : 'Required'

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
        <Grid container direction="column" style={{ minWidth: 550, minHeight: 230, padding: '30px 15px' }}>
          <Grid item>
            <Grid container direction="row" spacing={24}>
              <Grid item xs={6}>
                <Field
                  name="firstName"
                  component={FormTextInput}
                  label="First Name"
                  placeholder="Enter First Name"
                  validate={this.required}
                  fullWidth={true}
                />
              </Grid>
              <Grid item xs={6} >
                <Field
                  name="lastName"
                  component={FormTextInput}
                  label="Last Name"
                  placeholder="Enter Last Name"
                  validate={this.required}
                  fullWidth={true}
                />
              </Grid>
            </Grid>

          </Grid>

          <Grid item>
            <Field
              name="email"
              component={FormTextInput}
              label="Email"
              placeholder="Enter Email"
              validate={this.required}
              fullWidth={true}
            />
          </Grid>
          <Grid item>
            <Field
              name="password"
              component={FormTextInput}
              label="Password"
              placeholder="Enter Password"
              validate={this.required}
              fullWidth={true}
            />
          </Grid>
          <Grid item>
            <Field
              name="role"
              component={Dropdown}
              label="Role"
              options={roles}
              defaultValue=""
              id="role"
              style={{ display: 'flex' }}
            />
          </Grid>
        </Grid>
      </ModalForm>
    )
  }
}

function getUserById(users, id) {
  const user = users.filter(user => user.userId == id);
  if (user.length) return user[0];
  return null;
}


const mapStateToProps = (state) => {
  return {
    users: state.scenes.admin.main.users || [],
    form: state.form.addEditUser || {},
  }
}


const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddEditUser))

