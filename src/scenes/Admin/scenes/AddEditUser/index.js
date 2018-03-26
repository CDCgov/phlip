import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Route } from 'react-router-dom'
import * as actions from './actions'
import Dropdown from 'components/Dropdown'
import { withRouter } from 'react-router-dom'
import { Field, reduxForm } from 'redux-form'
import ModalForm from 'components/ModalForm'
import TextInput from 'components/TextInput'
import isEmail from 'sane-email-validation'
import Container, { Row, Column } from 'components/Layout'
import { trimWhitespace } from 'utils/formHelpers'
import Avatar from 'components/Avatar'
import ReactFileReader from 'react-file-reader'
import IconButton from 'components/IconButton'
import withFormAlert from 'components/withFormAlert'
import { default as formActions } from 'redux-form/lib/actions'
import AvatarForm from './components/AvatarForm'
import TextLink from 'components/TextLink'
import Button from 'components/Button'
import Tooltip from 'components/Tooltip'
import compressImage from 'browser-compress-image'
import Alert from 'components/Alert'


const rowStyles = {
  paddingBottom: 20
}

export class AddEditUser extends Component {
  static propTypes = {
    form: PropTypes.object,
    formName: PropTypes.string,
    users: PropTypes.array,
    avatar: PropTypes.string,
    currentUser: PropTypes.object,
    actions: PropTypes.object,
    formActions: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object,
    history: PropTypes.object,
    onCloseModal: PropTypes.func
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      file: null,
      selectedUser: null
    }
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
      this.state.selectedUser = getUserById(this.props.users, id)
      this.props.actions.loadAddEditAvatar(this.state.selectedUser.avatar)
      // this.props.actions.getUserPictureRequest(id)
    }

  }

  openAvatarForm = files => {
    const maxSize = 500000

    if (files.fileList[0].size > maxSize) {
      console.log('file too big')
    } else {
      compressImage(files.fileList[0]).then(({ shrunkBase64, compressedFile }) => {


        files.file = compressedFile
        files.base64 = shrunkBase64


        this.props.history.push({
          pathname: `/admin/edit/user/${this.state.selectedUser.id}/avatar`,
          state: {
            file: files,

            userId: this.state.selectedUser.id
          }
        })
      })
    }


  }

  required = value => {
    if (!value && !this.props.match.params.id) {
      return 'Required'
    } else {
      return undefined
    }
  }

  onCancel = () => {
    this.props.actions.onCloseAddEditUser()
    this.props.history.goBack()
  }

  render() {
    const actions = [
      {
        value: 'Cancel',
        onClick: this.onCancel,
        type: 'button',
        otherProps: { 'aria-label': 'Cancel and close form' }
      },
      {
        value: 'Save',
        type: 'submit',
        disabled: !!(this.props.form.asyncErrors || this.props.form.syncErrors),
        otherProps: { 'aria-label': 'Save form' }
      }
    ]

    const roles = [
      { value: 'Admin', label: 'Admin' },
      { value: 'Coordinator', label: 'Coordinator' },
      { value: 'Coder', label: 'Coder' }
    ]

    return (
      <ModalForm
        open={true}
        title={this.state.selectedUser ? 'Edit User' : 'Add New User'}
        actions={actions}
        form="addEditUser"
        handleSubmit={this.handleSubmit}
        asyncValidate={this.validateEmail}
        initialValues={this.state.selectedUser || {}}
        asyncBlurFields={['email']}
        onClose={this.props.onCloseModal}
        width="600px"
        height="400px">
        <Container column style={{ minWidth: 550, minHeight: 275, padding: '30px 15px' }}>
          <Row displayFlex style={{ ...rowStyles, justifyContent: 'space-between' }}>
            {this.state.selectedUser ? <Column style={{ paddingRight: 30 }}>
              {(this.props.avatar) ? <Tooltip text="Edit photo" placement="top" aria-label="Edit picture" id="edit-picture">
                <TextLink
                  to={{
                    pathname: `/admin/edit/user/${this.state.selectedUser.id}/avatar`,
                    state: { isEdit: true, userId: this.state.selectedUser.id, avatar: this.state.selectedUser.avatar }
                  }}>
                  <Avatar
                    cardAvatar
                    style={{ width: '65px', height: '65px' }}
                    avatar={this.props.avatar} /></TextLink>
              </Tooltip>
                : <ReactFileReader base64={true} fileTypes={['.jpg']} handleFiles={this.openAvatarForm}>
                  <IconButton
                    color={'#757575'}
                    iconSize={50}
                    tooltipText="Add a photo"
                    id="add-user-photo">add_a_photo</IconButton></ReactFileReader>
              }
            </Column> : null}
            <Column flex style={{ paddingRight: 10 }}>
              <Field
                name="firstName"
                component={TextInput}
                label="First Name"
                placeholder="Enter First Name"
                validate={this.required}
                fullWidth={true} />
            </Column>
            <Column flex style={{ paddingLeft: 10 }}>
              <Field
                name="lastName"
                component={TextInput}
                label="Last Name"
                placeholder="Enter Last Name"
                validate={this.required}
                fullWidth={true} />
            </Column>
          </Row>
          <Row style={rowStyles}>
            <Field
              name="email"
              component={TextInput}
              label="Email"
              placeholder="Enter Email"
              validate={this.required}
              fullWidth={true} />
          </Row>
          <Row style={{ paddingBottom: 25 }}>
            <Field
              name="password"
              component={TextInput}
              label="Password"
              placeholder="Enter Password"
              validate={this.required}
              fullWidth={true} />
          </Row>
          <Row>
            <Field
              name="role"
              component={Dropdown}
              label="Role"
              options={roles}
              defaultValue=""
              id="role"
              style={{ display: 'flex' }} />
          </Row>
        </Container>
        <Route path="/admin/edit/user/:id/avatar" component={AvatarForm} />

      </ModalForm>
    )
  }
}

const getUserById = (users, id) => {
  const user = users.filter(user => user.id == id)
  if (user.length) return user[0]
  return null
}

const mapStateToProps = (state) => ({
  currentUser: state.data.user.currentUser || {},
  users: state.scenes.admin.main.users || [],
  form: state.form.addEditUser || {},
  avatar: state.scenes.admin.addEditUser.avatar || null,
  formName: 'addEditUser'
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  formActions: bindActionCreators(formActions, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withFormAlert(AddEditUser)))