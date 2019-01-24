import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import { default as MuiButton } from '@material-ui/core/Button'
import Header from './components/Header'
import QuestionCard from './components/QuestionCard'
import Navigator from './components/Navigator'
import DocumentList from './components/DocumentList'
import actions from './actions'
import {
  TextLink, Icon, Button, Alert, Tooltip, ApiErrorView, ApiErrorAlert, PageLoader, withTracking, FlexGrid
} from 'components'
import classNames from 'classnames'
import { capitalizeFirstLetter } from 'utils/formHelpers'

const navButtonStyles = {
  height: 90,
  width: 20,
  minWidth: 'unset',
  minHeight: 'unset',
  backgroundColor: '#bdbdbd',
  padding: 0,
  top: '35%',
  borderRadius: '0 5px 5px 0',
  boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
  color: '#424242'
}

const iconStyle = { transform: 'rotate(90deg)' }

const styles = theme => ({
  mainContent: {
    height: '100vh',
    width: '100%',
    flex: '1 !important',
    overflow: 'auto',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -250
  },
  openNavShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  },
  pageLoading: {
    marginLeft: 0
  }
})

export class CodingValidation extends Component {
  static propTypes = {
    projectName: PropTypes.string,
    page: PropTypes.string,
    isValidation: PropTypes.bool,
    projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    question: PropTypes.object,
    currentIndex: PropTypes.number,
    questionOrder: PropTypes.array,
    showNextButton: PropTypes.bool,
    jurisdictionList: PropTypes.array,
    jurisdictionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    jurisdiction: PropTypes.object,
    isSchemeEmpty: PropTypes.bool,
    areJurisdictionsEmpty: PropTypes.bool,
    userRole: PropTypes.string,
    user: PropTypes.object,
    selectedCategory: PropTypes.number,
    schemeError: PropTypes.string,
    answerErrorContent: PropTypes.any,
    saveFlagErrorContent: PropTypes.string,
    getQuestionErrors: PropTypes.string,
    isLoadingPage: PropTypes.bool,
    pageLoadingMessage: PropTypes.string,
    showPageLoader: PropTypes.bool,
    actions: PropTypes.object,
    unsavedChanges: PropTypes.bool,
    isChangingQuestion: PropTypes.bool,
    selectedCategoryId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    history: PropTypes.object,
    hasTouchedQuestion: PropTypes.bool,
    classes: PropTypes.object,
    objectExists: PropTypes.bool
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      selectedJurisdiction: this.props.jurisdiction === null ? null : this.props.jurisdiction.id,
      showViews: false,
      navOpen: false,
      applyAllAlertOpen: false,
      showSchemeError: false,
      changeProps: [],
      stillSavingAlertOpen: false,
      changeMethod: null,
      flagConfirmAlertOpen: false,
      flagToDelete: null
    }

    this.confirmAlertActions = [
      { value: 'Cancel', type: 'button', onClick: this.onCloseFlagConfigAlert },
      { value: 'Yes', type: 'button', onClick: this.onClearFlag }
    ]

    this.modalActions = [
      {
        value: 'Cancel',
        type: 'button',
        onClick: this.onCloseApplyAllAlert
      },
      {
        value: 'Continue',
        type: 'button',
        onClick: this.onApplyToAll
      }
    ]

    this.stillSavingActions = [
      { ...this.modalActions[0], onClick: this.onCancelStillSavingAlert },
      { ...this.modalActions[1], onClick: this.onContinueStillSavingAlert }
    ]

