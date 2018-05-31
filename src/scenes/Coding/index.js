import React, { Component } from 'react'
import actions, * as otherActions from './actions'
import withCodingValidation from 'components/CodingValidation'
import ApiErrorAlert from 'components/ApiErrorAlert'

/**
 * Coding scene component that is displayed when the user clicks the 'Code' button. Most of the interactions are handled
 * by the HOC withCodingValidation, only events or alerts that are specific to Coding or needs to be handled by Coding are implemented
 * here. For props and propTypes of Coding, see the withCodingValidation HOC.
 */
export class Coding extends Component {
  constructor(props, context) {
    super(props, context)
  }

  componentWillMount() {
    this.props.actions.getCodingOutlineRequest(this.props.projectId, this.props.jurisdictionId, this.props.page)
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

  /**
   * The user has clicked 'save' in either of the flag popover forms
   * @public
   * @param flagInfo
   */
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

export default withCodingValidation(Coding, { ...actions, ...otherActions }, 'Code')