import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Container, { Row } from 'components/Layout'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Card from 'components/Card'
import * as actions from './actions'
import PageHeader from 'components/PageHeader'

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
    actions: PropTypes.object
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      editMode: false
    }
  }

  componentWillMount() {
    this.props.actions.getProtocolRequest(this.props.projectId)
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

  onSaveProtocol = () => {
    this.setState({
      editMode: false
    })

    this.props.actions.saveProtocolRequest(this.props.protocolContent, this.props.projectId)
    this.props.actions.updateEditedFields(this.props.projectId)
  }

  render() {
    return (
      <Container flex column style={{ paddingBottom: 20, flexWrap: 'nowrap' }}>
        <PageHeader
          projectName={this.props.projectName}
          showButton
          projectId={this.props.projectId}
          pageTitle="Protocol"
          protocolButton={false}
          otherButton={{
            isLink: false,
            text: this.state.editMode ? 'Save' : 'Edit',
            onClick: this.state.editMode ? this.onSaveProtocol : this.onEnableEdit,
            style: { color: 'black', backgroundColor: 'white',  fontWeight: 'bold' }
          }}
        />
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
          : <Card
            style={{ padding: 25, fontFamily: 'Roboto', overflow: 'auto' }}
            dangerouslySetInnerHTML={{ __html: this.props.protocolContent }}
          />
        }
      </Container>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  projectName: state.scenes.home.main.projects.byId[ownProps.match.params.id].name,
  projectId: ownProps.match.params.id,
  protocolContent: state.scenes.protocol.content || ''
})

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(Protocol)