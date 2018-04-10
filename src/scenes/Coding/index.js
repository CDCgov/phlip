import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import actions, * as otherActions from './actions'
import withCodingValidation from 'components/CodingValidation'
import ApiErrorAlert from 'components/ApiErrorAlert'

export class Coding extends Component {
  constructor(props, context) {
    super(props, context)
  }

  componentWillMount() {
    this.props.actions.getCodingOutlineRequest(this.props.projectId, this.props.jurisdictionId, 'coding')
    this.onShowPageLoader()
  }

  onShowPageLoader = () => {
    setTimeout(() => {
      if (this.props.isLoadingPage) {
        this.props.actions.showPageLoader()
      }
    }, 1000)
  }

  onJurisdictionChange = (event) => {
    this.setState({ selectedJurisdiction: event.target.value })
    this.props.actions.onChangeJurisdiction(event.target.value, this.props.jurisdictionsList)
    this.props.actions.getUserCodedQuestions(this.props.projectId, event.target.value)
    this.onShowPageLoader()
  }

  onSaveFlag = flagInfo => {
    if (flagInfo.type === 3) {
      this.props.actions.onSaveRedFlag(this.props.projectId, this.props.question.id, {
        raisedBy: {
          userId: this.props.user.id,
          firstName: this.props.user.firstName,
          lastName: this.props.user.lastName
        },
        ...flagInfo
      })
    } else {
      this.props.actions.onSaveFlag(this.props.projectId, this.props.jurisdictionId, this.props.question.id, {
        raisedBy: {
          userId: this.props.user.id,
          firstName: this.props.user.firstName,
          lastName: this.props.user.lastName
        },
        ...flagInfo
      })
    }
  }

  render() {
    return (
      <ApiErrorAlert
        content={this.props.saveFlagErrorContent}
        open={this.props.saveFlagErrorContent !== null}
        onCloseAlert={() => this.props.actions.dismissApiAlert('saveFlagErrorContent')} />
    )
  }
}

Coding.propTypes = {
  projectName: PropTypes.string,
  projectId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  question: PropTypes.object,
  currentIndex: PropTypes.number,
  questionOrder: PropTypes.array,
  actions: PropTypes.object,
  categories: PropTypes.array
}

export default withCodingValidation(Coding, { ...actions, ...otherActions })