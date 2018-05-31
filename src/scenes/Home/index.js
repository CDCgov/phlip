import React, { Component } from 'react'
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
import withTracking from 'components/withTracking'
import ApiErrorAlert from 'components/ApiErrorAlert'

/**
 * Project List ("Home") screen main component. The first component that is rendered when the user logs in. This is parent
 * component for all things related to the project list -- adding / editing a project, viewing all projects in the system.
 * This component also has two scenes: AddEditJurisdiction and AddEditProject under scenes directory.
 */
export class Home extends Component {
  static propTypes = {
    /**
     * Current user logged in
     */
    user: PropTypes.object,
    /**
     * Redux action creators
     */
    actions: PropTypes.object,
    /**
     * Array of project IDS that are currently visible on the screen (changes when the user changes the page or uses the
     * search bar to search, etc)
     */
    visibleProjects: PropTypes.arrayOf(PropTypes.number),
    /**
     * Current page in the table
     */
    page: PropTypes.number,
    /**
     * Currently selected number of rows per page
     */
    rowsPerPage: PropTypes.string,
    /**
     * Current field by which to sort the table
     */
    sortBy: PropTypes.string,
    /**
     * Current direction by which to sort the table
     */
    direction: PropTypes.string,
    /**
     * Search input value (the user typed in the search input)
     */
    searchValue: PropTypes.string,
    /**
     * Whether or not the projects should be sorted by bookmarks
     */
    sortBookmarked: PropTypes.bool,
    /**
     * Whether or not an error has occurred for some reason
     */
    error: PropTypes.bool,
    /**
     * Contents of the error message that has occurred
     */
    errorContent: PropTypes.string,
    /**
     * Total number of projects
     */
    projectCount: PropTypes.number,
    /**
     * Project that is currently being exported
     */
    projectToExport: PropTypes.object,
    /**
     * Any error that has occurred during export
     */
    exportError: PropTypes.string
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

  /**
   * Opens the export dialog after the user clicks the 'Export' download button.
   * @public
   * @param {object} project
   */
  onToggleExportDialog = project => {
    this.setState({
      exportDialogOpen: true,
      projectToExport: { ...project }
    })
  }

  /**
   * Closes the export dialog
   * @public
   */
  onCloseExportDialog = () => {
    this.setState({
      projectToExport: null,
      exportDialogOpen: false
    })
  }

  /**
   * Prepares the export CSV file by creating a Blob and ObjectURL from the text parameter. Downloads the file
   * @public
   * @param {string} text
   */
  prepareExport = text => {
    const csvBlob = new Blob([text], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(csvBlob)
    this.exportRef.href = url
    this.exportRef.download = `${this.state.projectToExport.name}-${this.state.projectToExport.exportType}-export.csv`
    this.exportRef.click()
    //window.URL.revokeObjectURL(url)
    this.clearProjectExport()
  }

  /**
   * Calls a redux action to send a request to the API to download the export file, with type being the type of export.
   * This is callback for setState after the user chooses an option in the export dialog
   * @public
   * @param {string} type - Type of export
   */
  getExport = type => {
    this.props.actions.exportDataRequest(this.state.projectToExport, type)
  }

  /**
   * Invoked after the user chooses an export type from the export dialog. Closes the export dialog and calls getExport
   * @public
   * @param {string} type - Type of export
   */
  onChooseExport = type => {
    this.setState({
      exportDialogOpen: false,
      projectToExport: { ...this.state.projectToExport, exportType: type }
    }, () => this.getExport(type))
  }

  /**
   * Clears the export project from local state as well as calls an redux action to clear it from the redux state.
   * @public
   */
  clearProjectExport = () => {
    this.setState({
      projectToExport: null
    })
    this.props.actions.clearProjectToExport()
  }

  /**
   * Renders a card error based on this.props.errorContent
   * @public
   * @returns {*}
   */
  renderErrorMessage = () => (
    <CardError>
      {`Uh-oh! Something went wrong. ${this.props.errorContent}`}
    </CardError>
  )

  /**
   * Calls a redux action to close the alert error for any export error that is shown
   * @public
   */
  onCloseExportError = () => {
    this.props.actions.dismissApiError('exportError')
    this.clearProjectExport()
  }

  render() {
    return (
      <Container column flex style={{ paddingBottom: '25px' }}>
        <ApiErrorAlert
          content={this.props.exportError}
          open={this.props.exportError !== ''}
          onCloseAlert={this.onCloseExportError} />
        <PageHeader
          showButton={this.props.user.role !== 'Coder'}
          pageTitle="Project List"
          protocolButton={false}
          projectName=""
          otherButton={{
            isLink: true,
            text: '+ Create New Project',
            path: '/project/add',
            state: { projectDefined: null, modal: true },
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

const mapStateToProps = state => ({
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
  projectToExport: state.scenes.home.main.projectToExport || { text: '' },
  exportError: state.scenes.home.main.exportError || ''
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default withTheme()(connect(mapStateToProps, mapDispatchToProps)(withTracking(Home, 'Home')))
