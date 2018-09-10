import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import Button from 'components/Button'
import Container, { Column } from 'components/Layout'
import JurisdictionList from './components/JurisdictionList'
import * as actions from './actions'
import Divider from 'material-ui/Divider'
import Typography from 'material-ui/Typography'
import TextLink from 'components/TextLink'
import ApiErrorView from 'components/ApiErrorView'
import { withTheme } from 'material-ui/styles'
import PageLoader from 'components/PageLoader'
import Alert from 'components/Alert'
import ApiErrorAlert from 'components/ApiErrorAlert'
import withTracking from 'components/withTracking'

/**
 * Main / entry component for all things jurisdiction. It is a modal that shows a list of all jurisdictions for the
 * project of which this was invoked. This component is mounted when the user clicks the 'Edit' under the 'Jurisdictions'
 * table header on the project list page.
 */
export class AddEditJurisdictions extends Component {
  static propTypes = {
    /**
     * Project for which this component was rendered
     */
    project: PropTypes.object,
    /**
     * Jurisdictions visible on the screen (changes when the user uses the search bar)
     */
    visibleJurisdictions: PropTypes.array,
    /**
     * Search value, if any, in the search bar text field
     */
    searchValue: PropTypes.string,
    /**
     * react-router history object
     */
    history: PropTypes.object,
    /**
     * Redux actions
     */
    actions: PropTypes.object,
    /**
     * material-ui styles theme
     */
    theme: PropTypes.object,
    /**
     * Whether or not to show the spinning loader when loading the list of jurisdictions
     */
    showJurisdictionLoader: PropTypes.bool,
    /**
     * Whether or not the app is in the process of loading the jurisdictions list
     */
    isLoadingJurisdictions: PropTypes.bool,
    /**
     * Error content that happened when trying to delete a jurisdiction
     */
    deleteError: PropTypes.string,
    /**
     * Whether or not there's currently an error that needs to be shown
     */
    error: PropTypes.bool,
    /**
     * Content of error that needs to be shown
     */
    errorContent: PropTypes.string
  }

  state = {
    confirmDeleteAlertOpen: false,
    jurisdictionToDelete: {},
    deleteErrorAlertOpen: false
  }

  constructor(props, context) {
    super(props, context)
  }

  componentWillMount() {
    this.props.actions.getProjectJurisdictions(this.props.project.id)
    this.showJurisdictionLoader()
  }

  componentWillUnmount() {
    this.props.actions.clearJurisdictions()
  }

  componentDidUpdate(prevProps) {
    if (this.props.deleteError !== null && prevProps.deleteError === null) {
      this.setState({
        deleteErrorAlertOpen: true
      })
    }
  }

  /**
   * Closes main modal, and pushes '/home' onto browser history
   * @public
   */
  onCloseModal = () => {
    this.props.history.push('/home')
  }

  /**
   * Sets a timeout and if the app is still loading the jurisdictions after 1 second, then it dispatches a redux action
   * to show the loading spinner
   * @public
   */
  showJurisdictionLoader = () => {
    setTimeout(() => {
      if (this.props.isLoadingJurisdictions) {
        this.props.actions.showJurisdictionLoader()
      }
    }, 1000)
  }

  /**
   * Opens an alert to ask the user to confirm deleting a jurisdiction
   *
   * @public
   * @param {String} id
   * @param {String} name
   */
  confirmDelete = (id, name) => {
    this.setState({
      confirmDeleteAlertOpen: true,
      jurisdictionToDelete: { id, name }
    })
  }

  /**
   * User confirms delete, dispatches a redux action to delete the jurisdiction, closes the alert modal
   * @public
   */
  continueDelete = () => {
    this.props.actions.deleteJurisdictionRequest(this.state.jurisdictionToDelete.id, this.props.project.id)
    this.cancelDelete()
  }

  /**
   * User cancels delete, closes the alert modal
   * @public
   */
  cancelDelete = () => {
    this.setState({
      confirmDeleteAlertOpen: false,
      jurisdictionToDelete: {}
    })
  }

