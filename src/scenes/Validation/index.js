import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { findDOMNode } from 'react-dom'
import Container, { Row, Column } from 'components/Layout'
import Icon from 'components/Icon'
import * as actions from './actions'
import { Header, QuestionCard, FooterNavigate, Navigator, bodyStyles } from 'components/CodingValidation'
import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'
import { default as MuiButton } from 'material-ui/Button'
import HeaderedLayout from 'components/HeaderedLayout'
import Alert from 'components/Alert'

const navButtonStyles = {
  height: 90,
  width: 20,
  minWidth: 'unset',
  minHeight: 'unset',
  backgroundColor: '#a7bdc6',
  padding: 0,
  top: '35%',
  borderRadius: '0 5px 5px 0',
  boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
  color: 'white'
}

const iconStyle = {
  transform: 'rotate(90deg)'
}

const styles = theme => bodyStyles(theme)

export class Validation extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      selectedJurisdiction: this.props.jurisdictionId,
      showViews: false,
      navOpen: true,
      applyAllAlertOpen: false,
      flagConfirmAlertOpen: false
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
  }

  componentWillMount() {
    this.props.actions.getValidationOutlineRequest(this.props.projectId, this.props.jurisdictionId)
    this.props.actions.getCodedUsersAnswers(this.props.projectId, this.props.jurisdictionId)
  }

  componentWillUnmount() {
    this.props.actions.onCloseValidationScreen()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isSchemeEmpty !== null) {
      this.setState({ showViews: true })
    }
  }

  componentWillUnmount() {
    this.props.actions.onCloseValidationScreen()
  }

  onToggleNavigator = () => {
    this.setState({ navOpen: !this.state.navOpen })
  }

  getNextQuestion = index => {
    this.props.actions.getNextQuestion(this.props.questionOrder[index], index)
  }

  getPrevQuestion = index => {
    this.props.actions.getPrevQuestion(this.props.questionOrder[index], index)
  }

  onJurisdictionChange = event => {
    this.setState({ selectedJurisdiction: event.target.value })
    this.props.actions.onValidationJurisdictionChange(event.target.value, this.props.jurisdictionsList)
    this.props.actions.getUserValidatedQuestionsRequest(this.props.projectId, event.target.value)
  }

  onAnswer = id => (event, value) => {
    this.props.actions.validateQuestionRequest(
      this.props.projectId, this.props.jurisdictionId, this.props.question.id, id, value
    )
    this.props.actions.updateEditedFields(this.props.projectId)
  }

  onChangeTextAnswer = (id, field) => event => {
    switch (field) {
      case 'textAnswer':
        this.props.actions.validateQuestionRequest(
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
        break
    }
    this.props.actions.updateEditedFields(this.props.projectId)
  }

  onOpenFlagConfirmAlert = () => {
    this.setState({
      flagConfirmAlertOpen: true
    })
  }

  onClearFlag = flagId => {
  }

  onCloseFlagConfigAlert = () => {
    this.setState({
      flagConfirmAlertOpen: false
    })
  }

  onOpenApplyAllAlert = () => {
    this.setState({
      applyAllAlertOpen: true
    })
  }

  onCloseApplyAllAlert = () => {
    this.setState({
      applyAllAlertOpen: false
    })
  }

  onApplyToAll = () => {
    this.onCloseApplyAllAlert()
    this.props.actions.applyAnswerToAll(this.props.projectId, this.props.jurisdictionId, this.props.question.id)
  }

  onShowCodeView = () => (
    <Fragment>
      <QuestionCard
        question={this.props.question}
        onChange={this.onAnswer}
        userAnswers={this.props.question.isCategoryQuestion
          ? this.props.userAnswers[this.props.selectedCategoryId]
          : this.props.userAnswers}
        mergedUserQuestions={this.props.question.isCategoryQuestion
          ? this.props.mergedUserQuestions[this.props.selectedCategoryId]
          : this.props.mergedUserQuestions}
        onChangeTextAnswer={this.onChangeTextAnswer}
        categories={this.props.categories}
        selectedCategory={this.props.selectedCategory}
        onChangeCategory={this.props.actions.onChangeCategory}
        onClearAnswer={() => this.props.actions.onClearAnswer(this.props.projectId, this.props.jurisdictionId, this.props.question.id)}
        currentUserInitials={this.props.currentUserInitials}
        onOpenAlert={this.onOpenApplyAllAlert}
        onOpenFlagConfirmAlert={this.onOpenFlagConfirmAlert}
        isValidation={true}
        selectedCategoryId={this.props.selectedCategoryId}
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
        flex
        style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexWrap: 'nowrap' }}
      >
        <Alert
          open={this.state.applyAllAlertOpen}
          text="You are applying your answer to ALL categories. Previously answered questions will be changed."
          actions={this.modalActions}
        />
        <Alert
          open={this.state.flagConfirmAlertOpen}
          text="Are you sure you want to clear this flag?"
          actions={this.confirmAlertActions}
        />
        <Navigator
          open={this.state.navOpen}
          scheme={this.props.scheme}
          allUserAnswers={this.props.allUserAnswers}
          currentQuestion={this.props.question}
          selectedCategory={this.props.selectedCategory}
          handleQuestionSelected={this.props.actions.onQuestionSelectedInNav}
        />
        <HeaderedLayout
          padding={false}
          className={classNames(this.props.classes.mainContent, { [this.props.classes.openNavShift]: this.state.navOpen })}
        >
          <Column flex displayFlex style={{ width: '100%', flexWrap: 'nowrap' }}>
            <Header
              projectName={this.props.projectName} projectId={this.props.projectId}
              jurisdictionsList={this.props.jurisdictionsList}
              selectedJurisdiction={this.state.selectedJurisdiction}
              currentJurisdiction={this.props.jurisdiction}
              onJurisdictionChange={this.onJurisdictionChange}
              isValidation={true}
              empty={this.props.jurisdiction === null || this.props.questionOrder === null ||
              this.props.questionOrder.length === 0}
            />
            <Container flex style={{ backgroundColor: '#f5f5f5' }}>
              <Row displayFlex flex style={{ overflow: 'auto' }}>
                <Column>
                  {this.state.showViews &&
                  (this.props.jurisdiction !== null && this.props.questionOrder.length !== 0) &&
                  <MuiButton style={navButtonStyles} onClick={this.onToggleNavigator}>
                    <Icon color="white" style={iconStyle}>menu</Icon></MuiButton>}
                </Column>
                <Column displayFlex flex style={{ padding: '1px 27px 10px 27px', overflow: 'auto' }}>
                  {this.state.showViews && (this.props.jurisdiction === null || this.props.questionOrder.length === 0
                    ? null
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

Validation.propTypes = {
  projectName: PropTypes.string,
  projectId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  question: PropTypes.object,
  currentIndex: PropTypes.number,
  questionOrder: PropTypes.array,
  actions: PropTypes.object,
  categories: PropTypes.array
}

const mapStateToProps = (state, ownProps) => {
  const project = state.scenes.home.main.projects.byId[ownProps.match.params.id]
  return {
    projectName: project.name,
    projectId: ownProps.match.params.id,
    question: state.scenes.validation.question || {},
    currentIndex: state.scenes.validation.currentIndex || 0,
    questionOrder: state.scenes.validation.scheme === null ? null : state.scenes.validation.scheme.order,
    categories: state.scenes.validation.categories || undefined,
    selectedCategory: state.scenes.validation.selectedCategory || 0,
    userAnswers: state.scenes.validation.userAnswers[state.scenes.validation.question.id] || {},
    mergedUserQuestions: state.scenes.validation.mergedUserQuestions[state.scenes.validation.question.id] ||
    { answers: [] },
    showNextButton: state.scenes.validation.showNextButton,
    jurisdictionsList: project.projectJurisdictions || [],
    jurisdictionId: state.scenes.validation.jurisdictionId || (project.projectJurisdictions.length > 0
      ? project.projectJurisdictions[0].id
      : null),
    jurisdiction: state.scenes.validation.jurisdiction || (project.projectJurisdictions.length > 0
      ? project.projectJurisdictions[0]
      : null),
    isSchemeEmpty: state.scenes.validation.scheme === null ? null : state.scenes.validation.scheme.order.length === 0,
    userRole: state.data.user.currentUser.role,
    currentUserInitials: state.data.user.currentUser.firstName === 'Admin'
      ? state.data.user.currentUser.firstName[0]
      : state.data.user.currentUser.firstName[0] + state.data.user.currentUser.lastName[0],
    scheme: state.scenes.validation.scheme === null ? {} : state.scenes.validation.scheme,
    allUserAnswers: state.scenes.validation.userAnswers || {},
    selectedCategoryId: state.scenes.validation.selectedCategoryId || null
  }
}

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Validation))