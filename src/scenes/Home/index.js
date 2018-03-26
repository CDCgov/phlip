import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Route } from 'react-router-dom'
import { matchPath } from 'react-router'
import { withTheme } from 'material-ui/styles'
import Divider from 'material-ui/Divider'
import CardError from 'components/CardError'
import Container from 'components/Layout'
import PageHeader from 'components/PageHeader'
import ProjectList from './components/ProjectList'
import AddEditProject from './scenes/AddEditProject'
import * as actions from './actions'
import AddEditJurisdictions from './scenes/AddEditJurisdictions'
import PageNotFound from 'components/PageNotFound'
import ExportDialog from './components/ExportDialog'

const nonCoderPaths = [
  '/project/add',
  '/project/:id/jurisdictions',
  '/project/:id/jurisdictions/add',
  '/project/:id/jurisdictions/:jid/edit'
]

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

  onChooseExport = () => {
    window.open(`/project/${this.state.projectToExport}/export`, '_blank')
    this.setState({
      exportDialogOpen: false,
      projectToExport: null
    })
  }

  renderErrorMessage = () => (
    <CardError>
      {`Uh-oh, something went wrong. ${this.props.errorContent}`}
    </CardError>
  )

  checkIfExact = () => {
    let isAllowed = false
    nonCoderPaths.forEach(path => {
      if (matchPath(this.props.location.pathname, { path }) !== null) isAllowed = true
    })
    return isAllowed
  }

  render() {
    return (
      <Fragment>
        <Route
          path="/"
          exact={this.props.user.role === 'Coder' && this.checkIfExact()} render={() => (
          <Container column flex style={{ paddingBottom: '25px' }}>
            <PageHeader
              showButton={this.props.user.role !== 'Coder'}
              pageTitle="Project List"
              protocolButton={false}
              projectName=""
              otherButton={{
                isLink: true, text: '+ Create New Project', path: '/project/add', state: { userDefined: null }, props: {
                  'aria-label': 'Create New Project'
                }
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
        } />
        <Route path="/project/edit/:id" component={AddEditProject} />
        <Route path="/project/add" component={this.props.user.role === 'Coder' ? PageNotFound : AddEditProject} />
        <Route
          path="/project/:id/jurisdictions"
          component={this.props.user.role === 'Coder' ? PageNotFound : AddEditJurisdictions} />
      </Fragment>
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
