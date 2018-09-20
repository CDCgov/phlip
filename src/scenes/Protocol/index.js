import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Container from 'components/Layout'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Card from 'components/Card'
import * as actions from './actions'
import PageHeader from 'components/PageHeader'
import Alert from 'components/Alert'
import Icon from 'components/Icon'
import CardError from 'components/CardError'
import Typography from '@material-ui/core/Typography'
import withTracking from 'components/withTracking'

import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/modern/theme'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/link'
import 'tinymce/plugins/image'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/table'
import 'tinymce/plugins/paste'
//import 'tinymce/plugins/anchor'
//import 'tinymce/plugins/pagebreak'

import { Editor } from '@tinymce/tinymce-react'

/**
 * Protocol viewer and editor component. Rendered when the user clicks 'Edit' under the Protocol table header in the
 * project list or one of the Protocol buttons in the page header on various pages.
 */
export class Protocol extends Component {
  static propTypes = {
    /**
     * Name of project for which the protocol was opened
     */
    projectName: PropTypes.string,
    /**
     * ID of project for which the protocol was opened
     */
    projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Contents to render in the protoocl editor and view
     */
    protocolContent: PropTypes.string,
    /**
     * Whether or not an error occurred while trying to get the protocol
     */
    getProtocolError: PropTypes.bool,
    /**
     * Whether or not an API request is executing for saving the protocol
     */
    submitting: PropTypes.bool,
    /**
     * Whether or not the protocol is checked out by the current user logged in
     */
    lockedByCurrentUser: PropTypes.bool,
    /**
     * Locked / checked out information for the protocol
     */
    lockInfo: PropTypes.object,
    /**
     * Anything that should be shown inside an alert related to the checking out of the protocol
     */
    lockedAlert: PropTypes.string,
    /**
     * Whether or not the protocol is currently checked out
     */
    hasLock: PropTypes.bool,
    /**
     * Any error that should be displayed in an alert
     */
    alertError: PropTypes.string,
    /**
     * Redux actions object
     */
    actions: PropTypes.object
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      editMode: false,
      open: false,
      alertText: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.submitting === true) {
      if (nextProps.saveError !== true) {
        this.setState({
          editMode: false
        })
      }
    }

