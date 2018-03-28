import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Container, { Row } from 'components/Layout'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Card from 'components/Card'
import * as actions from './actions'
import PageHeader from 'components/PageHeader'
import Alert from 'components/Alert'
import Icon from 'components/Icon'
import CardError from 'components/CardError'
import Typography from 'material-ui/Typography'

import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/modern/theme'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/link'
import 'tinymce/plugins/image'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/table'
import 'tinymce/plugins/paste'

import { Editor } from '@tinymce/tinymce-react'

export class Protocol extends Component {
  static propTypes = {
    projectName: PropTypes.string,
    projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    protocolContent: PropTypes.string,
    actions: PropTypes.object,
    getProtocolError: PropTypes.bool,
    saveError: PropTypes.bool
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      editMode: false,
      open: false
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
  }

  componentWillMount() {
    this.props.actions.getProtocolRequest(this.props.projectId)
  }

  componentWillUnmount() {
    this.props.actions.clearState()
  }

  componentDidMount() {
    require.context(
      '!file-loader?name=[path][name].[ext]&context=node_modules/tinymce!tinymce/skins',
      true,
      /.*/
    )
  }

  onEnableEdit = () => {
    this.setState({
      editMode: true
    })
  }

  onCloseAlert = () => {
    this.props.actions.resetSaveError()
  }

  onSaveProtocol = () => {
    this.props.actions.saveProtocolRequest(this.props.protocolContent, this.props.projectId)
    this.props.actions.updateEditedFields(this.props.projectId)
  }

  onClose = () => {
    this.setState({
      open: false
    })
  }

  onContinue = () => {
    this.props.history.goBack()
  }

  onGoBack = () => {
    this.state.editMode ? this.setState({ open: true }) : this.props.history.goBack()
  }

  render() {
    const alertActions = [
      {
        value: 'Cancel',
        type: 'button',
        onClick: this.onClose
      },
      {
        value: 'Continue',
        type: 'button',
        onClick: this.onContinue
      }
    ]
    return (
      <Container flex column style={{ paddingBottom: 20, flexWrap: 'nowrap' }}>
        <Alert open={this.state.open} actions={alertActions}>
          <Typography variant="body1">
            You have unsaved changes that will be lost if you decide to continue. Are you sure you want to continue?
          </Typography>
        </Alert>
        <PageHeader
          projectName={this.props.projectName}
          showButton={this.props.getProtocolError !== true}
          projectId={this.props.projectId}
          pageTitle="Protocol"
          protocolButton={false}
          onBackButtonClick={this.onGoBack}

          otherButton={this.props.getProtocolError ? {} : {
            isLink: false,
            text: this.state.editMode ? 'Save' : 'Edit',
            onClick: this.state.editMode ? this.onSaveProtocol : this.onEnableEdit,
            style: { color: 'black', backgroundColor: 'white' },
            otherProps: { 'aria-label': this.state.editMode ? 'Edit protocol' : 'Save protocol' }
          }}
        />
        <Alert
          actions={[{ value: 'Dismiss', type: 'button', onClick: this.onCloseAlert }]}
          open={this.props.saveError === true}
          title={<Fragment><Icon size={30} color="red" style={{ paddingRight: 10 }}>sentiment_very_dissatisfied</Icon>
            Uh-oh! Something went wrong.</Fragment>}>
          <Typography variant="body1">
            We couldn't save the protocol. Please try again later.
          </Typography>
        </Alert>
        {this.state.editMode
          ? <Card id="tiny">
            <Editor
              init={{
                statusbar: false,
                plugins: ['paste', 'link', 'image', 'anchor', 'pagebreak', 'lists', 'advlist', 'table', 'paste'],
                toolbar: 'undo redo | \
                          styleselect | \
                          bold italic strikethrough underline | \
                          anchor pagebreak | \
                          table | \
                          alignleft alignright aligncenter alignjustify | \
                          numlist bullist | \
                          link image',
                theme: 'modern',
                skin_url: '/skins/custom',
                branding: false,
                resize: false,
                menubar: 'insert',
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
            : <Card style={{ padding: 25, fontFamily: 'Roboto', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: this.props.protocolContent }} />
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
  saveError: state.scenes.protocol.saveError || null,
  submitting: state.scenes.protocol.submitting || false
})

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(Protocol)