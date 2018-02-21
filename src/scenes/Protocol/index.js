import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Container, { Row } from 'components/Layout'
import Header from './components/Header'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Card from 'components/Card'
import styles from './editor-styles.scss'

import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/modern/theme'
import 'tinymce/themes/inlite/theme'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/link'
import { Editor } from '@tinymce/tinymce-react'

export class Protocol extends Component {
  static propTypes = {}

  constructor(props, context) {
    super(props, context)

    this.state = {
      editMode: false
    }

    tinymce.init({
      selector: '#tiny'
    })
  }

  componentWillMount() {
    require.context(
      '!file-loader?name=[path][name].[ext]&context=node_modules/tinymce!tinymce/skins',
      true,
      /.*/
    )
  }

  onToggleEdit = () => {
    this.setState({
      editMode: !this.state.editMode
    })
  }

  render() {
    return (
      <Container flex column style={{ paddingBottom: 20 }}>
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
                plugins: ['paste', 'link'],
                theme: 'modern',
                skin_url: '/skins/custom',
                branding: false,
                resize: false,
                menubar: false
              }}
              initialValue="<p>Initial value</p>"
            />
          </Card>
          : <Card></Card>
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
  projectId: ownProps.match.params.id
})

//const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps)(Protocol)