import React, { Component, Fragment } from 'react'
import Alert from 'components/Alert'
import PropTypes from 'prop-types'
import actions, * as otherActions from './actions'
import withCodingValidation from 'components/CodingValidation'
import ApiErrorAlert from 'components/ApiErrorAlert'
import Typography from 'material-ui/Typography'
import withTracking from 'components/withTracking'

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

  onShowPageLoader = () => {
    setTimeout(() => {
      if (this.props.isLoadingPage) {
        this.props.actions.showPageLoader()
      }
    }, 1000)
  }


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

  onOpenFlagConfirmAlert = (flagId, type) => {
    this.setState({
      flagConfirmAlertOpen: true,
      flagToDelete: { id: flagId, type }
    })
  }

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

Validation.propTypes = {
  projectName: PropTypes.string,
  projectId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  question: PropTypes.object,
  currentIndex: PropTypes.number,
  questionOrder: PropTypes.array,
  actions: PropTypes.object,
  categories: PropTypes.array
}

export default withCodingValidation(withTracking(Validation, 'Validation'), { ...actions, ...otherActions })