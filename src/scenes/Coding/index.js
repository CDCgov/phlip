import React, { Component } from 'react'
import PropTypes from 'prop-types'
import actions, * as otherActions from './actions'
import withCodingValidation from 'components/CodingValidation'
import ApiErrorAlert from 'components/ApiErrorAlert'
import withTracking from 'components/withTracking'

export class Coding extends Component {
  constructor(props, context) {
    super(props, context)
  }

  componentWillMount() {
    this.props.actions.getCodingOutlineRequest(this.props.projectId, this.props.jurisdictionId, this.props.page)
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
        changeMethod: { type: 1, method: this.props.actions.getUserCodedQuestions },
        changeProps: [this.props.projectId, event.target.value, this.props.page]
      })
    } else {
      this.setState({ selectedJurisdiction: event.target.value })
      this.props.actions.onChangeJurisdiction(event.target.value, this.props.jurisdictionsList)
      this.props.actions.getUserCodedQuestions(this.props.projectId, event.target.value, this.props.page)
      this.onShowPageLoader()
    }
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
      this.props.actions.saveUserAnswerRequest(this.props.projectId, this.props.jurisdictionId, this.props.question.id, this.props.selectedCategoryId, this.props.page)
    }
    this.onChangeTouchedStatus()
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

export default withCodingValidation(Coding, { ...actions, ...otherActions }, 'Code')