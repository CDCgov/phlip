import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import { Avatar } from 'components'
import Divider from '@material-ui/core/Divider'
import { withRouter } from 'react-router'
import actions from '../../actions'
import { default as formActions } from 'redux-form/lib/actions'

export class AvatarForm extends Component {
  static propTypes = {
    location: PropTypes.object,
    history: PropTypes.object,
    currentUser: PropTypes.object,
    actions: PropTypes.object,
    selectedUser: PropTypes.object
  }
  
  constructor(props, context) {
    super(props, context)
  }
  
  onCloseModal = () => {
    this.props.history.goBack()
  }
  
  handleSubmit = () => {
    const { location, actions, history, selectedUser, currentUser } = this.props
    
    const base64Image = location.state.avatar
    const patchOperation = [{ 'op': 'replace', 'path': '/avatar', 'value': base64Image }]
    
    actions.addUserPictureRequest(location.state.userId, patchOperation, selectedUser)
    if (location.state.userId === currentUser.id) {
      actions.updateCurrentUserAvatar(location.state.avatar)
    }
    history.goBack()
  }
  
  handleDeleteAvatar = () => {
    const { location, actions, history, selectedUser, currentUser } = this.props
    
    const patchRemoveOperation = [{ 'op': 'remove', 'path': '/avatar' }]
    actions.deleteUserPictureRequest(location.state.userId, patchRemoveOperation, selectedUser)
    if (location.state.userId === currentUser.id) {
      actions.removeCurrentUserAvatar()
    }
    history.goBack()
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
        onClick: this.handleSubmit,
        otherProps: { 'aria-label': 'Save form' }
      }
    ]
    
    const formEditActions = [
      { value: 'Cancel', onClick: this.onCloseModal, type: 'button' },
      { value: 'Remove', onClick: this.handleDeleteAvatar, type: 'button' }
    ]
    
    const { location, selectedUser } = this.props
    
    return (
      <Modal onClose={this.onCloseModal} open maxWidth="xs" height="450px" width="315px">
        <ModalTitle title={location.state.isEdit ? 'View image' : 'Preview image'} />
        <Divider />
        <ModalContent
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 280,
            paddingTop: 24,
            alignItems: 'center'
          }}>
          {location.state.isEdit
            ? (
              <Avatar
                cardAvatar
                style={{ width: '200px', height: '200px' }}
                avatar={location.state.avatar}
                userName={`${selectedUser.firstName} ${selectedUser.lastName}`}
              />
            )
            : (
              <Avatar
                cardAvatar
                style={{ width: '200px', height: '200px' }}
                avatar={location.state.avatar}
              />
            )}
        </ModalContent>
        <ModalActions actions={location.state.isEdit ? formEditActions : formActions} />
      </Modal>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  currentUser: state.data.user.currentUser || {},
  selectedUser: ownProps.location.state.ownAvatar
    ? state.data.user.currentUser
    : state.scenes.admin.main.users.find(user => user.id === ownProps.location.state.userId)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  formActions: bindActionCreators(formActions, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AvatarForm))