  /**
   * Closes the error alert shown when an error occurs during delete, dispatches an action to clear error content
   * @public
   */
  dismissDeleteErrorAlert = () => {
    this.setState({
      deleteErrorAlertOpen: false
    })

    this.props.actions.dismissDeleteErrorAlert()
  }

  /**
   * Gets the buttosn to show in the modal header
   * @public
   */
  getButton = () => {
    return (
      <Fragment>
        <div style={{ marginRight: 10 }}>
          <TextLink to={{ pathname: `/project/${this.props.project.id}/jurisdictions/add`, state: { preset: true } }}>
            <Button value="Load Preset" color="accent" aria-label="Load preset" />
          </TextLink>
        </div>
        <div>
          <TextLink to={{ pathname: `/project/${this.props.project.id}/jurisdictions/add`, state: { preset: false } }}>
            <Button value="+ Add Jurisdiction" color="accent" aria-label="Add jurisidiction to project" />
          </TextLink>
        </div>
      </Fragment>
    )
  }

  render() {
    const alertActions = [
      {
        value: 'Cancel',
        type: 'button',
        onClick: this.cancelDelete
      },
      {
        value: 'Continue',
        type: 'button',
        onClick: this.continueDelete
      }
    ]

    return (
      <Modal onClose={this.onCloseModal} open={true} maxWidth="md" hideOverflow>
        <ModalTitle
          title={
            <Typography type="title">
              <span style={{ paddingRight: 10 }}>Jurisdictions</span>
              <span style={{ color: this.props.theme.palette.secondary.main }}>{this.props.project.name}</span>
            </Typography>
          }
          buttons={this.props.error === true ? [] : this.getButton()}
          search
          SearchBarProps={{
            searchValue: this.props.searchValue,
            handleSearchValueChange: (event) => this.props.actions.updateSearchValue(event.target.value),
            placeholder: 'Search',
            style: { paddingRight: 10 }
          }} />
        <Divider />
        <ModalContent style={{ display: 'flex', flexDirection: 'column' }}>
          <Alert actions={alertActions} open={this.state.confirmDeleteAlertOpen}>
            <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
              Are you sure you want to delete the jurisdiction, {this.state.jurisdictionToDelete.name}, from the
              project? All coded questions related to this jurisdiction will be deleted.
            </Typography>
          </Alert>
          <ApiErrorAlert
            open={this.state.deleteErrorAlertOpen === true}
            content={this.props.deleteError}
            onCloseAlert={this.dismissDeleteErrorAlert} />
          <Container flex style={{ marginTop: 20 }}>
            <Column flex displayFlex style={{ overflowX: 'auto' }}>
              {this.props.error === true
                ? <ApiErrorView error={this.props.errorContent} />
                : this.props.showJurisdictionLoader
                  ? <PageLoader />
                  : <JurisdictionList
                    project={this.props.project}
                    jurisdictions={this.props.visibleJurisdictions}
                    projectId={this.props.project.id}
                    onDelete={this.confirmDelete} />}
            </Column>
          </Container>
        </ModalContent>
        <ModalActions
          actions={[
            {
              value: 'Close',
              onClick: this.onCloseModal,
              type: 'button',
              otherProps: { 'aria-label': 'Close modal' }
            }
          ]} />
      </Modal>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  project: state.scenes.home.main.projects.byId[ownProps.match.params.id],
  visibleJurisdictions: state.scenes.home.addEditJurisdictions.visibleJurisdictions || [],
  error: state.scenes.home.addEditJurisdictions.error || false,
  errorContent: state.scenes.home.addEditJurisdictions.errorContent || '',
  isLoadingJurisdictions: state.scenes.home.addEditJurisdictions.isLoadingJurisdictions || false,
  showJurisdictionLoader: state.scenes.home.addEditJurisdictions.showJurisdictionLoader || false,
  deleteError: state.scenes.home.addEditJurisdictions.deleteError || null
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTheme()(withTracking(AddEditJurisdictions, 'Jurisdictions'))))