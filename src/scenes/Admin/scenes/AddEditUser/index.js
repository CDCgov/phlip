import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Route } from 'react-router-dom'
import * as actions from './actions'
import Dropdown from 'components/Dropdown'
import { withRouter } from 'react-router-dom'
import { Field } from 'redux-form'
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
import Tooltip from 'components/Tooltip'
import compressImage from 'browser-compress-image'
import Alert from 'components/Alert'
import Typography from 'material-ui/Typography'
import CheckboxLabel from 'components/CheckboxLabel'
import CircularLoader from 'components/CircularLoader'

const rowStyles = {
  paddingBottom: 30
}

/**
 * Main / entry component for all things related to adding and editing a user. This component is a modal and is
 * rendered and mounted when the user clicks the 'Add New User' button or the 'Edit' link under the 'Edit' table header
 * in the User Management scene. The Edit or Add view is determined by the location and location.state props variables.
 * If a user is passed along, then it's edit, otherwise it's Add. This component is wrapped by the withFormAlert,
 * withTracking and react-redux's connect HOCs.
 */
export class AddEditUser extends Component {
  static propTypes = {
    /**
     * redux-form objet
     */
    form: PropTypes.object,
    /**
     * Name of redux-form
     */
    formName: PropTypes.string,
    /**
     * All users in system
     */
    users: PropTypes.array,
    /**
     * Avatar of current user being edited
     */
    avatar: PropTypes.string,
    /**
     * Current user being edited
     */
    currentUser: PropTypes.object,
    /**
     * Redux actions
     */
    actions: PropTypes.object,
    /**
     * redux-form actions
     */
    formActions: PropTypes.object,
    /**
     * react-router location object
     */
    location: PropTypes.object,
    /**
     * react-router match object
     */
    match: PropTypes.object,
    /**
     * browser history object
     */
    history: PropTypes.object,
    /**
     * Function passed in from withFormAlert HOC
     */
    onCloseModal: PropTypes.func,
    /**
     * Any error that occurred during updating or adding a user
     */
    formError: PropTypes.string,
    /**
     * Whether or not a response has been received from the backend
     */
    isDoneSubmitting: PropTypes.bool,
    /**
     * Function passed in from withFormAlert HOC
     */
    onSubmitError: PropTypes.func
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      file: null,
      selectedUser: null,
      open: false,
      submitting: false
    }
  }

  componentWillMount() {
    const id = this.props.match.params.id

    if (id && this.props.users.length > 0) {
      this.state.selectedUser = getUserById(this.props.users, id)
      this.props.actions.loadAddEditAvatar(this.state.selectedUser.avatar)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.submitting === true && this.props.isDoneSubmitting === true) {
      this.props.actions.resetSubmittingStatus()
      if (this.props.formError !== '') {
        this.props.onSubmitError(this.props.formError)
      } else {
        this.props.history.goBack()
      }
      this.setState({
        submitting: false
      })
    }
  }

  /**
   * Function called when the form is submitted. Dispatches redux actions to update or create a user depending on view.
   * Dispatches another action if the user being edited is the current user logged in.
   *
   * @public
   * @param {Object} values
   */
  handleSubmit = values => {
    this.setState({ submitting: true })

    let updatedValues = { ...values }
    for (let field of ['firstName', 'lastName']) {
      updatedValues[field] = trimWhitespace(values[field])
    }

    if (this.props.match.params.id) {
      this.props.actions.updateUserRequest({ role: 'Coordinator', ...updatedValues, avatar: this.props.avatar })
      if (this.props.currentUser.id === updatedValues.id) {
        this.props.actions.updateCurrentUser({ ...this.props.currentUser, ...updatedValues, avatar: this.props.avatar })
      }
    } else {
      this.props.actions.addUserRequest({ role: 'Coordinator', ...updatedValues })
    }
  }

  /**
   * Validates that an email in the form is not already used in another account. Throws an error if needed which is
   * caught by redux-form
   *
   * @public
   * @param {Object} values
   */
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

  /**
   * Opens another modal for removing / updating an avatar for the user. Opens the components/AvatarForm
   * component. Takes the first image in the list, compresses it and passes it to the form.
   *
   * @public
   * @param {Array} files
   */
  openAvatarForm = files => {
    const maxSize = 500000

    if (files.fileList[0].size > maxSize) {
      this.setState({ open: true })
    } else {
      compressImage(files.fileList[0], 0.2).then(({ shrunkBase64, compressedFile }) => {
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

  /**
   * Checks to make sure a value is defined, other returns 'Required' for displaying as a form error
   *
   * @public
   * @param value
   * @returns {*}
   */
  required = value => {
    if (!value && !this.props.match.params.id) {
      return 'Required'
    } else {
      return undefined
    }
  }

  getButtonText = text => {
    if (this.state.submitting) {
      return (
        <Fragment>
          {text}
          <CircularLoader size={18} style={{ paddingLeft: 10 }} />
        </Fragment>
      )
    } else {
      return <Fragment>{text}</Fragment>
    }
  }

  /**
   * Cancels any edits and closes this modal
   * @public
   */
  onCancel = () => {
    this.props.actions.onCloseAddEditUser()
    this.props.history.goBack()
  }

  /**
   * Closes alert that displays when the user tries to upload an image that is too large
   * @public
   */
  onAlertClose = () => {
    this.setState({ open: false })
  }

  render() {
    const alertActions = [
      {
        value: 'Close',
        type: 'button',
        onClick: this.onAlertClose
      }
    ]

    const actions = [
      {
        value: 'Cancel',
        onClick: this.onCancel,
        type: 'button',
        otherProps: { 'aria-label': 'Cancel and close form' }
      },
      {
        value: this.getButtonText('Save'),
        type: 'submit',
        disabled: this.state.submitting === true,
        otherProps: { 'aria-label': 'Save form' }
      }
    ]

    const roles = [
      { value: 'Admin', label: 'Admin' },
      { value: 'Coordinator', label: 'Coordinator' },
      { value: 'Coder', label: 'Coder' }
    ]

    return (
      <Fragment>
        <Alert actions={alertActions} open={this.state.open}>
          <Typography variant="body1">
            Maximum image file size is 500KB. Please try another image.
          </Typography>
        </Alert>
        <ModalForm
          open={true}
          title={this.state.selectedUser ? 'Edit User' : 'Add New User'}
          actions={actions}
          form="addEditUser"
          handleSubmit={this.handleSubmit}
          asyncValidate={this.validateEmail}
          initialValues={this.state.selectedUser || { isActive: true }}
          asyncBlurFields={['email']}
          onClose={this.props.onCloseModal}
          width="600px"
          height="400px">
          <Container column style={{ minWidth: 550, minHeight: 275, padding: '30px 15px' }}>
            <Row displayFlex style={{ ...rowStyles, justifyContent: 'space-between' }}>
              {this.state.selectedUser ? <Column style={{ paddingRight: 30 }}>
                {(this.props.avatar) ? <Tooltip
                    text="Edit photo"
                    placement="top"
                    aria-label="Edit picture"
                    id="edit-picture">
                    <TextLink
                      to={{
                        pathname: `/admin/edit/user/${this.state.selectedUser.id}/avatar`,
                        state: {
                          isEdit: true,
                          userId: this.state.selectedUser.id,
                          avatar: this.state.selectedUser.avatar
                        }
                      }}>
                      <Avatar
                        cardAvatar
                        style={{ width: '65px', height: '65px' }}
                        userName={`${this.state.selectedUser.firstName} ${this.state.selectedUser.lastName}`}
                        avatar={this.props.avatar} /></TextLink>
                  </Tooltip>
                  : <ReactFileReader base64={true} fileTypes={['.jpg', 'png']} handleFiles={this.openAvatarForm}>
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
                  placeholder="Enter first name"
                  validate={this.required}
                  required
                  shrinkLabel
                  fullWidth
                />
              </Column>
              <Column flex style={{ paddingLeft: 10 }}>
                <Field
                  name="lastName"
                  component={TextInput}
                  label="Last Name"
                  required
                  shrinkLabel
                  placeholder="Enter last name"
                  validate={this.required}
                  fullWidth
                />
              </Column>
            </Row>
            <Row style={rowStyles}>
              <Field
                name="email"
                component={TextInput}
                label="Email"
                shrinkLabel
                required
                placeholder="Enter email"
                validate={this.required}
                fullWidth
              />
            </Row>
            <Row displayFlex flex>
              <Column flex style={{ paddingRight: 10 }}>
                <Field
                  name="role"
                  component={Dropdown}
                  label="Role"
                  options={roles}
                  defaultValue=""
                  id="role"
                  style={{ display: 'flex' }} />
              </Column>
              <Column flex>
                <Field name="isActive" component={CheckboxLabel} label="Active" style={{ display: '10px' }} />
              </Column>
            </Row>

          </Container>
          <Route path="/admin/edit/user/:id/avatar" component={AvatarForm} />
        </ModalForm>
      </Fragment>
    )
  }
}

const getUserById = (users, id) => {
  const user = users.filter(user => user.id == id)
  if (user.length) return user[0]
  return null
}

const mapStateToProps = state => ({
  currentUser: state.data.user.currentUser || {},
  users: state.scenes.admin.main.users || [],
  form: state.form.addEditUser || {},
  avatar: state.scenes.admin.addEditUser.avatar || null,
  formName: 'addEditUser',
  formError: state.scenes.admin.addEditUser.formError || '',
  isDoneSubmitting: state.scenes.admin.addEditUser.isDoneSubmitting || false
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
  formActions: bindActionCreators(formActions, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withFormAlert(AddEditUser)))