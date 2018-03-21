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
    let patchOperation = [{ 'op': 'replace', 'path': '/avatar', 'value': this.state.editFile.file.base64 }]
    this.props.actions.addUserPictureRequest(this.state.userId, patchOperation)
  }

  handleDeleteAvatar = () => {
    const patchRemoveOperation = [{ 'op': 'remove', 'path': '/avatar' }]
    this.props.actions.deleteUserPictureRequest(this.state.userId, patchRemoveOperation)
    this.props.history.goBack()
  }

  render() {
    const formActions = [
      { value: 'Cancel', onClick: this.onCloseModal, type: 'button' },
      { value: 'Save', type: 'submit' }
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
              <Avatar cardAvatar style={{ width: '200px', height: '200px' }} src={this.props.form.values.avatarUrl} />
            </Container>
            : <Container flex style={{ padding: '15px 0 0 38px', width: '280px' }}>
              <Avatar cardAvatar style={{ width: '200px', height: '200px' }} src={this.state.editFile.file.base64} />
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
  form: state.form.addEditUser || {},
  formName: 'avatarForm'
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  formActions: bindActionCreators(formActions, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AvatarForm))