    if (this.props.lockedByCurrentInfo !== true && nextProps.lockedByCurrentUser === true) {
      this.setState({
        editMode: true
      })
    }
  }

  componentWillMount() {
    this.props.actions.getProtocolRequest(this.props.projectId)
  }

  componentWillUnmount() {
    this.props.actions.clearState()
  }

  componentDidMount() {}

  /**
   * Calls a redux action to request to checkout the protocol. Invoked when the user clicks the 'Edit' button
   * @public
   */
  onEnableEdit = () => {
    this.props.actions.lockProtocolRequest(this.props.projectId)
  }

  /**
   * Closes any alert erorr that might be open
   * @public
   */
  onCloseAlert = () => {
    this.props.actions.resetAlertError()
  }

  /**
   * Calls redux actions to save and unlock protocol. Invoked when the user clicks the 'Save' button
   * @public
   */
  onSaveProtocol = () => {
    this.props.actions.saveProtocolRequest(this.props.protocolContent, this.props.projectId)
    this.props.actions.unlockProtocolRequest(this.props.projectId)
    this.props.actions.updateEditedFields(this.props.projectId)
  }

  /**
   * Closes the alert that shows when the user clicks the 'back' arrow while still in edit mode, and then hit 'Cancel'
   * in the alert
   * @public
   */
  onClose = () => {
    this.setState({
      open: false,
      alertText: ''
    })
  }

  /**
   * Closes any alert related to locking / checking out of the protocol
   * @public
   */
  onCloseLockedAlert = () => {
    this.props.actions.resetLockAlert()
  }

  /**
   * Invoked when the user hits 'Save' in the alert that shows when the user clicks the 'back' arrow while still in edit
   * mode. Sends a request to save the protocol, and goes back one in browser history.
   * @public
   */
  onContinue = () => {
    this.onSaveProtocol()
    this.props.history.goBack()
  }

  /**
   * If in edit mode, opens an alert to let the user know they are still in edit mode. Invoked when the user clicks the 'back' arrow while
   * still in edit mode. If not in edit mode, goes back once in browser history.
   * @public
   */
  onGoBack = () => {
    if (this.props.lockedByCurrentUser || this.state.editMode) {
      this.setState({
        open: true,
        alertText: 'Your unsaved changes will be lost.'
      })
    } else {
     this.props.history.goBack()
    }
  }

  render() {
    const alertActions = [
      {
        value: 'Cancel',
        type: 'button',
        onClick: this.onClose
      },
      {
        value: 'Save',
        type: 'button',
        onClick: this.onContinue
      }
    ]
    return (
      <Container flex column style={{ flexWrap: 'nowrap', padding: '20px 30px' }}>
        <Alert open={this.state.open} actions={alertActions}>
          <Typography variant="body1">
            {this.state.alertText}
          </Typography>
        </Alert>
        <Alert
          actions={[{ value: 'Dismiss', type: 'button', onClick: this.onCloseLockedAlert }]}
          open={this.props.lockedAlert !== null}
          title={<Fragment><Icon size={30} color="primary" style={{ paddingRight: 10 }}>lock</Icon>
            The Protocol is unavailable to edit.</Fragment>}>
          <Typography variant="body1">
            {`${this.props.lockInfo.firstName} ${this.props.lockInfo.lastName} `} is currently editing the protocol.
            You will not be able to edit until they are done editing and have saved their changes.
          </Typography>
        </Alert>
        <PageHeader
          projectName={this.props.projectName}
          projectId={this.props.projectId}
          pageTitle="Protocol"
          protocolButton={false}
          onBackButtonClick={this.onGoBack}
          otherButton={this.props.getProtocolError ? {} : {
            isLink: false,
            text: this.state.editMode ? 'Save' : 'Edit',
            onClick: this.state.editMode ? this.onSaveProtocol : this.onEnableEdit,
            style: { color: 'black', backgroundColor: 'white' },
            otherProps: { 'aria-label': this.state.editMode ? 'Edit protocol' : 'Save protocol' },
            show: this.props.getProtocolError !== true
          }}
        />
        <Alert
          actions={[{ value: 'Dismiss', type: 'button', onClick: this.onCloseAlert }]}
          open={this.props.alertError !== ''}
          title={<Fragment><Icon size={30} color="red" style={{ paddingRight: 10 }}>sentiment_very_dissatisfied</Icon>
            Uh-oh! Something went wrong.</Fragment>}>
          <Typography variant="body1">
            {this.props.alertError}
          </Typography>
        </Alert>
        {this.state.editMode
          ? <Card id="tiny">
            <Editor
              init={{
                statusbar: false,
                plugins: ['paste', 'link', 'image', 'lists', 'advlist', 'table', 'paste'],
                toolbar: 'undo redo | \
                          styleselect | \
                          bold italic strikethrough underline | \
                          table | \
                          alignleft alignright aligncenter alignjustify | \
                          numlist bullist | \
                          link image',
                theme: 'modern',
                skin_url: '/skins/custom',
                branding: false,
                resize: false,
                menubar: false,
                content_style: '* {font-family: Roboto }',
                advlist_bullet_styles: 'default,circle,square,disc',
                link_title: false,
                target_list: false,
                link_assume_external_targets: true,
                default_link_target: '_blank',
                anchor_bottom: false,
                anchor_top: false
              }}
              onChange={e => this.props.actions.updateProtocol(e.target.getContent())}
              initialValue={this.props.protocolContent}
            />
          </Card>
          : this.props.getProtocolError === true
            ? <CardError>We failed to get the protocol for this project. Please try again later.</CardError>
            : <Card
              style={{ padding: 25, fontFamily: 'Roboto', overflow: 'auto' }}
              dangerouslySetInnerHTML={{ __html: this.props.protocolContent }} />
        }
      </Container>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  projectName: state.scenes.home.main.projects.byId[ownProps.match.params.id].name,
  projectId: ownProps.match.params.id,
  protocolContent: state.scenes.protocol.content || '',
  getProtocolError: state.scenes.protocol.getProtocolError || null,
  submitting: state.scenes.protocol.submitting || false,
  lockedByCurrentUser: state.scenes.protocol.lockedByCurrentUser || false,
  lockInfo: state.scenes.protocol.lockInfo || {},
  lockedAlert: state.scenes.protocol.lockedAlert || null,
  hasLock: Object.keys(state.scenes.protocol.lockInfo).length > 0 || false,
  alertError: state.scenes.protocol.alertError || ''
})

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(withTracking(Protocol, 'Protocol'))