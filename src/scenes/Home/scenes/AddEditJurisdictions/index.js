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

export class AddEditJurisdictions extends Component {
  static propTypes = {
    project: PropTypes.object,
    visibleJurisdictions: PropTypes.array,
    searchValue: PropTypes.string,
    history: PropTypes.object,
    actions: PropTypes.object,
    theme: PropTypes.object,
    showJurisdictionLoader: PropTypes.bool,
    isLoadingJurisdictions: PropTypes.bool
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

  componentWillReceiveProps(nextProps) {
    if (this.props.deleteError === null && nextProps.deleteError !== null) {
      this.setState({
        deleteErrorAlertOpen: true
      })
    }
  }

  onCloseModal = () => {
    this.props.history.push('/home')
  }


  showJurisdictionLoader = () => {
    setTimeout(() => {
      if (this.props.isLoadingJurisdictions) {
        this.props.actions.showJurisdictionLoader()
      }
    }, 1000)
  }

  confirmDelete = (id, name) => {
    this.setState({
      confirmDeleteAlertOpen: true,
      jurisdictionToDelete: { id, name }
    })
  }

  continueDelete = () => {
    this.props.actions.deleteJurisdictionRequest(this.state.jurisdictionToDelete.id, this.props.project.id)
    this.cancelDelete()
  }

  cancelDelete = () => {
    this.setState({
      confirmDeleteAlertOpen: false,
      jurisdictionToDelete: {}
    })
  }

  dismissDeleteErrorAlert = () => {
    this.setState({
      deleteErrorAlertOpen: false
    })

    this.props.actions.dismissDeleteErrorAlert()
  }

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

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTheme()(withTracking(AddEditJurisdictions, 'Jurisdictions'))))