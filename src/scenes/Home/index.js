import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withTheme } from 'material-ui/styles'
import Divider from 'material-ui/Divider'
import CardError from 'components/CardError'
import Container from 'components/Layout'
import PageHeader from 'components/PageHeader'
import ProjectList from './components/ProjectList'
import * as actions from './actions'
import ExportDialog from './components/ExportDialog'

export class Home extends Component {
  static propTypes = {
    user: PropTypes.object,
    actions: PropTypes.object,
    visibleProjects: PropTypes.arrayOf(PropTypes.number),
    page: PropTypes.number,
    rowsPerPage: PropTypes.string,
    sortBy: PropTypes.string,
    direction: PropTypes.string,
    searchValue: PropTypes.string,
    error: PropTypes.bool,
    errorContent: PropTypes.string
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      exportDialogOpen: false,
      projectToExport: null
    }
  }

  componentWillMount() {
    this.props.actions.getProjectsRequest()
  }

  onToggleExportDialog = projectId => {
    this.setState({
      exportDialogOpen: !this.state.exportDialogOpen,
      projectToExport: projectId
    })
  }

  onChooseExport = type => {
    window.location.href = `/api/exports/project/${this.state.projectToExport}/data?type=${type}`
    this.setState({
      exportDialogOpen: false,
      projectToExport: null
    })
  }

  renderErrorMessage = () => (
    <CardError>
      {`Uh-oh! Something went wrong. ${this.props.errorContent}`}
    </CardError>
  )

  render() {
    return (
      <Container column flex style={{ paddingBottom: '25px' }}>
        <PageHeader
          showButton={this.props.user.role !== 'Coder'}
          pageTitle="Project List"
          protocolButton={false}
          projectName=""
          otherButton={{
            isLink: true,
            text: '+ Create New Project',
            path: '/project/add',
            state: { userDefined: null, modal: true },
            props: { 'aria-label': 'Create New Project' },
            show: this.props.user.role !== 'Coder'
          }} />
        <Divider />
        {this.props.error
          ? this.renderErrorMessage()
          : <ProjectList
            user={this.props.user}
            projectIds={this.props.visibleProjects}
            projectCount={this.props.projectCount}
            page={this.props.page}
            rowsPerPage={this.props.rowsPerPage}
            sortBy={this.props.sortBy}
            direction={this.props.direction}
            sortBookmarked={this.props.sortBookmarked}
            searchValue={this.props.searchValue}
            handleExport={this.onToggleExportDialog}
            handleSearchValueChange={event => this.props.actions.updateSearchValue(event.target.value)}
            handleRequestSort={this.props.actions.sortProjects}
            handlePageChange={this.props.actions.updatePage}
            handleRowsChange={this.props.actions.updateRows}
            handleSortBookmarked={() => this.props.actions.sortBookmarked(!this.props.sortBookmarked)} />
        }
        <ExportDialog
          open={this.state.exportDialogOpen}
          onChooseExport={this.onChooseExport}
          onClose={this.onToggleExportDialog} />
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.data.user.currentUser,
  visibleProjects: state.scenes.home.main.visibleProjects,
  page: state.scenes.home.main.page,
  rowsPerPage: state.scenes.home.main.rowsPerPage,
  sortBy: state.scenes.home.main.sortBy,
  direction: state.scenes.home.main.direction,
  searchValue: state.scenes.home.main.searchValue || '',
  sortBookmarked: state.scenes.home.main.sortBookmarked,
  error: state.scenes.home.main.error,
  errorContent: state.scenes.home.main.errorContent,
  projectCount: state.scenes.home.main.projectCount || 0
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default withTheme()(connect(mapStateToProps, mapDispatchToProps)(Home))