    this.saveFailedActions = [
      {
        value: 'Try Again',
        type: 'button',
        onClick: this.onTryAgain
      }
    ]
  }

  componentDidMount() {
    if (this.props.page === 'coding') {
      this.props.actions.getCodingOutlineRequest(this.props.projectId, this.props.jurisdiction.id, this.props.page)
    } else {
      this.props.actions.getValidationOutlineRequest(this.props.projectId, this.props.jurisdiction.id, this.props.page)
    }
    this.onShowPageLoader()
  }

  componentDidUpdate(prevProps) {
    if (this.props.isSchemeEmpty === false && prevProps.isSchemeEmpty === null) {
      if (this.props.areJurisdictionsEmpty === false) {
        this.setState({
          navOpen: false
        })
      }
    }
  }

  componentWillUnmount() {
    this.props.actions.onCloseScreen()
  }

  /**
   * @public
   */
  onToggleNavigator = () => {
    this.setState({ navOpen: !this.state.navOpen })
  }

  /**
   * @public
   * @param index
   */
  getNextQuestion = index => {
    if (this.props.unsavedChanges === true) {
      this.onShowStillSavingAlert(index, this.props.actions.getNextQuestion)
    } else {
      this.props.actions.getNextQuestion(this.props.questionOrder[index],
        index,
        this.props.projectId,
        this.props.jurisdiction.id,
        this.props.page)
      this.onShowQuestionLoader()
    }
  }

  /**
   * @public
   * @param index
   */
  getPrevQuestion = index => {
    if (this.props.unsavedChanges === true) {
      this.onShowStillSavingAlert(index, this.props.actions.getPrevQuestion)
    } else {
      this.props.actions.getPrevQuestion(this.props.questionOrder[index],
        index,
        this.props.projectId,
        this.props.jurisdiction.id,
        this.props.page)
      this.onShowQuestionLoader()
    }
  }

  /**
   * @public
   * @param item
   */
  onQuestionSelectedInNav = item => {
    if (this.props.unsavedChanges === true) {
      this.onShowStillSavingAlert(item, this.props.actions.onQuestionSelectedInNav)
    } else {
      this.props.actions.onQuestionSelectedInNav(item,
        this.props.projectId,
        this.props.jurisdiction.id,
        this.props.page)
      this.onShowQuestionLoader()
    }
  }

  /**
   * @public
   */
  onShowQuestionLoader = () => {
    setTimeout(() => {
      if (this.props.isChangingQuestion) {
        this.props.actions.showQuestionLoader()
      }
    }, 1000)
  }

  /**
   * @public
   * @param id
   * @returns {Function}
   */
  onAnswer = id => (event, value) => {
    this.props.actions.updateUserAnswer(
      this.props.projectId, this.props.jurisdiction.id, this.props.question.id, id, value
    )

    this.onChangeTouchedStatus()
    this.onSaveCodedQuestion()
  }

  /**
   * This actually dispatches the redux action that calls the api to save the question data
   * @public
   */
  onSaveCodedQuestion = () => {
    this.props.actions.saveUserAnswerRequest(this.props.projectId,
      this.props.jurisdiction.id,
      this.props.question.id,
      this.props.selectedCategoryId,
      this.props.page)
  }

  /**
   * @public
   * @param id
   * @param field
   * @returns {Function}
   */
  onChangeTextAnswer = (id, field) => event => {
    switch (field) {
      case 'textAnswer':
        this.props.actions.updateUserAnswer(
          this.props.projectId, this.props.jurisdiction.id, this.props.question.id, id, event.target.value
        )
        break

      case 'comment':
        this.props.actions.onChangeComment(
          this.props.projectId, this.props.jurisdiction.id, this.props.question.id, event.target.value
        )
        break

      case 'pincite':
        this.props.actions.onChangePincite(
          this.props.projectId, this.props.jurisdiction.id, this.props.question.id, id, event.target.value
        )
    }
    this.onChangeTouchedStatus()
    this.onSaveCodedQuestion()
  }

  /**
   * @public
   * @returns {*}
   */
  onOpenApplyAllAlert = () => this.setState({ applyAllAlertOpen: true })

  /**
   * @public
   * @returns {*|{type, args}}
   */
  onCloseAlert = () => this.props.actions.dismissApiAlert('answerErrorContent')

  /**
   * @public
   * @param event
   * @param selection
   */
  onChangeCategory = (event, selection) => {
    this.onSaveCodedQuestion()
    this.props.actions.onChangeCategory(selection)
  }

  /**
   * @public
   */
  onTryAgain = () => {
    this.onSaveCodedQuestion()
    this.onCloseAlert()
  }

  /**
   * @public
   * @param question
   * @param method
   */
  onShowStillSavingAlert = (question, method) => {
    this.setState({
      stillSavingAlertOpen: true,
      changeProps: typeof question === 'object' ? [question] : [this.props.questionOrder[question], question],
      changeMethod: { type: 0, method: method }
    })
  }

  /**
   * @public
   */
  onCancelStillSavingAlert = () => {
    this.setState({
      changeProps: [],
      stillSavingAlertOpen: false,
      changeMethod: {}
    })
  }

  /**
   * @public
   */
  onContinueStillSavingAlert = () => {
    // question changing
    if (this.state.changeMethod.type === 0) {
      this.state.changeMethod.method(...this.state.changeProps,
        this.props.projectId,
        this.props.jurisdiction.id,
        this.props.page)
      this.onShowQuestionLoader()
      // jurisdiction changing
    } else if (this.state.changeMethod.type === 1) {
      this.setState({ selectedJurisdiction: this.state.changeProps[1] })
      this.props.actions.onChangeJurisdiction(this.state.changeProps[1], this.props.jurisdictionList)
      this.state.changeMethod.method(...this.state.changeProps)
      this.onShowQuestionLoader()
    } else {
      // clicked the back button
      this.state.changeMethod.method()
    }

    this.onCancelStillSavingAlert()
  }

  /**
   * @public
   */
  onClearAnswer = () => {
    this.props.actions.onClearAnswer(this.props.projectId, this.props.jurisdiction.id, this.props.question.id)
    this.onChangeTouchedStatus()
    this.onSaveCodedQuestion()
  }

  /**
   * @public
   */
  onGoBack = () => {
    if (this.props.unsavedChanges === true) {
      this.setState({
        stillSavingAlertOpen: true,
        changeMethod: { type: 2, method: this.props.history.goBack }
      })
    } else {
      this.props.history.goBack()
    }
  }

  /***
   * @public
   */
  onChangeTouchedStatus = () => {
    if (!this.props.hasTouchedQuestion) {
      this.props.actions.changeTouchedStatus()
    }
  }

  /**
   * @public
   * @returns {*}
   */
  onCloseApplyAllAlert = () => this.setState({ applyAllAlertOpen: false })

  /**
   * @public
   */
  onApplyToAll = () => {
    this.onCloseApplyAllAlert()
    this.onChangeTouchedStatus()
    this.props.actions.applyAnswerToAll(this.props.projectId,
      this.props.jurisdiction.id,
      this.props.question.id,
      this.props.page)
  }

  /**
   * @public
   * @param id
   */
  onToggleAnswerForAnno = id => {
    this.props.actions.onToggleAnswerForAnno(id)
    this.onSaveCodedQuestion()
  }

  /**
   * @public
   * @returns {*}
   */
  onShowGetStartedView = () => {
    const { isSchemeEmpty, areJurisdictionsEmpty } = this.props
    const noScheme = isSchemeEmpty
    const noJurisdictions = areJurisdictionsEmpty

    let startedText = ''
    if (this.props.isValidation) {
      if (noScheme && !noJurisdictions) {
        startedText = 'This project doesn\'t have a coding scheme.'
      } else if (!noScheme && noJurisdictions) {
        startedText = 'This project doesn\'t have jurisdictions.'
      } else {
        startedText = 'This project doesn\'t have a coding scheme or jurisdictions.'
      }
    } else {
      if (this.props.userRole === 'Coder') {
        startedText = 'The coordinator for this project has not created a coding scheme or added jurisdictions.'
      } else if (noScheme && !noJurisdictions) {
        startedText = 'You must add questions to the project coding scheme before coding.'
      } else if (!noScheme && noJurisdictions) {
        startedText = 'You must add jurisdictions to the project before coding.'
      } else {
        startedText = 'You must add jurisdictions and questions to the project coding scheme before coding.'
      }
    }

    return (
      <FlexGrid container flex align="center" justify="center" padding={30}>
        <Typography variant="display1" style={{ marginBottom: '20px' }}>{startedText}</Typography>
        <FlexGrid container type="row" style={{ width: '100%', justifyContent: 'space-evenly' }}>
          {noScheme && this.props.userRole !== 'Coder' &&
          <TextLink to={{ pathname: `/project/${this.props.projectId}/coding-scheme` }}>
            <Button value="Create Coding Scheme" color="accent" />
          </TextLink>}
          {noJurisdictions && this.props.userRole !== 'Coder' &&
          <TextLink to={{ pathname: `/project/${this.props.projectId}/jurisdictions` }}>
            <Button value="Add Jurisdictions" color="accent" />
          </TextLink>}
        </FlexGrid>
      </FlexGrid>
    )
  }

  /**
   * @public
   * @returns {*}
   */
  onShowCodeView = () => {
    return (
      <>
        <QuestionCard
          page={this.props.page}
          onChange={this.onAnswer}
          onChangeTextAnswer={this.onChangeTextAnswer}
          onChangeCategory={this.onChangeCategory}
          onAnswer={this.onAnswer}
          onClearAnswer={this.onClearAnswer}
          onOpenAlert={this.onOpenApplyAllAlert}
          onSaveFlag={this.onSaveFlag}
          onSave={this.onSaveCodedQuestion}
          onOpenFlagConfirmAlert={this.onOpenFlagConfirmAlert}
          onToggleAnswerForAnno={this.onToggleAnswerForAnno}
          currentIndex={this.props.currentIndex}
          getNextQuestion={this.getNextQuestion}
          getPrevQuestion={this.getPrevQuestion}
          totalLength={this.props.questionOrder.length}
          showNextButton={this.props.showNextButton}
        />
        <FlexGrid style={{ minWidth: 15, maxWidth: 15, width: 15 }} />
        <DocumentList
          projectId={this.props.projectId}
          jurisdictionId={this.props.jurisdiction.jurisdictionId}
          page={this.props.page}
          questionId={this.props.question.id}
          saveUserAnswer={this.onSaveCodedQuestion}
        />
      </>
    )
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
   * Invoked when the user changes jurisdictions by selecting a jurisdiction in the dropdown. If there are unsaved
   * changes, a popup is shown alerting the user so, otherwise calls redux actions to change questions and shows the
   * question loader
   * @public
   * @param event
   */
  onJurisdictionChange = event => {
    if (this.props.unsavedChanges === true) {
      this.setState({
        stillSavingAlertOpen: true,
        changeMethod: {
          type: 1,
          method: this.props.page === 'coding'
            ? this.props.actions.getUserCodedQuestions
            : this.props.actions.getUserValidatedQuestionsRequest
        },
        changeProps: [this.props.projectId, event.target.value, this.props.page]
      })
    } else {
      this.setState({ selectedJurisdiction: event.target.value })
      const newIndex = this.props.jurisdictionList.findIndex(jur => jur.id === event.target.value)
      this.props.actions.onChangeJurisdiction(newIndex)

      if (this.props.page === 'coding') {
        this.props.actions.getUserCodedQuestions(this.props.projectId, event.target.value, this.props.page)
      } else {
        this.props.actions.getUserValidatedQuestionsRequest(this.props.projectId, event.target.value, this.props.page)
      }

      this.onShowQuestionLoader()
      this.props.actions.getApprovedDocumentsRequest(this.props.projectId, this.props.jurisdictionList[newIndex].jurisdictionId, this.props.page)
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
      this.props.actions.onSaveFlag(this.props.projectId, this.props.jurisdiction.id, this.props.question.id, {
        raisedBy: {
          userId: this.props.user.id,
          firstName: this.props.user.firstName,
          lastName: this.props.user.lastName
        },
        ...flagInfo
      })

      this.props.actions.saveUserAnswerRequest(
        this.props.projectId,
        this.props.jurisdiction.id,
        this.props.question.id,
        this.props.selectedCategoryId,
        this.props.page
      )
    }
    this.onChangeTouchedStatus()
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
      this.props.actions.clearFlag(this.state.flagToDelete.id, this.props.projectId, this.props.jurisdiction.id, this.props.question.id)
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
    const classes = classNames(this.props.classes.mainContent, {
      [this.props.classes.openNavShift]: this.state.navOpen && !this.props.showPageLoader,
      [this.props.classes.pageLoading]: this.props.showPageLoader
    })

    const containerStyle = {
      width: '100%',
      height: '100%',
      position: 'relative',
      display: 'flex',
      flexWrap: 'nowrap',
      overflow: 'hidden'
    }

    return (
      <FlexGrid container type="row" flex className={classes} style={containerStyle}>
        <Alert open={this.state.applyAllAlertOpen} actions={this.modalActions}>
          <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
            You are applying your answer to ALL categories. Previously answered questions will be changed.
          </Typography>
        </Alert>
        <Alert open={this.state.stillSavingAlertOpen} actions={this.stillSavingActions}>
          <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
            Your answer to this question is still being saved. If you continue, your changes might not be saved.
          </Typography>
        </Alert>
        <ApiErrorAlert
          open={this.props.answerErrorContent !== null}
          content={this.props.answerErrorContent}
          actions={this.props.objectExists ? [] : this.saveFailedActions}
          onCloseAlert={this.onCloseAlert}
        />
        <ApiErrorAlert
          open={this.props.getQuestionErrors !== null}
          content={this.props.getQuestionErrors}
          onCloseAlert={() => this.props.actions.dismissApiAlert('getQuestionErrors')}
        />
        {!this.props.showPageLoader &&
        <Navigator
          open={this.state.navOpen}
          page={this.props.page}
          selectedCategory={this.props.selectedCategory}
          handleQuestionSelected={this.onQuestionSelectedInNav}
        />}
        <FlexGrid container flex style={{ width: '100%', flexWrap: 'nowrap', overflowX: 'hidden', overflowY: 'auto' }}>
          <Header
            projectName={this.props.projectName}
            projectId={this.props.projectId}
            jurisdictionList={this.props.jurisdictionList}
            onJurisdictionChange={this.onJurisdictionChange}
            pageTitle={capitalizeFirstLetter(this.props.page)}
            currentJurisdiction={this.props.jurisdiction}
            onGoBack={this.onGoBack}
            empty={this.props.jurisdiction.id === null || this.props.questionOrder === null ||
            this.props.questionOrder.length === 0}
          />
          <FlexGrid container type="row" flex style={{ backgroundColor: '#f5f5f5' }}>
            <FlexGrid container type="row" flex style={{ overflow: 'auto' }}>
              {!this.props.showPageLoader &&
              <FlexGrid>
                {this.props.isSchemeEmpty !== null &&
                (this.props.jurisdiction.id !== null && this.props.questionOrder.length !== 0) &&
                <Tooltip placement="right" text="Toggle Navigator" id="toggle-navigator">
                  <MuiButton style={navButtonStyles} aria-label="Toggle Navigator" onClick={this.onToggleNavigator}>
                    <Icon color="#424242" style={iconStyle}>menu</Icon>
                  </MuiButton>
                </Tooltip>}
              </FlexGrid>}
              <FlexGrid
                container
                type="row"
                flex
                style={{ padding: '1px 15px 20px 15px', overflow: 'auto', minHeight: 500 }}>
                {this.props.schemeError !== null &&
                <ApiErrorView error="We couldn't get the coding scheme for this project." />}
                {this.props.showPageLoader && <PageLoader circularLoaderProps={{ color: 'primary', size: 50 }} />}
                {(this.props.areJurisdictionsEmpty || this.props.isSchemeEmpty) && this.onShowGetStartedView()}
                {(!this.props.showPageLoader && this.props.isSchemeEmpty === false &&
                  this.props.areJurisdictionsEmpty === false) && this.onShowCodeView()}
              </FlexGrid>
            </FlexGrid>
          </FlexGrid>
        </FlexGrid>
        <Alert open={this.state.flagConfirmAlertOpen} actions={this.confirmAlertActions}>
          <Typography variant="body1">Are you sure you want to clear this flag?</Typography>
        </Alert>

        <ApiErrorAlert
          content={this.props.saveFlagErrorContent}
          open={this.props.saveFlagErrorContent !== null}
          onCloseAlert={() => this.props.actions.dismissApiAlert('saveFlagErrorContent')}
        />
      </FlexGrid>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const project = state.scenes.home.main.projects.byId[ownProps.match.params.id]
  const page = ownProps.match.url.split('/')[3] === 'code' ? 'coding' : 'validation'
  const pageState = state.scenes.codingValidation.coding

  return {
    projectName: project.name,
    page,
    isValidation: page === 'validation',
    projectId: ownProps.match.params.id,
    question: pageState.scheme === null ? {} : pageState.scheme.byId[pageState.scheme.order[pageState.currentIndex]],
    currentIndex: pageState.currentIndex || 0,
    questionOrder: pageState.scheme === null ? null : pageState.scheme.order,
    showNextButton: pageState.showNextButton,
    jurisdictionList: project.projectJurisdictions || [],
    jurisdiction: project.projectJurisdictions.length > 0
      ? project.projectJurisdictions[pageState.jurisdictionIndex]
      : { id: null },
    isSchemeEmpty: pageState.isSchemeEmpty,
    areJurisdictionsEmpty: pageState.areJurisdictionsEmpty,
    userRole: state.data.user.currentUser.role,
    user: state.data.user.currentUser,
    selectedCategory: pageState.selectedCategory,
    schemeError: pageState.schemeError || null,
    answerErrorContent: pageState.answerErrorContent || null,
    saveFlagErrorContent: pageState.saveFlagErrorContent || null,
    getQuestionErrors: pageState.getQuestionErrors || null,
    isLoadingPage: pageState.isLoadingPage,
    showPageLoader: pageState.showPageLoader,
    isChangingQuestion: pageState.isChangingQuestion || false,
    selectedCategoryId: pageState.selectedCategoryId || null,
    unsavedChanges: pageState.unsavedChanges || false,
    hasTouchedQuestion: pageState.hasTouchedQuestion || false,
    objectExists: pageState.objectExists || false
  }
}

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTracking(CodingValidation)))