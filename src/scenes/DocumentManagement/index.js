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
    documents: PropTypes.array,
    docCount: PropTypes.number,
    rowsPerPage: PropTypes.string,
    page: PropTypes.number,
    actions: PropTypes.object,
    allSelected: PropTypes.bool
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
        <DocList
          documents={this.props.documents}
          docCount={this.props.docCount}
          onChangePage={this.props.actions.handlePageChange}
          onChangeRows={this.props.actions.handleRowsChange}
          onSelectAllFiles={this.props.actions.handleSelectAll}
          onSelectOneFile={this.props.actions.handleSelectOneFile}
          allSelected={this.props.allSelected}
          page={this.props.page}
          rowsPerPage={this.props.rowsPerPage}
        />
        <Route path="/docs/upload" component={Upload} />
      </Grid>
    )
  }
}

const mapStateToProps = state => {
  return {
    documents: state.scenes.docManage.main.documents.visible,
    docCount: state.scenes.docManage.main.documents.allIds.length,
    page: state.scenes.docManage.main.page,
    rowsPerPage: state.scenes.docManage.main.rowsPerPage,
    allSelected: state.scenes.docManage.main.allSelected
  }
}

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(DocumentManagement)