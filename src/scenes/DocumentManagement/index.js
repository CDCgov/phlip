import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from 'components/FlexGrid'
import PageHeader from 'components/PageHeader'
import DocList from './components/DocList'
import actions from './actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Route } from 'react-router-dom'
import Upload from './scenes/Upload'

/**
 * DocumentManagement main scene component. This is the first view the user sees when they switch over to the
 * document management global menu item
 */
export class DocumentManagement extends Component {
  static propTypes = {
    /**
     * An array of document Ids
     */
    documents: PropTypes.array,

    /**
     * Total number of documents
     */
    docCount: PropTypes.number,

    /**
     * Currently selected number of rows to show per page
     */
    rowsPerPage: PropTypes.string,

    /**
     * Current page in table
     */
    page: PropTypes.number,

    /**
     * Redux actions
     */
    actions: PropTypes.object,

    /**
     * Whether or not the checkbox table header has been clicked, selecting all files
     */
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

/* istanbul ignore next */
const mapStateToProps = state => {
  return {
    documents: state.scenes.docManage.main.documents.visible,
    docCount: state.scenes.docManage.main.documents.allIds.length,
    page: state.scenes.docManage.main.page,
    rowsPerPage: state.scenes.docManage.main.rowsPerPage,
    allSelected: state.scenes.docManage.main.allSelected
  }
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(DocumentManagement)