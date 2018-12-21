import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FlexGrid from 'components/FlexGrid'
import PageHeader from 'components/PageHeader'
import DocList from './components/DocList'
import SearchBox from './components/SearchBox'
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
    allSelected: PropTypes.bool,
    searchValue: PropTypes.string,
    projectSearchValue: PropTypes.string,
    jurisdictionSearchValue: PropTypes.string,
    projectSuggestions: PropTypes.array,
    jurisdictionSuggestions: PropTypes.array
  }

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this.props.actions.getDocumentsRequest()
  }

  render() {
    return (
      <FlexGrid container flex padding="12px 20px 20px 20px">
        <PageHeader
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
          }}>
          <SearchBox />
        </PageHeader>
        <FlexGrid container flex raised>
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
        </FlexGrid>
        <Route path="/docs/upload" component={Upload} />
      </FlexGrid>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = state => {
  const docManage = state.scenes.docManage
  return {
    documents: docManage.main.documents.visible,
    docCount: docManage.main.documents.allIds.length,
    page: docManage.main.page,
    rowsPerPage: docManage.main.rowsPerPage,
    allSelected: docManage.main.allSelected
  }
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  actions: {
    ...bindActionCreators(actions, dispatch)
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(DocumentManagement)