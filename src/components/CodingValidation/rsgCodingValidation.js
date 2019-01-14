import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
import QuestionCard from './QuestionCard'
import FooterNavigate from './FooterNavigate'
import Navigator from './Navigator'
import Container, { Row, Column } from 'components/Layout'
import Typography from 'material-ui/Typography'
import TextLink from 'components/TextLink'
import Icon from 'components/Icon'
import Button from 'components/Button'
import classNames from 'classnames'
import { default as MuiButton } from 'material-ui/Button'
import HeaderedLayout from 'components/HeaderedLayout'
import Alert from 'components/Alert'
import Tooltip from 'components/Tooltip'
import { capitalizeFirstLetter } from 'utils/formHelpers'
import ApiErrorView from 'components/ApiErrorView'
import ApiErrorAlert from 'components/ApiErrorAlert'
import PageLoader from 'components/PageLoader'

/**
 * __withCodingValidation__ is a higher order component that is only used in the scenes/Coding and scenes/Validation
 * components. Most of interactions, views, events, etc. on Coding and Validation are the same, with the exception of a
 * few items. withCodingValidation prevents duplicate code by putting everything that is used in both components into
 * one.
 *
 * withCodingValidation extends the abilities of either Coding or Validation screen with the new class CodingValidation.
 * Below are all of the props and methods that are availble in whatever component uses the withCodingValidation HOC.
 */
export class withCodingValidation extends Component {
  static propTypes = {
    /**
     * Name of project for which the code / validation screens were open
     */
    projectName: PropTypes.string,
    /**
     * Either 'coding' or 'validation', used for redux to know which reducer to use
     */
    page: PropTypes.string,
    /**
     * Whether or not this is validation screen
     */
    isValidation: PropTypes.bool,
    /**
     * Project ID for which the code / validation screens were open
     */
    projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Current question object
     */
    question: PropTypes.object,
    /**
     * Current index --- represents the current question in the questionOrder array
     */
    currentIndex: PropTypes.number,
    /**
     * Array of question IDs in coding scheme order
     */
    questionOrder: PropTypes.array,
    /**
     * Whether or not the 'next question' button should be shown (for ex. if it's the last question in the scheme, then
     * it won't be shown)
     */
    showNextButton: PropTypes.bool,
    /**
     * List of jurisdictions for the project
     */
    jurisdictionsList: PropTypes.array,
    /**
     * ID of currently selected jurisdiction
     */
    jurisdictionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Currently selected jurisdiction from the jurisdiction list
     */
    jurisdiction: PropTypes.object,
    /**
     * Whether or not the coding scheme for the project is empty, used in determining which view to show
     */
    isSchemeEmpty: PropTypes.bool,
    /**
     * Whether or not the project has added jurisdictions, used in determining which view to show
     */
    areJurisdictionsEmpty: PropTypes.bool,
    /**
     * Role of the user currently logged in
     */
    userRole: PropTypes.string,
    /**
     * User currently logged in
     */
    user: PropTypes.object,
    /**
     * Currently selected category if the current question is a category question, this is the index in the array of
     * categories given to the tabs component
     */
    selectedCategory: PropTypes.number,
    /**
     * ID of the currently selected category
     */
    selectedCategoryId: PropTypes.any,
    /**
     * Any error that occurred while trying to get the coding scheme
     */
    schemeError: PropTypes.string,
    /**
     * Any error that occurred while trying to answer (code or validate) a question
     */
    answerErrorContent: PropTypes.any,
    /**
     * Any error that occurred while trying to save a flag
     */
    saveFlagErrorContent: PropTypes.string,
    /**
     * Any error that occurred while trying to get the initial questions
     */
    getQuestionErrors: PropTypes.string,
    /**
     * Message to put in the page loader view
     */
    pageLoadingMessage: PropTypes.string,
    /**
     * Whether or not to show the page loader view
     */
    showPageLoader: PropTypes.bool,
    /**
     * Redux action creators
     */
    actions: PropTypes.object,
    /**
     * Whether or not there are currently unsaved changes to this question
     */
    unsavedChanges: PropTypes.bool,
    /**
     * Whether or not the user has tried to navigate to another question, so the app is in the process of changing questions
     */
    isChangingQuestion: PropTypes.bool,
    /**
     * Whether or not the user has 'touched' the question, this determines if the 'Saved Status' should be shown in the
     * question ard
     */
    hasTouchedQuestion: PropTypes.bool,
    /**
     * Whether or not an error occurred while trying to save an answer to the question that says there is already an
     * object that exists (this determines what type of actions will be displayed in the alert error)
     */
    objectExists: PropTypes.bool
  }

