import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Container from 'components/Layout'
import Header from './components/Header'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/modern/theme'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/link'
import { Editor } from '@tinymce/tinymce-react'

export class Protocol extends Component {
  static propTypes = {}

  constructor(props, context) {
    super(props, context)
  }

  componentWillMount() {
    require.context(
      '!file-loader?name=[path][name].[ext]&context=node_modules/tinymce!tinymce/skins',
      true,
      /.*/
    )

    tinymce.init({
      selector: '#tiny',
      plugins: ['paste', 'link']
    })
  }

  render() {
    return (
      <Container column flex>
        <Header projectName={this.props.projectName} projectId={this.props.projectId} />
        <Editor initialValue="<p>Initial value</p>" />
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