import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import ReactFileReader from 'react-file-reader'
import Avatar from 'components/Avatar'
import Divider from 'material-ui/Divider'
import AvatarEditor from 'react-avatar-editor'
import { withRouter } from 'react-router'
import Container, { Row, Column } from 'components/Layout'
import FormModal from 'components/FormModal'
import * as actions from '../../actions'
import { default as formActions } from 'redux-form/lib/actions'


export class AvatarForm extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      editFile: this.props.location.state,
      userId: this.props.location.state.userId,
      isEdit: this.props.location.state.isEdit
    }
  }

  onCloseModal = () => {
    this.props.history.goBack()
  }

  onSubmitForm = () => {
    const base64Image = this.state.editFile.file.base64
    let patchOperation = [{ 'op': 'replace', 'path': '/avatar', 'value': base64Image }]

    this.props.actions.addUserPictureRequest(this.state.userId, patchOperation)
    if (this.state.userId === this.props.currentUser.id) {
      this.props.actions.updateCurrentUserAvatar(this.state.editFile.file.base64)
    }
  }

  handleDeleteAvatar = () => {
    const patchRemoveOperation = [{ 'op': 'remove', 'path': '/avatar' }]
    this.props.actions.deleteUserPictureRequest(this.state.userId, patchRemoveOperation)
    if (this.state.userId === this.props.currentUser.id) {
      this.props.actions.removeCurrentUserAvatar()
    }
    this.props.history.goBack()
  }

  render() {
    const formActions = [
      {
        value: 'Cancel',
        onClick: this.onCloseModal,
        type: 'button',
        otherProps: { 'aria-label': 'Cancel and close form' }
      },
      {
        value: 'Save',
        type: 'submit',
        otherProps: { 'aria-label': 'Save form' }
      }
    ]
    const formEditActions = [
      { value: 'Cancel', onClick: this.onCloseModal, type: 'button' },
      { value: 'Remove', onClick: this.handleDeleteAvatar, type: 'button', },
      // { value: 'Save', type: 'submit' }
    ]
    return (
      <FormModal
        form="avatarForm"
        handleSubmit={this.onSubmitForm}
        onClose={this.onCloseModal}
        open={true}
        maxWidth="xs"
        hideOverflow height="450px" width="315px">
        <ModalTitle title={this.state.isEdit ? 'View image' : 'Preview image'} />
        <Divider />
        <ModalContent style={{ display: 'flex', flexDirection: 'column' }}>
          {this.state.isEdit
            ? <Container flex style={{ padding: '15px 0 0 38px', width: '280px' }}>
              <Avatar cardAvatar style={{ width: '200px', height: '200px' }} avatar={this.props.location.state.avatar} />
            </Container>
            : <Container flex style={{ padding: '15px 0 0 38px', width: '280px' }}>
              <Avatar cardAvatar style={{ width: '200px', height: '200px' }} avatar={this.state.editFile.file.base64} />
            </Container>}
        </ModalContent>
        <ModalActions edit={true} actions={this.state.isEdit ? formEditActions : formActions}></ModalActions>
      </FormModal>
    )
  }
}
const mapStateToProps = (state) => ({
  currentUser: state.data.user.currentUser || {},
  users: state.scenes.admin.main.users || [],
  form: state.form.avatarForm || {},
  formName: 'avatarForm'
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  formActions: bindActionCreators(formActions, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AvatarForm))