  constructor(context, props) {
    super(context, props)

    this.state = {
      selectedJurisdiction: this.props.jurisdictionId,
      showViews: false,
      navOpen: false,
      applyAllAlertOpen: false,
      showSchemeError: false,
      changeProps: [],
      stillSavingAlertOpen: false,
      changeMethod: null
    }

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

  /**
   * @public
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.isSchemeEmpty === null) {
      if (nextProps.isSchemeEmpty !== null) {
        this.setState({ showViews: true })
      }
      if (nextProps.schemeError !== null) {
        this.setState({ showSchemeError: true })
      }
      if (nextProps.isSchemeEmpty === false && nextProps.areJurisdictionsEmpty === false) {
        this.setState({ navOpen: true })
      }
    }
  }

  componentWillUnmount() {
    this.props.actions.onCloseScreen()
  }

  /**
   * Opens or closes the Code Navigator
   *
   * @public
   */
  onToggleNavigator = () => {
    this.setState({ navOpen: !this.state.navOpen })
  }

  /**
   * If there are unsaved changes, then shows a alert saying so, otherwise calls a redux action to load the next question
   * whose index is the index parameter. Shows question loader.
   *
   * @public
   * @param {number} index
   */
  getNextQuestion = index => {
    if (this.props.unsavedChanges === true) {
      this.onShowStillSavingAlert(index, this.props.actions.getNextQuestion)
    } else {
      this.props.actions.getNextQuestion(this.props.questionOrder[index], index, this.props.projectId, this.props.jurisdictionId, this.props.page)
      this.onShowQuestionLoader()
    }
  }

  /**
   * If there are unsaved changes, then shows a alert saying so, otherwise calls a redux action to load the previous question
   * whose index is the index parameter. Shows question loader.
   *
   * @public
   * @param {number} index
   */
  getPrevQuestion = index => {
    if (this.props.unsavedChanges === true) {
      this.onShowStillSavingAlert(index, this.props.actions.getPrevQuestion)
    } else {
      this.props.actions.getPrevQuestion(this.props.questionOrder[index], index, this.props.projectId, this.props.jurisdictionId, this.props.page)
      this.onShowQuestionLoader()
    }
  }

  /**
   * If there are unsaved changes, then shows a alert saying so, otherwise calls a redux action to load the question that
   * was selected in the code navigator. Shows question loader.
   *
   * @public
   * @param {object} item
   */
  onQuestionSelectedInNav = item => {
    if (this.props.unsavedChanges === true) {
      this.onShowStillSavingAlert(item, this.props.actions.onQuestionSelectedInNav)
    } else {
      this.props.actions.onQuestionSelectedInNav(item, this.props.projectId, this.props.jurisdictionId, this.props.page)
      this.onShowQuestionLoader()
    }
  }

  /**
   * Sets a timeout, after 1 sec if the application is still in the process of changing questions, calls a redux action
   * to show the loading spinner.
   *
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
   * The user has answered the question in some way. The ID is the schemeAnswerId that was changed.
   *
   * @public
   * @param {string|number} id
   * @returns {function} (event, value) a function that accepts and onChange event and then calls a redux action to update
   * the redux state with the new value.
   */
  onAnswer = id => (event, value) => {
    this.props.actions.updateUserAnswer(this.props.projectId, this.props.jurisdictionId, this.props.question.id, id, value)
    this.onChangeTouchedStatus()
    this.onSaveCodedQuestion()
  }

  /**
   * This actually dispatches the redux action that calls the api to save the question data
   * @public
   */
  onSaveCodedQuestion = () => {
    this.props.actions.saveUserAnswerRequest(this.props.projectId, this.props.jurisdictionId, this.props.question.id, this.props.selectedCategoryId, this.props.page)
  }

  /**
   * Called when the user has updated any text input field on the question (pincite, text field answer or comment)
   * @public
   * @param {string|number} id
   * @param {string} field
   * @returns {function} (event) that accepts and onChange event and calls a different redux action to update the answer
   * depending on the field parameter string.
   */
  onChangeTextAnswer = (id, field) => event => {
    switch (field) {
      case 'textAnswer':
        this.props.actions.updateUserAnswer(
          this.props.projectId, this.props.jurisdictionId, this.props.question.id, id, event.target.value
        )
        break

      case 'comment':
        this.props.actions.onChangeComment(
          this.props.projectId, this.props.jurisdictionId, this.props.question.id, event.target.value
        )
        break

      case 'pincite':
        this.props.actions.onChangePincite(
          this.props.projectId, this.props.jurisdictionId, this.props.question.id, id, event.target.value
        )
    }
    this.onChangeTouchedStatus()
    this.onSaveCodedQuestion()
  }

  /**
   * Opens an alert to ask the user to confirm to apply answer to all tabs
   * @public
   */
  onOpenApplyAllAlert = () => this.setState({ applyAllAlertOpen: true })

  /**
   * Closes the alert that is shown when there's an error with answering a question
   * @public
   */
  onCloseAlert = () => this.props.actions.dismissApiAlert('answerErrorContent')

  /**
   * Calls a redux action to change the selected tab
   * @public
   * @param {object} event
   * @param selection
   */
  onChangeCategory = (event, selection) => {
    this.onSaveCodedQuestion()
    this.props.actions.onChangeCategory(selection)
  }

  /**
   * One of the alert actions for the alert appears when the database gives an 'Object Exists' error when answering a
   * question. Tries to save the question again and closes the alert.
   * @public
   */
  onTryAgain = () => {
    this.onSaveCodedQuestion()
    this.onCloseAlert()
  }

  /**
   * Opens an alert to notify the user the application is still in the process of saving their answer. This is invoked
   * when the user tried to change question while the application was still saving. Saves the question to navigate to and
   * the method the user used in case they decided to continue changing questions.
   * @public
   * @param {object|number} question
   * @param {function} method
   */
  onShowStillSavingAlert = (question, method) => {
    this.setState({
      stillSavingAlertOpen: true,
      changeProps: typeof question === 'object' ? [question] : [this.props.questionOrder[question], question],
      changeMethod: { type: 0, method: method }
    })
  }

  /**
   * User clicks cancel in the alert that shows when the application is still saving answers, closes the alert
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
   * The user clicked 'continue' in the 'still saving' alert to continue changing questions. Calls redux action to change
   * questions, based on the method the user used when trying to change questions -- changing jurisdictions, clicking
   * next, previous or navigator question, or clicking the back arrow in the page header. Closes still saving alert
   * @public
   */
  onContinueStillSavingAlert = () => {
    // question changing
    if (this.state.changeMethod.type === 0) {
      this.state.changeMethod.method(...this.state.changeProps, this.props.projectId, this.props.jurisdictionId, this.props.page)
      this.onShowQuestionLoader()
      // jurisdiction changing
    } else if (this.state.changeMethod.type === 1) {
      this.setState({ selectedJurisdiction: this.state.changeProps[1] })
      this.props.actions.onChangeJurisdiction(this.state.changeProps[1], this.props.jurisdictionsList)
      this.state.changeMethod.method(...this.state.changeProps)
      this.onShowQuestionLoader()
    } else {
      // clicked the back button
      this.state.changeMethod.method()
    }

    this.onCancelStillSavingAlert()
  }

  /**
   * Invoked when the user confirms they want to clear their answer, calls a redux action to clear answer and save that
   * to the database. Changes touched status of question
   * @public
   */
  onClearAnswer = () => {
    this.props.actions.onClearAnswer(this.props.projectId, this.props.jurisdictionId, this.props.question.id)
    this.onChangeTouchedStatus()
    this.onSaveCodedQuestion()
  }

  /**
   * If there are unsaved changes, then shows an alert notifying so, else goes back one in browser history. Invoked when
   * the user clicks the 'back arrow' icon button in the page header.
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

  /**
   * Calls a redux action to change the touched status of the question IFF it was previously untouched.
   * @public
   */
  onChangeTouchedStatus = () => {
    if (!this.props.hasTouchedQuestion) {
      this.props.actions.changeTouchedStatus()
    }
  }

  /**
   * Closes alert that is shown when the user clicks 'apply to all tabs' button
   * @public
   */
  onCloseApplyAllAlert = () => this.setState({ applyAllAlertOpen: false })

  /**
   * The user confirmed they want to apply answer to all tabs, calls redux action to apply to all tabs, and closes the
   * alert
   * @public
   */
  onApplyToAll = () => {
    this.onCloseApplyAllAlert()
    this.onChangeTouchedStatus()
    this.props.actions.applyAnswerToAll(this.props.projectId, this.props.jurisdictionId, this.props.question.id, this.props.page)
  }

  /**
   * This view is shown if there are either no jurisdiction or a coding scheme for the project
   * @public
   * @param {boolean} noScheme
   * @param {boolean} noJurisdictions
   */
  onShowGetStartedView = (noScheme, noJurisdictions) => {
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
      <Container
        column
        flex
        alignItems="center"
        style={{ justifyContent: 'center', padding: 30, textAlign: 'center' }}>
        <Typography type="display1" style={{ marginBottom: '20px' }}>{startedText}</Typography>
        <Row displayFlex style={{ width: '100%', justifyContent: 'space-evenly' }}>
          {noScheme && this.props.userRole !== 'Coder' &&
          <TextLink to={{ pathname: `/project/${this.props.projectId}/coding-scheme` }}>
            <Button value="Create Coding Scheme" color="accent" />
          </TextLink>}
          {noJurisdictions && this.props.userRole !== 'Coder' &&
          <TextLink to={{ pathname: `/project/${this.props.projectId}/jurisdictions` }}>
            <Button value="Add Jurisdictions" color="accent" />
          </TextLink>}
        </Row>
      </Container>
    )
  }

