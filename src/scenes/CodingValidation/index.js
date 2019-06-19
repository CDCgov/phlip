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
import Resizable from 're-resizable'

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

const ResizeHandle = () => <Icon>more_vert</Icon>

export class CodingValidation extends Component {
  static propTypes = {
    project: PropTypes.object,
    page: PropTypes.string,
    isValidation: PropTypes.bool,
    question: PropTypes.object,
    currentIndex: PropTypes.number,
    questionOrder: PropTypes.array,
    showNextButton: PropTypes.bool,
    isSchemeEmpty: PropTypes.bool,
    areJurisdictionsEmpty: PropTypes.bool,
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
    objectExists: PropTypes.bool,
    getRequestInProgress: PropTypes.bool,
    annotationModeEnabled: PropTypes.bool,
    match: PropTypes.object
  }
  
  constructor(props, context) {
    super(props, context)
    
    this.state = {
      jurisdiction: props.project.projectJurisdictions.length > 0
        ? props.match.params.jid
          ? props.project.projectJurisdictions.find(j => parseInt(props.match.params.jid) === parseInt(j.id))
          : props.project.projectJurisdictions[0]
        :null,
      showViews: false,
      navOpen: false,
      applyAllAlertOpen: false,
      showSchemeError: false,
      changeProps: [],
      stillSavingAlertOpen: false,
      changeMethod: null,
      flagConfirmAlertOpen: false,
      flagToDelete: null,
      startedText: '',
      showNav: false
    }
    
    this.confirmAlertActions = [
      { value: 'Clear Flag', type: 'button', onClick: this.onClearFlag }
    ]
    
    this.modalActions = [
      {
        value: 'Continue',
        type: 'button',
        onClick: this.onApplyToAll
      }
    ]
    
    this.stillSavingActions = [
      { ...this.modalActions[0], onClick: this.onContinueStillSavingAlert }
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
    const { isValidation, page, actions, project, match } = this.props
    const { jurisdiction } = this.state
    
    let q = null, jur = jurisdiction.id
    
    if (match.params.jid) {
      jur = match.params.jid
      q = match.params.qid
    }
    
    document.title = `PHLIP - ${project.name} - ${isValidation ? 'Validate' : 'Code'} `
    actions.setPage(page)
    
    if (page === 'coding') {
      actions.getCodingOutlineRequest(project.id, jur, q)
    } else {
      actions.getValidationOutlineRequest(project.id, jur, q)
    }
    this.onShowPageLoader()
  }
  
  componentDidUpdate(prevProps, prevState) {
    const { getRequestInProgress, areJurisdictionsEmpty, isSchemeEmpty, schemeError, question } = this.props
    const { jurisdiction } = this.state
    
    if (!getRequestInProgress && prevProps.getRequestInProgress) {
      if (areJurisdictionsEmpty || isSchemeEmpty) {
        this.onShowGetStartedView()
      } else {
        if (schemeError === null) {
          this.onShowCodeView()
          this.changeRoutes()
        }
      }
    }
 
    if (prevProps.question.id !== question.id || prevState.jurisdiction.id !== jurisdiction.id) {
      this.changeRoutes()
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
  
  changeRoutes = () => {
    const { history, question, match } = this.props
    const { jurisdiction } = this.state
    
    history.push({
      pathname: `/project/${match.params.id}/${match.params.view}/${jurisdiction.id}/${question.id}`
    })
  }
  
  /**
   * @public
   * @param index
   */
  getNextQuestion = index => {
    const { annotationModeEnabled, actions, question, questionOrder, unsavedChanges, project } = this.props
    const { jurisdiction } = this.state
    
    if (annotationModeEnabled) {
      actions.toggleAnnotationMode(question.id, '', false)
    }
    
    if (unsavedChanges) {
      this.onShowStillSavingAlert(index, actions.getNextQuestion)
    } else {
      actions.getNextQuestion(questionOrder[index], index, project.id, jurisdiction.id)
      this.onShowQuestionLoader()
    }
  }
  
  /**
   * @public
   * @param index
   */
  getPrevQuestion = index => {
    const { annotationModeEnabled, actions, question, project, questionOrder, unsavedChanges } = this.props
    const { jurisdiction } = this.state
  
    if (annotationModeEnabled) {
      actions.toggleAnnotationMode(question.id, '', false)
    }
    
    if (unsavedChanges) {
      this.onShowStillSavingAlert(index, actions.getPrevQuestion)
    } else {
      actions.getPrevQuestion(questionOrder[index], index, project.id, jurisdiction.id)
      this.onShowQuestionLoader()
    }
  }
  
  /**
   * @public
   * @param item
   */
  onQuestionSelectedInNav = item => {
    const { annotationModeEnabled, actions, question, project, unsavedChanges } = this.props
    const { jurisdiction } = this.state
  
    if (annotationModeEnabled) {
      actions.toggleAnnotationMode(question.id, '', false)
    }
    
    if (unsavedChanges) {
      this.onShowStillSavingAlert(item, actions.onQuestionSelectedInNav)
    } else {
      actions.onQuestionSelectedInNav(item, project.id, jurisdiction.id)
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
    const { annotationModeEnabled, actions, question, project } = this.props
    const { jurisdiction } = this.state
  
    if (annotationModeEnabled) {
      actions.toggleAnnotationMode(question.id, '', false)
    }
    
    actions.updateUserAnswer(project.id, jurisdiction.id, question.id, id, value)
    this.onChangeTouchedStatus()
    this.onSaveCodedQuestion()
  }
  
  /**
   * This actually dispatches the redux action that calls the api to save the question data
   * @public
   */
  onSaveCodedQuestion = () => {
    const { project, question, selectedCategoryId, actions } = this.props
    const { jurisdiction } = this.state
  
    actions.saveUserAnswerRequest(project.id, jurisdiction.id, question.id, selectedCategoryId)
  }
  
  /**
   * @public
   * @param id
   * @param field
   * @returns {Function}
   */
  onChangeTextAnswer = (id, field) => event => {
    const { project, question, actions, annotationModeEnabled } = this.props
    const { jurisdiction } = this.state
  
    if (annotationModeEnabled) {
      actions.toggleAnnotationMode(question.id, '', false)
    }
    
    switch (field) {
      case 'textAnswer':
        actions.updateUserAnswer(project.id, jurisdiction.id, question.id, id, event.target.value)
        break
      
      case 'comment':
        actions.onChangeComment(project.id, jurisdiction.id, question.id, event.target.value)
        break
      
      case 'pincite':
        actions.onChangePincite(project.id, jurisdiction.id, question.id, id, event.target.value)
        break
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
    const { project, actions } = this.props
    const { changeProps, changeMethod, jurisdiction } = this.state
    
    // question changing
    if (changeMethod.type === 0) {
      changeMethod.method(...changeProps, project.id, jurisdiction.id)
      this.onShowQuestionLoader()
      // jurisdiction changing
    } else if (changeMethod.type === 1) {
      actions.onChangeJurisdiction(changeProps[1], project.projectJurisdictions)
      changeMethod.method(...changeProps)
      this.onShowQuestionLoader()
    } else {
      // clicked the back button
      changeMethod.method()
    }
    
    this.onCancelStillSavingAlert()
  }
  
  /**
   * @public
   */
  onClearAnswer = () => {
    const { project, question, actions } = this.props
    const { jurisdiction } = this.state
  
    actions.onClearAnswer(project.id, jurisdiction.id, question.id)
    this.onChangeTouchedStatus()
    this.onSaveCodedQuestion()
  }
  
  /**
   * @public
   */
  onGoBack = () => {
    const { unsavedChanges, history } = this.props
    
    if (unsavedChanges === true) {
      this.setState({
        stillSavingAlertOpen: true,
        changeMethod: { type: 2, method: history.goBack }
      })
    } else {
      history.goBack()
    }
  }
  
  /***
   * @public
   */
  onChangeTouchedStatus = () => {
    const { hasTouchedQuestion, actions } = this.props
    
    if (!hasTouchedQuestion) {
      actions.changeTouchedStatus()
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
    const { actions, project, question } = this.props
    const { jurisdiction } = this.state
  
    this.onCloseApplyAllAlert()
    this.onChangeTouchedStatus()
    actions.applyAnswerToAll(project.id, jurisdiction.id, question.id)
  }
  
  /**
   * @public
   * @returns {*}
   */
  onShowGetStartedView = () => {
    const { isSchemeEmpty, areJurisdictionsEmpty, user, isValidation } = this.props
    const noScheme = isSchemeEmpty
    const noJurisdictions = areJurisdictionsEmpty
    
    let startedText = ''
    if (isValidation) {
      if (noScheme && !noJurisdictions) {
        startedText = 'This project doesn\'t have a coding scheme.'
      } else if (!noScheme && noJurisdictions) {
        startedText = 'This project doesn\'t have jurisdictions.'
      } else {
        startedText = 'This project does not have a coding scheme or jurisdictions.'
      }
    } else {
      if (user.role === 'Coder') {
        startedText = 'The coordinator for this project has not created a coding scheme or added jurisdictions.'
      } else if (noScheme && !noJurisdictions) {
        startedText = 'You must add questions to the coding scheme before coding.'
      } else if (!noScheme && noJurisdictions) {
        startedText = 'You must add jurisdictions to the project before coding.'
      } else {
        startedText = 'You must add jurisdictions and questions to the coding scheme before coding.'
      }
    }
    this.setState({
      startedText
    })
  }
  
  /**
   * @public
   * @returns {*}
   */
  onShowCodeView = () => {
    this.setState({
      navOpen: true,
      showNav: true
    })
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
    const { unsavedChanges, page, actions, project, annotationModeEnabled, question } = this.props
    
    if (annotationModeEnabled) {
      actions.toggleAnnotationMode(question.id, '', false)
    }
    
    if (unsavedChanges) {
      this.setState({
        stillSavingAlertOpen: true,
        changeMethod: {
          type: 1,
          method: page === 'coding'
            ? actions.getUserCodedQuestions
            : actions.getUserValidatedQuestionsRequest
        },
        changeProps: [project.id, event.target.value]
      })
    } else {
      const newIndex = project.projectJurisdictions.findIndex(jur => jur.id === event.target.value)
      this.setState({
        jurisdiction: project.projectJurisdictions[newIndex]
      })
      
      if (page === 'coding') {
        actions.getUserCodedQuestions(project.id, event.target.value)
      } else {
        actions.getUserValidatedQuestionsRequest(project.id, event.target.value)
      }
      
      this.onShowQuestionLoader()
      actions.getApprovedDocumentsRequest(project.id, project.projectJurisdictions[newIndex].jurisdictionId, page)
    }
  }
  
  /**
   * The user has clicked 'save' in either of the flag popover forms
   * @public
   * @param flagInfo
   */
  onSaveFlag = flagInfo => {
    const { actions, project, question, user, selectedCategoryId } = this.props
    const { jurisdiction } = this.state
  
    const flag = {
      raisedBy: {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName
      },
      ...flagInfo
    }
    
    if (flagInfo.type === 3) {
      actions.onSaveRedFlag(project.id, question.id, flag)
    } else {
      actions.onSaveFlag(project.id, jurisdiction.id, question.id, flag)
      actions.saveUserAnswerRequest(project.id, jurisdiction.id, question.id, selectedCategoryId)
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
    const { annotationModeEnabled, question, actions } = this.props
    
    if (annotationModeEnabled) {
      actions.toggleAnnotationMode(question.id, '', false)
    }
    
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
    const { actions, question, project } = this.props
    const { flagToDelete, jurisdiction } = this.state
    
    if (flagToDelete.type === 3) {
      actions.clearRedFlag(flagToDelete.id, question.id, project.id)
    } else {
      actions.clearFlag(flagToDelete.id, project.id, jurisdiction.id, question.id)
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
    const {
      classes, showPageLoader, answerErrorContent, objectExists, getQuestionErrors, actions, page, selectedCategory,
      questionOrder, isSchemeEmpty, schemeError, areJurisdictionsEmpty, saveFlagErrorContent,
      getRequestInProgress, user, currentIndex, showNextButton, question, project
    } = this.props
    
    const {
      navOpen, applyAllAlertOpen, stillSavingAlertOpen, flagConfirmAlertOpen, startedText, showNav, jurisdiction
    } = this.state
    
    const containerClasses = classNames(classes.mainContent, {
      [classes.openNavShift]: navOpen && !showPageLoader,
      [classes.pageLoading]: !navOpen
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
      <FlexGrid container type="row" flex className={containerClasses} style={containerStyle}>
        <Alert
          open={applyAllAlertOpen}
          actions={this.modalActions}
          title="Warning"
          onCloseAlert={this.onCloseApplyAllAlert}>
          <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
            Your answer will apply to ALL categories. Previous answers will be overwritten.
          </Typography>
        </Alert>
        <Alert
          open={stillSavingAlertOpen}
          onCloseAlert={this.onCancelStillSavingAlert}
          title="Still Saving Changes"
          actions={this.stillSavingActions}>
          <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
            We haven't finished saving your answer. If you continue, changes might not be saved.
          </Typography>
        </Alert>
        <ApiErrorAlert
          open={answerErrorContent !== null}
          content={answerErrorContent}
          actions={objectExists ? [] : this.saveFailedActions}
          onCloseAlert={this.onCloseAlert}
        />
        <ApiErrorAlert
          open={getQuestionErrors !== null}
          content={getQuestionErrors}
          onCloseAlert={() => actions.dismissApiAlert('getQuestionErrors')}
        />
        {navOpen &&
        <Navigator
          open={navOpen}
          page={page}
          selectedCategory={selectedCategory}
          handleQuestionSelected={this.onQuestionSelectedInNav}
        />}
        <FlexGrid container flex style={{ width: '100%', flexWrap: 'nowrap', overflowX: 'hidden', overflowY: 'auto' }}>
          <Header
            project={project}
            onJurisdictionChange={this.onJurisdictionChange}
            pageTitle={capitalizeFirstLetter(page)}
            currentJurisdiction={jurisdiction}
            onGoBack={this.onGoBack}
            empty={jurisdiction.id === null || questionOrder === null || questionOrder.length === 0}
          />
          <FlexGrid container type="row" flex style={{ backgroundColor: '#f5f5f5' }}>
            <FlexGrid container type="row" flex style={{ overflow: 'auto' }}>
              {!showPageLoader &&
              <FlexGrid>
                {showNav &&
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
                {schemeError !== null && <ApiErrorView error="We couldn't get the coding scheme for this project." />}
                {getRequestInProgress
                  ? showPageLoader
                    ? <PageLoader circularLoaderProps={{ color: 'primary', size: 50 }} />
                    : <></>
                  : (isSchemeEmpty || areJurisdictionsEmpty)
                    ? (
                      <FlexGrid container flex align="center" justify="center" padding={30}>
                        <Typography variant="display1" style={{ marginBottom: '20px' }}>{startedText}</Typography>
                        <FlexGrid container type="row" style={{ width: '100%', justifyContent: 'space-evenly' }}>
                          {(isSchemeEmpty && user.role !== 'Coder') &&
                          <TextLink to={{ pathname: `/project/${project.id}/coding-scheme` }}>
                            <Button value="Create Coding Scheme" color="accent" />
                          </TextLink>}
                          {(areJurisdictionsEmpty && user.role) !== 'Coder' &&
                          <TextLink to={{ pathname: `/project/${project.id}/jurisdictions` }}>
                            <Button value="Add Jurisdictions" color="accent" />
                          </TextLink>}
                        </FlexGrid>
                      </FlexGrid>
                    )
                    : (schemeError === null && (
                      <>
                        <QuestionCard
                          page={page}
                          onChange={this.onAnswer}
                          onChangeTextAnswer={this.onChangeTextAnswer}
                          onChangeCategory={this.onChangeCategory}
                          onAnswer={this.onAnswer}
                          onClearAnswer={this.onClearAnswer}
                          onOpenAlert={this.onOpenApplyAllAlert}
                          onSaveFlag={this.onSaveFlag}
                          onSave={this.onSaveCodedQuestion}
                          onOpenFlagConfirmAlert={this.onOpenFlagConfirmAlert}
                          currentIndex={currentIndex}
                          getNextQuestion={this.getNextQuestion}
                          getPrevQuestion={this.getPrevQuestion}
                          totalLength={questionOrder.length}
                          showNextButton={showNextButton}
                        />
                        <Resizable
                          style={{ display: 'flex' }}
                          minWidth="10%"
                          enable={{
                            top: false,
                            right: false,
                            bottom: false,
                            left: true,
                            topRight: false,
                            bottomRight: false,
                            bottomLeft: false,
                            topLeft: false
                          }}
                          handleComponent={{ left: ResizeHandle }}
                          handleStyles={{
                            left: {
                              height: 'fit-content',
                              width: 'fit-content',
                              bottom: '50%',
                              top: 'unset'
                            }
                          }}
                          defaultSize={{
                            width: '50%',
                            height: '100%'
                          }}>
                          <FlexGrid style={{ minWidth: 15, maxWidth: 15, width: 15 }} />
                          <DocumentList
                            projectId={project.id}
                            jurisdictionId={jurisdiction.jurisdictionId}
                            page={page}
                            questionId={question.id}
                            saveUserAnswer={this.onSaveCodedQuestion}
                          />
                        </Resizable>
                      </>
                    ))
                }
              </FlexGrid>
            </FlexGrid>
          </FlexGrid>
        </FlexGrid>
        <Alert
          open={flagConfirmAlertOpen}
          onCloseAlert={this.onCloseFlagConfigAlert}
          actions={this.confirmAlertActions}
          title="Confirm Clear Flag">
          <Typography variant="body1">Do you want to clear this flag?</Typography>
        </Alert>
        
        <ApiErrorAlert
          content={saveFlagErrorContent}
          open={saveFlagErrorContent !== null}
          onCloseAlert={() => actions.dismissApiAlert('saveFlagErrorContent')}
        />
      </FlexGrid>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const project = state.data.projects.byId[ownProps.match.params.id]
  const page = ownProps.match.url.split('/')[3] === 'code' ? 'coding' : 'validation'
  const pageState = state.scenes.codingValidation.coding
  const docState = state.scenes.codingValidation.documentList

  return {
    project,
    page,
    isValidation: page === 'validation',
    question: pageState.scheme === null
      ? {}
      : pageState.scheme.byId[pageState.scheme.order[pageState.currentIndex]],
    currentIndex: pageState.currentIndex || 0,
    questionOrder: pageState.scheme === null ? null : pageState.scheme.order,
    showNextButton: pageState.showNextButton,
    isSchemeEmpty: pageState.isSchemeEmpty,
    areJurisdictionsEmpty: pageState.areJurisdictionsEmpty,
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
    objectExists: pageState.objectExists || false,
    getRequestInProgress: pageState.getRequestInProgress,
    annotationModeEnabled: docState.annotationModeEnabled
  }
}

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTracking(CodingValidation)))
