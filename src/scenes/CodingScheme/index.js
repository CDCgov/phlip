import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Typography from '@material-ui/core/Typography'
import { Route, Link } from 'react-router-dom'
import * as actions from './actions'
import Scheme from './components/Scheme'
import AddEditQuestion from './scenes/AddEditQuestion'
import { ApiErrorAlert, ApiErrorView, FlexGrid, Icon, Alert, withTracking, PageHeader, Button } from 'components'

/**
 * Coding Scheme screen main component, rendered when the user clicks 'Edit' under the Coding Scheme table header. This
 * is the parent component for all coding scheme related actions -- adding a question, deleting, reordering, etc. This
 * component has one scene: AddEditQuestion at ./scenes/AddEditQuestion.
 */
export class CodingScheme extends Component {
  static propTypes = {
    /**
     * Name of project for which the coding scheme is open
     */
    projectName: PropTypes.string,
    /**
     * ID of project
     */
    projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Array of question tree to render as the coding scheme
     */
    questions: PropTypes.array,
    /**
     * Whether or not the coding scheme is empty
     */
    empty: PropTypes.bool,
    /**
     * Redux action creators
     */
    actions: PropTypes.object,
    /**
     * Outline of the coding scheme
     */
    outline: PropTypes.object,
    /**
     * Flat list of questions (not a tree)
     */
    flatQuestions: PropTypes.array,
    /**
     * Any scheme error to render, will be rendered as a part of the page, not alert
     */
    schemeError: PropTypes.string,
    /**
     * Error that occured while trying to save reorder, displayed as an alert
     */
    reorderError: PropTypes.string,
    /**
     * Whether or not the coding scheme is currently locked by the user
     */
    lockedByCurrentUser: PropTypes.bool,
    /**
     * Information on lock of coding scheme, if any
     */
    lockInfo: PropTypes.object,
    /**
     * Any error to display as an alert
     */
    alertError: PropTypes.string,
    /**
     * Displays an alert notifying the user the coding scheme is currently locked
     */
    lockedAlert: PropTypes.string,
    /**
     * Whether or not the coding scheme is currently locked
     */
    hasLock: PropTypes.bool,
    /**
     * Routing history
     */
    history: PropTypes.object
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      goBackAlertOpen: false,
      deleteQuestionAlertOpen: false,
      questionIdToDelete: null,
      path: null
    }