  /**
   * View that is shown when there are jurisdictions and coding scheme for the project. The question card view.
   * @public
   */
  onShowCodeView = () => (
    <Fragment>
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
      />
      <FooterNavigate
        currentIndex={this.props.currentIndex}
        getNextQuestion={this.getNextQuestion}
        getPrevQuestion={this.getPrevQuestion}
        totalLength={this.props.questionOrder.length}
        showNextButton={this.props.showNextButton}
      />
    </Fragment>
  )

  render() {
    return (
      <Container
        flex style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexWrap: 'nowrap' }}>
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
          onCloseAlert={this.onCloseAlert} />
        <ApiErrorAlert
          open={this.props.getQuestionErrors !== null}
          content={this.props.getQuestionErrors}
          onCloseAlert={() => this.props.actions.dismissApiAlert('getQuestionErrors')} />
        {!this.props.showPageLoader &&
        <Navigator
          open={this.state.navOpen}
          page={this.props.page}
          selectedCategory={this.props.selectedCategory}
          handleQuestionSelected={this.onQuestionSelectedInNav}
        />}
        <HeaderedLayout
          padding={false}
          className={
            classNames(this.props.classes.mainContent, {
              [this.props.classes.openNavShift]: this.state.navOpen && !this.props.showPageLoader,
              [this.props.classes.pageLoading]: this.props.showPageLoader
            })}>
          <Column flex displayFlex style={{ width: '100%', flexWrap: 'nowrap' }}>
            <Header
              projectName={this.props.projectName}
              projectId={this.props.projectId}
              jurisdictionsList={this.props.jurisdictionsList}
              selectedJurisdiction={this.state.selectedJurisdiction}
              onJurisdictionChange={this.onJurisdictionChange}
              pageTitle={capitalizeFirstLetter(this.props.page)}
              currentJurisdiction={this.props.jurisdiction}
              onGoBack={this.onGoBack}
              empty={this.props.jurisdiction === null || this.props.questionOrder === null ||
              this.props.questionOrder.length === 0}
            />
            <Container flex style={{ backgroundColor: '#f5f5f5' }}>
              <Row displayFlex flex style={{ overflow: 'auto' }}>
                {!this.props.showPageLoader && <Column>
                  {this.state.showViews &&
                  (this.props.jurisdiction !== null && this.props.questionOrder.length !== 0) &&
                  <Tooltip
                    placement="right"
                    text="Toggle Navigator"
                    id="toggle-navigator"
                    aria-label="Toggle Navigator">
                    <MuiButton style={navButtonStyles} aria-label="Toggle Navigator" onClick={this.onToggleNavigator}>
                      <Icon color="#424242" style={iconStyle}>menu</Icon></MuiButton></Tooltip>}
                </Column>}
                <Column displayFlex flex style={{ padding: '1px 27px 10px 27px', overflow: 'auto' }}>
                  {this.state.showSchemeError &&
                  <ApiErrorView error="We couldn't get the coding scheme for this project." />}
                  {this.props.showPageLoader === true
                    ? <PageLoader circularLoaderProps={{ color: 'primary', size: 50 }} />
                    : this.state.showViews &&
                    (this.props.areJurisdictionsEmpty === true || this.props.isSchemeEmpty === true
                      ? this.onShowGetStartedView(this.props.isSchemeEmpty, this.props.areJurisdictionsEmpty)
                      : this.onShowCodeView())}
                </Column>
              </Row>
            </Container>
          </Column>
        </HeaderedLayout>
      </Container>
    )
  }
}

export default withCodingValidation