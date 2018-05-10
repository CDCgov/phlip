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

    this.exportRef = null
    this.setExportRef = element => this.exportRef = element
  }

  componentWillMount() {
    this.props.actions.getProjectsRequest()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.projectToExport.text !== '' && this.state.projectToExport !== null) {
      this.prepareExport(nextProps.projectToExport.text)
    }
  }

  onToggleExportDialog = project => {
    this.setState({
      exportDialogOpen: true,
      projectToExport: { ...project }
    })
  }

  onCloseExportDialog = () => {
    this.setState({
      projectToExport: null,
      exportDialogOpen: false
    })
  }

  prepareExport = text => {
    const csvBlob = new Blob([text], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(csvBlob)
    this.exportRef.href = url
    this.exportRef.download = `${this.state.projectToExport.name}-${this.state.projectToExport.exportType}-export.csv`
    this.exportRef.click()
    window.URL.revokeObjectURL(url)
    this.clearProjectExport()
  }

  getExport = type => {
    this.props.actions.exportDataRequest(this.state.projectToExport, type)
  }

  onChooseExport = type => {
    this.setState({
      exportDialogOpen: false,
      projectToExport: { ...this.state.projectToExport, exportType: type }
    }, () => this.getExport(type))
  }

  clearProjectExport = () => {
    this.setState({
      projectToExport: null
    })
    this.props.actions.clearProjectToExport()
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
          onClose={this.onCloseExportDialog} />
        <a style={{ display: 'none' }} ref={this.setExportRef} />
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
  projectCount: state.scenes.home.main.projectCount || 0,
  projectToExport: state.scenes.home.main.projectToExport || {}
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default withTheme()(connect(mapStateToProps, mapDispatchToProps)(Home))
