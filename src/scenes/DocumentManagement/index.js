import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from 'components/Grid'
import PageHeader from 'components/PageHeader'
import DocList from './components/DocList'
import actions from './actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Route } from 'react-router-dom'
import Upload from './scenes/Upload'

export class DocumentManagement extends Component {
  static propTypes = {
  }

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this.props.actions.getDocumentsRequest()
  }

  render() {
    return (
      <Grid container flex padding="20px 30px">
        <PageHeader
          showButton={true}
          pageTitle="Document Management"
          protocolButton={false}
          projectName=""
          entryScene={true}
          icon="description"
          otherButton={{
            isLink: true,
            text: '+ Upload New',
            path: '/docs/upload',
            state: { modal: true },
            props: { 'aria-label': 'Upload New Documents' },
            show: true
          }}
        />
        <DocList documents={this.props.documents} />
        <Route path="/docs/upload" component={Upload} />
      </Grid>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    documents: state.scenes.docManage.main.documents
  }
}

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch )})

export default connect(mapStateToProps, mapDispatchToProps)(DocumentManagement)