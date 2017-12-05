import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Route } from 'react-router-dom'
import { withTheme } from 'material-ui/styles'
import Divider from 'material-ui/Divider'
import CardError from 'components/CardError'
import Container from 'components/Layout'
import PageHeader from './components/PageHeader'
import ProjectList from './components/ProjectList'
import SearchBar from 'components/SearchBar'
import NewProject from './scenes/NewProject'
import * as actions from './actions'

export class Home extends Component {
  static propTypes = {
    user: PropTypes.object,
    actions: PropTypes.object,
    projects: PropTypes.arrayOf(PropTypes.object),
    visibleProjects: PropTypes.arrayOf(PropTypes.object),
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    sortBy: PropTypes.string,
    direction: PropTypes.string,
    suggestions: PropTypes.array,
    searchValue: PropTypes.string,
    error: PropTypes.bool,
    errorContent: PropTypes.string
  }

  constructor(props, context) {
    super(props, context)
  }

  componentWillMount() {
    this.props.actions.getProjectsRequest()
  }

  renderErrorMessage = () => (
    <CardError>
      {`Uh-oh, something went wrong. ${this.props.errorContent}`}
    </CardError>
  )

  render() {
    return (
      <Container column flex>
        <PageHeader role={this.props.user.role} />
        <Divider />
        <SearchBar
          searchValue={this.props.searchValue}
          handleSearchValueChange={event => this.props.actions.updateSearchValue(event.target.value)}
        />
        {this.props.error
          ? this.renderErrorMessage()
          : <ProjectList
            user={this.props.user}
            projects={this.props.visibleProjects}
            count={this.props.projects.length}
            page={this.props.page}
            rowsPerPage={this.props.rowsPerPage}
            sortBy={this.props.sortBy}
            direction={this.props.direction}
            sortBookmarked={this.props.sortBookmarked}
            handleRequestSort={this.props.actions.sortProjects}
            handlePageChange={this.props.actions.updatePage}
            handleRowsChange={this.props.actions.updateRows}
            handleToggleBookmark={this.props.actions.toggleBookmark}
            handleSortBookmarked={this.props.actions.sortBookmarked}
          />
        }
        <Route
          path="/new/project"
          component={NewProject} />
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.data.user.currentUser,
  projects: state.scenes.home.main.projects,
  visibleProjects: state.scenes.home.main.visibleProjects,
  page: state.scenes.home.main.page,
  rowsPerPage: state.scenes.home.main.rowsPerPage,
  sortBy: state.scenes.home.main.sortBy,
  direction: state.scenes.home.main.direction,
  suggestions: state.scenes.home.main.suggestions || [],
  searchValue: state.scenes.home.main.searchValue || '',
  sortBookmarked: state.scenes.home.main.sortBookmarked,
  error: state.scenes.home.main.error,
  errorContent: state.scenes.home.main.errorContent
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default withTheme()(connect(mapStateToProps, mapDispatchToProps)(Home))
