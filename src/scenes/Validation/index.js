import React, { Component, Fragment } from 'react'
import Alert from 'components/Alert'
import actions, * as otherActions from './actions'
import withCodingValidation from 'components/CodingValidation'
import ApiErrorAlert from 'components/ApiErrorAlert'
import Typography from 'material-ui/Typography'

/**
 * Validation scene component that is displayed when the user clicks the 'Validate' button. Most of the interactions are handled
 * by the HOC withCodingValidation, only events or alerts that are specific to Validation or needs to be handled by Validation are implemented
 * here. For props and propTypes of Validation, see the withCodingValidation HOC.
 */
export class Validation extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      flagConfirmAlertOpen: false,
      flagToDelete: null
    }

    this.confirmAlertActions = [
      { value: 'Cancel', type: 'button', onClick: this.onCloseFlagConfigAlert },
      { value: 'Yes', type: 'button', onClick: this.onClearFlag }
    ]
  }

  componentWillMount() {
    this.props.actions.getValidationOutlineRequest(this.props.projectId, this.props.jurisdictionId, this.props.page)
    this.onShowPageLoader()
  }

  /**
   * Waits 1 sec, then displays a circular loader if API is still loading
   * @public
   */
  onShowPageLoader = () => {
    setTimeout(() => {
      if (this.props.isLoadingPage) {
        this.props.actions.showPageLoader()
      }
    }, 1000)
  }

  /**
   * Invoked when the user changes jurisdictions by selecting a jurisdiction in the dropdown. If there are unsaved changes,
   * a popup is shown alerting the user so, otherwise calls redux actions to change questions and shows the question
   * loader
   * @public
   * @param event
   */
  onJurisdictionChange = event => {
    if (this.props.unsavedChanges === true) {
      this.setState({
        stillSavingAlertOpen: true,
        changeMethod: { type: 1, method: this.props.actions.getUserValidatedQuestionsRequest },
        changeProps: [this.props.projectId, event.target.value, this.props.page]
      })
    } else {
      this.setState({ selectedJurisdiction: event.target.value })
      this.props.actions.onChangeJurisdiction(event.target.value, this.props.jurisdictionsList)
      this.props.actions.getUserValidatedQuestionsRequest(this.props.projectId, event.target.value, this.props.page)
      this.onShowPageLoader()
    }
  }

  /**
   * Opens an alert to ask the user to confirm deleting a flag from the Flags & Comments validation table
   * @public
   * @param flagId
   * @param type
   */
  onOpenFlagConfirmAlert = (flagId, type) => {
    this.setState({
      flagConfirmAlertOpen: true,
      flagToDelete: { id: flagId, type }
    })
  }

  /**
   * Called if the user chooses they are sure they want to clear the flag, calls a redux action creator function
   * depending on flag type. Closes delete flag confirm alert
   * @public
   */
  onClearFlag = () => {
    if (this.state.flagToDelete.type === 3) {
      this.props.actions.clearRedFlag(this.state.flagToDelete.id, this.props.question.id, this.props.projectId)
    } else {
      this.props.actions.clearFlag(this.state.flagToDelete.id, this.props.projectId, this.props.jurisdictionId, this.props.question.id)
    }

    this.setState({
      flagConfirmAlertOpen: false,
      flagToDelete: null
    })
  }

  /**
   * Closes the delete flag confirm alert after the user decided to they don't want to delete the flag
   * @public
   */
  onCloseFlagConfigAlert = () => {
    this.setState({
      flagConfirmAlertOpen: false,
      flagToDelete: null
    })
  }

  render() {
    return (
      <Fragment>
        <Alert open={this.state.flagConfirmAlertOpen} actions={this.confirmAlertActions}>
          <Typography variant="body1">Are you sure you want to clear this flag?</Typography>
        </Alert>

        <ApiErrorAlert
          content={this.props.saveFlagErrorContent}
          open={this.props.saveFlagErrorContent !== null}
          onCloseAlert={() => this.props.actions.dismissApiAlert('saveFlagErrorContent')} />
      </Fragment>
    )
  }
}

export default withCodingValidation(Validation, { ...actions, ...otherActions }, 'Validate')