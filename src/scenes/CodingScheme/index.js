import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Typography from 'material-ui/Typography'
import { Route, Link } from 'react-router-dom'
import * as actions from './actions'
import Container from 'components/Layout'
import Scheme from './components/Scheme'
import Button from 'components/Button'
import AddEditQuestion from './scenes/AddEditQuestion'
import PageHeader from 'components/PageHeader'
import Alert from 'components/Alert'
import Icon from 'components/Icon'
import ApiErrorView from 'components/ApiErrorView'
import ApiErrorAlert from 'components/ApiErrorAlert'

export class CodingScheme extends Component {
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
        onClick: this.onCloseDeleteQuestionAlert
      },
      {
        value: 'Delete',
        type: 'button',
        onClick: this.handleDeleteQuestion
      }
    ]
  }

  componentWillMount() {
    this.props.actions.getSchemeRequest(this.props.projectId)
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.actions.setEmptyState()
    }, 1000)
  }

  onCloseAlert = () => {
    this.props.actions.resetAlertError()
  }

  onCloseLockedAlert = () => {
    this.props.actions.closeLockedAlert()
  }

  handleQuestionTreeChange = questions => {
    this.props.actions.updateQuestionTree(questions)
  }

  handleQuestionNodeMove = () => {
    this.props.actions.reorderSchemeRequest(this.props.projectId)
  }

  handleLockCodingScheme = () => {
    this.props.actions.lockCodingSchemeRequest(this.props.projectId)
  }

  handleUnlockCodingScheme = () => {
    this.props.actions.unlockCodingSchemeRequest(this.props.projectId)
  }

  handleDeleteQuestion = () => {
    this.props.actions.deleteQuestionRequest(this.props.projectId, this.state.questionIdToDelete, this.state.path)
    this.onCloseDeleteQuestionAlert()
  }

  onOpenDeleteQuestionAlert = (projectId, questionId, path) => {
    this.setState({
      deleteQuestionAlertOpen: true,
      questionIdToDelete: questionId,
      path: path
    })
  }

  onCloseDeleteQuestionAlert = () => {
    this.setState({
      deleteQuestionAlertOpen: false,
      questionIdToDelete: null,
      path: null
    })
  }

  onCloseGoBackAlert = () => {
    this.setState({
      goBackAlertOpen: false
    })
  }

  onContinueGoBack = () => {
    this.handleUnlockCodingScheme()
    this.props.history.goBack()
  }

  onGoBack = () => {
    if (this.props.lockedByCurrentUser) {
      this.setState({
        goBackAlertOpen: true
      })
    } else {
      this.props.history.goBack()
    }
  }

  renderGetStarted = () => {
    return (
      <Container column flex alignItems="center" style={{ justifyContent: 'center' }}>
        {this.props.lockedByCurrentUser &&
          <Fragment>
            <Typography type="display1" style={{ textAlign: 'center', marginBottom: '20px' }}>
              The coding scheme is empty. To get started, add a question.
          </Typography>
            <Button
              component={Link}
              to={{
                pathname: `/project/${this.props.projectId}/coding-scheme/add`,
                state: { questionDefined: null, canModify: true }
              }}
              value="+ Add New Question"
              color="accent"
              aria-label="Add new question to coding scheme"
            />
          </Fragment>}
        {!this.props.lockedByCurrentUser &&
          <Fragment>
            <Typography type="display1" style={{ textAlign: 'center', marginBottom: '20px' }}>
              The coding scheme is empty. To get started, check out the coding scheme for editing.
          </Typography>
            <Button
              value="Check out"
              color="accent"
              aria-label="check out coding scheme"
              onClick={this.handleLockCodingScheme} />
          </Fragment>
        }
      </Container>
    )
  }

  render() {
    const alertActions = [
      {
        value: 'Cancel',
        type: 'button',
        onClick: this.onCloseGoBackAlert
      },
      {
        value: 'Check in',
        type: 'button',
        onClick: this.onContinueGoBack
      }
    ]

    return (
      <Container column flex>
        <Alert open={this.state.goBackAlertOpen} actions={alertActions}>
          <Typography variant="body1">
            You have checked out the coding scheme. No one else can edit until you check in.
          </Typography>
        </Alert>
        <Alert open={this.state.deleteQuestionAlertOpen} actions={this.deleteAlertActions}>
          <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
            You are about to delete a question from the coding scheme.  This will permanantly delete all related child questions and coded answers.
            </Typography>
        </Alert>
        <ApiErrorAlert
          content={this.props.alertError}
          open={this.props.alertError !== null}
          onCloseAlert={this.onCloseAlert} />
        <Alert
          actions={[{ value: 'Dismiss', type: 'button', onClick: this.onCloseLockedAlert }]}
          open={this.props.lockedAlert !== null}
          title={<Fragment><Icon size={30} color="primary" style={{ paddingRight: 10 }}>lock</Icon>
            The Coding Scheme is checked out.</Fragment>}>
          <Typography variant="body1">
            {`${this.props.lockInfo.firstName} ${this.props.lockInfo.lastName} `} has checked out the coding scheme. You will
            not be able to make changes until they have checked in.
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
            show: this.props.questions.length > 0
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
        <Container
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
        </Container>
        <Route
          path="/project/:projectId/coding-scheme/add"
          component={AddEditQuestion}
        />
        <Route
          path="/project/:projectId/coding-scheme/edit/:id"
          component={AddEditQuestion}
        />
      </Container>
    )
  }
}

CodingScheme.propTypes = {
  projectName: PropTypes.string,
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  questions: PropTypes.array,
  actions: PropTypes.object,
  outline: PropTypes.object,
  flatQuestions: PropTypes.array,
  schemeError: PropTypes.string,
  reorderError: PropTypes.string
}

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
  alertError: state.scenes.codingScheme.alertError || null,
  lockedAlert: state.scenes.codingScheme.lockedAlert || null,
  hasLock: Object.keys(state.scenes.codingScheme.lockInfo).length > 0 || false
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(CodingScheme)