import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Container, { Row } from 'components/Layout'
import Header from './components/Header'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Card from 'components/Card'
import * as actions from './actions'
import tinymce from 'tinymce/tinymce'

import 'tinymce/themes/modern/theme'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/link'
import 'tinymce/plugins/image'

import { Editor } from '@tinymce/tinymce-react'

export class Protocol extends Component {
  static propTypes = {}

  constructor(props, context) {
    super(props, context)

    this.state = {
      editMode: false
    }
  }

  componentDidMount() {
    require.context(
      '!file-loader?name=[path][name].[ext]&context=node_modules/tinymce!tinymce/skins',
      true,
      /.*/
    )
  }

  componentWillUnmount() {
    tinymce.remove(this.state.editor)
  }

  onToggleEdit = () => {
    this.setState({
      editMode: !this.state.editMode
    })
  }

  render() {
    return (
      <Container flex column style={{ paddingBottom: 20, flexWrap: 'nowrap' }}>
        <Header
          projectName={this.props.projectName}
          projectId={this.props.projectId}
          onToggleEdit={this.onToggleEdit}
          editEnabled={this.state.editMode}
        />
        {this.state.editMode
          ? <Card id="tiny">
            <Editor
              init={{
                statusbar: false,
                plugins: ['paste', 'link', 'image'],
                toolbar: 'undo redo | styleselect | bold italic strikethrough underline | alignleft alignright aligncenter alignjustify | link image',
                theme: 'modern',
                skin_url: '/skins/custom',
                branding: false,
                resize: false,
                menubar: false,
                content_style: '* {font-family: Roboto }'
              }}
              onChange={e => this.props.actions.updateProtocol(e.target.getContent())}
              initialValue={this.props.protocolContent}
            />
          </Card>
          : <Card style={{ padding: 25, fontFamily: 'Roboto', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: this.props.protocolContent }}></Card>
        }
      </Container>
    )
  }
}

Protocol.propTypes = {
  projectName: PropTypes.string,
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

const mapStateToProps = (state, ownProps) => ({
  projectName: state.scenes.home.main.projects.byId[ownProps.match.params.id].name,
  projectId: ownProps.match.params.id,
  protocolContent: state.scenes.protocol.content || ''
})

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(Protocol)