    this.deleteAlertActions = [
      {
        value: 'Cancel',
        type: 'button',
        onClick: this.onCloseDeleteQuestionAlert,
        preferred : true
      },
      {
        value: 'Delete',
        type: 'button',
        onClick: this.handleDeleteQuestion
      }
    ]
  }

  componentDidMount() {
    this.props.actions.getSchemeRequest(this.props.projectId)
    setTimeout(() => {
      this.props.actions.setEmptyState()
    }, 1000)
  }

  /**
   * Calls a redux action to close any ApiErrorAlert that is open
   * @public
   */
  onCloseAlert = () => {
    this.props.actions.resetAlertError()
  }

  /**
   * Calls a redux action to close any alert that is associated to the locking on the coding scheme
   * @public
   */
  onCloseLockedAlert = () => {
    this.props.actions.closeLockedAlert()
  }

  /**
   * Invoked when the user reorders the coding scheme or makes any edits to the scheme. Calls a redux action to update
   * the question tree with the questions parameter
   * @param questions
   */
  handleQuestionTreeChange = questions => {
    this.props.actions.updateQuestionTree(questions)
  }

  /**
   * Invoked after a question is move, calls a redux action to send API request
   * @public
   */
  handleQuestionNodeMove = () => {
    this.props.actions.reorderSchemeRequest(this.props.projectId)
  }

  /**
   * Invoked when the user clicks 'Checkout' button, calls a redux action to send API request to checkout scheme
   * @public
   */
  handleLockCodingScheme = () => {
    this.props.actions.lockCodingSchemeRequest(this.props.projectId)
  }

  /**
   * Invoked when the user clicks 'Check In' button, calls a redux action to send API request to check in the scheme
   * @public
   */
  handleUnlockCodingScheme = () => {
    this.props.actions.unlockCodingSchemeRequest(this.props.projectId)
  }

  /**
   * Invoked when the user confirms delete of coding scheme question, closes confirm delete alert
   * @public
   */
  handleDeleteQuestion = () => {
    this.props.actions.deleteQuestionRequest(this.props.projectId, this.state.questionIdToDelete, this.state.path)
    this.onCloseDeleteQuestionAlert()
  }

  /**
   * Opens an alert to ask the user to confirm deleting a coding scheme question
   * @public
   * @param projectId
   * @param questionId
   * @param path
   */
  onOpenDeleteQuestionAlert = (projectId, questionId, path) => {
    this.setState({
      deleteQuestionAlertOpen: true,
      questionIdToDelete: questionId,
      path: path
    })
  }

  /**
   * Closes the confirm delete alert
   * @public
   */
  onCloseDeleteQuestionAlert = () => {
    this.setState({
      deleteQuestionAlertOpen: false,
      questionIdToDelete: null,
      path: null
    })
  }

  /**
   * Invoked when the user clicks 'cancel' in the alert displayed when they hit the go back arrow. Closes alert
   * @public
   */
  onCloseGoBackAlert = () => {
    this.setState({
      goBackAlertOpen: false
    })
  }

  /**
   * Invoked when the user clicks 'check in' on the alert displayed when they hit go back. Calls redux action to call
   * API to check in coding scheme, clears the redux state and goes back one in browser history
   * @public
   */
  onContinueGoBack = () => {
    this.handleUnlockCodingScheme()
    this.props.actions.clearState()
    this.props.history.goBack()
  }

  /**
   * Invoked when the user clicks the 'back arrow' button in the page header. If the coding scheme is checked out by the
   * current user, it opens an alert to tell the user to check in the scheme. Otherwise, it clears redux state and goes
   * back one in the browser history
   * @public
   */
  onGoBack = () => {
    if (this.props.lockedByCurrentUser) {
      this.setState({
        goBackAlertOpen: true
      })
    } else {
      this.props.actions.clearState()
      this.props.history.goBack()
    }
  }

  /**
   * Renders a 'Get started' view. Only called when the coding scheme is empty
   * @public
   * @returns {*}
   */
  renderGetStarted = () => {
    return (
      <FlexGrid container flex align="center" justify="center">
        {this.props.lockedByCurrentUser &&
        <>
          <Typography variant="display1" style={{ textAlign: 'center', marginBottom: '20px' }}>
            The coding scheme is empty. To get started, add a question.
          </Typography>
          <Button
            component={Link}
            to={{
              pathname: `/project/${this.props.projectId}/coding-scheme/add`,
              state: { questionDefined: null, canModify: true }
            }}
            value="Add New Question"
            color="accent"
            aria-label="Add new question to coding scheme"
          />
        </>}
        {!this.props.lockedByCurrentUser &&
        <>
          <Typography variant="display1" style={{ textAlign: 'center', marginBottom: '20px' }}>
            The coding scheme is empty. To get started, check out the coding scheme for editing.
          </Typography>
          <Button
            value="Check out"
            color="accent"
            aria-label="check out coding scheme"
            onClick={this.handleLockCodingScheme}
          />
        </>
        }
      </FlexGrid>
    )
  }

  render() {
    /**
     * Actions for the 'Go Back' alert modal
     * @type {*[]}
     */
    const alertActions = [
      {
        value: 'Cancel',
        type: 'button',
        onClick: this.onCloseGoBackAlert
      },
      {
        value: 'Check in',
        type: 'button',
        onClick: this.onContinueGoBack,
        preferred: true
      }
    ]

    return (
      <FlexGrid container flex padding="12px 20px 20px 20px">
        <Alert open={this.state.goBackAlertOpen} actions={alertActions}>
          <Typography variant="body1">
            You have checked out the coding scheme. No one else can make edits until you check it in.
          </Typography>
        </Alert>
        <Alert open={this.state.deleteQuestionAlertOpen} actions={this.deleteAlertActions}>
          <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
            You are about to delete a question from the coding scheme. This will permanantly delete all related child
            questions and coded answers.
          </Typography>
        </Alert>
        <ApiErrorAlert
          content={this.props.alertError}
          open={this.props.alertError !== ''}
          onCloseAlert={this.onCloseAlert}
        />
        <Alert
          actions={[{ value: 'Dismiss', type: 'button', onClick: this.onCloseLockedAlert }]}
          open={this.props.lockedAlert !== null}
          title={
            <><Icon size={30} color="primary" style={{ paddingRight: 10 }}>lock</Icon>
              The Coding Scheme is checked out.
            </>
          }>
          <Typography variant="body1">
            {`${this.props.lockInfo.firstName} ${this.props.lockInfo.lastName} `} checked out the coding scheme. You are unable to make changes.
          </Typography>
        </Alert>
        <PageHeader
          projectName={this.props.projectName}
          projectId={this.props.projectId}
          pageTitle="Coding Scheme"
          protocolButton
          onBackButtonClick={this.onGoBack}
          checkoutButton={{
            isLink: false,
            text: this.props.lockedByCurrentUser ? 'Check in' : 'Check out',
            props: {
              onClick: this.props.lockedByCurrentUser
                ? this.handleUnlockCodingScheme
                : this.handleLockCodingScheme
            },
            show: this.props.questions.length > 0 ||
              (this.props.questions.length === 0 && this.props.lockedByCurrentUser)
          }}
          otherButton={{
            isLink: true,
            text: '+ Add New Question',
            path: `/project/${this.props.projectId}/coding-scheme/add`,
            state: { questionDefined: null, canModify: true },
            props: {
              'aria-label': 'Add new question to coding scheme'
            },
            show: this.props.questions.length > 0 && (this.props.hasLock && this.props.lockedByCurrentUser)
          }}
        />
        <FlexGrid
          container
          type="row"
          flex
          style={{
            backgroundColor: '#f5f5f5',
            paddingTop: 25,
            marginLeft: (this.props.schemeError || this.props.empty) ? 0 : -30
          }}>
          {this.props.schemeError !== null
            ? <ApiErrorView error={this.props.schemeError} />
            : this.props.empty
              ? this.renderGetStarted()
              : <Scheme
                questions={this.props.questions}
                handleQuestionTreeChange={this.handleQuestionTreeChange}
                handleQuestionNodeMove={this.handleQuestionNodeMove}
                handleHoverOnQuestion={this.props.actions.toggleHover}
                handleDeleteQuestion={this.onOpenDeleteQuestionAlert}
                disableHover={this.props.actions.disableHover}
                enableHover={this.props.actions.enableHover}
                projectId={this.props.projectId}
                outline={this.props.outline}
                flatQuestions={this.props.flatQuestions}
                lockedByCurrentUser={this.props.lockedByCurrentUser}
                hasLock={this.props.hasLock}
              />}
        </FlexGrid>
        <Route
          path="/project/:projectId/coding-scheme/add"
          component={AddEditQuestion}
        />
        <Route
          path="/project/:projectId/coding-scheme/edit/:id"
          component={AddEditQuestion}
        />
      </FlexGrid>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => ({
  projectName: state.scenes.home.main.projects.byId[ownProps.match.params.id].name,
  projectId: ownProps.match.params.id,
  questions: state.scenes.codingScheme.questions || [],
  empty: state.scenes.codingScheme.empty || false,
  outline: state.scenes.codingScheme.outline || {},
  flatQuestions: state.scenes.codingScheme.flatQuestions || [],
  schemeError: state.scenes.codingScheme.schemeError || null,
  reorderError: state.scenes.codingScheme.reorderError || null,
  lockedByCurrentUser: state.scenes.codingScheme.lockedByCurrentUser || false,
  lockInfo: state.scenes.codingScheme.lockInfo || {},
  alertError: state.scenes.codingScheme.alertError || '',
  lockedAlert: state.scenes.codingScheme.lockedAlert || null,
  hasLock: Object.keys(state.scenes.codingScheme.lockInfo).length > 0 || false
})

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(withTracking(CodingScheme, 'Coding Scheme'))
