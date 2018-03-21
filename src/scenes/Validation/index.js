import React, { Component } from 'react'
import Alert from 'components/Alert'
import PropTypes from 'prop-types'
import actions, * as otherActions from './actions'
import withCodingValidation from 'components/CodingValidation'

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
    this.props.actions.getValidationOutlineRequest(this.props.projectId, this.props.jurisdictionId)
    this.props.actions.getCodedUsersAnswers(this.props.projectId, this.props.jurisdictionId)
  }

  onJurisdictionChange = event => {
    this.setState({ selectedJurisdiction: event.target.value })
    this.props.actions.onChangeJurisdiction(event.target.value, this.props.jurisdictionsList)
    this.props.actions.getUserValidatedQuestionsRequest(this.props.projectId, event.target.value)
  }

  onOpenFlagConfirmAlert = (flagId, type) => {
    this.setState({
      flagConfirmAlertOpen: true,
      flagToDelete: { id: flagId, type }
    })
  }

  onClearFlag = () => {
    if (this.state.flagToDelete.type === 3) {
      this.props.actions.clearRedFlag(this.state.flagToDelete.id, this.props.question.id)
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
      <Alert
        open={this.state.flagConfirmAlertOpen}
        text="Are you sure you want to clear this flag?"
        actions={this.confirmAlertActions}
      />
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

export default withCodingValidation(Validation, { ...actions, ...otherActions })