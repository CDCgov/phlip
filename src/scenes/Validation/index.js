import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Container, { Row } from 'components/Layout'
import { Coding } from '../Coding/index'
import * as actions from './actions'
import Header from 'components/CodingValidation/Header'
import Footer from 'components/CodingValidation/Footer'
import QuestionCard from 'components/CodingValidation/QuestionCard'
import FooterNavigate from 'components/CodingValidation/FooterNavigate'

export class Validation extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      selectedJurisdiction: this.props.jurisdictionId,
      showViews: false
    }

    this.mockUsersList = [
      {
        firstName: 'Admin',
        lastName: 'User',
        role: 'Admin',
        email: 'admin@cdc.gov',
        id: 1,
        initials: 'AU',
        pincite: '038409834092834'
      },
      {
        firstName: 'Michael',
        lastName: 'Ta',
        role: 'Admin',
        email: 'mta@cdc.gov',
        id: 1,
        initials: 'MT'
      }
    ]
  }

  componentWillMount() {
    this.props.actions.getValidationOutlineRequest(this.props.projectId, this.props.jurisdictionId)
    this.props.actions.getCodedUsersAnswers(this.props.projectId, this.props.jurisdictionId)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isSchemeEmpty !== null) {
      this.setState({ showViews: true })
    }
  }

  componentWillUnmount() {
    this.props.actions.onCloseValidationScreen()
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
      case 'fieldValue':
        this.props.actions.answerQuestionRequest(
          this.props.projectId, this.props.jurisdictionId, this.props.question.id, null, event.target.value
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
    this.props.actions.updateEditedFields(this.props.projectId)
  }

  onShowCodeView = () => (
    <Fragment>
      <QuestionCard
        question={this.props.question} onChange={this.onAnswer}
        userAnswers={this.props.userAnswers}
        mergedUserQuestions={this.props.mergedUserQuestions}
        onChangeTextAnswer={this.onChangeTextAnswer} categories={this.props.categories}
        selectedCategory={this.props.selectedCategory}
        onChangeCategory={this.props.actions.onChangeCategory}
        onClearAnswer={() => this.props.actions.onClearAnswer(this.props.projectId, this.props.jurisdictionId, this.props.question.id)}
        users={this.mockUsersList}
        currentUserInitials={this.props.currentUserInitials}
      />
      <FooterNavigate
        currentIndex={this.props.currentIndex} getNextQuestion={this.getNextQuestion}
        getPrevQuestion={this.getPrevQuestion}
        totalLength={this.props.questionOrder.length} showNextButton={this.props.showNextButton}
      />
    </Fragment>
  )

  render() {
    return (
      <Container column flex style={{ width: '100%', flexWrap: 'nowrap' }}>
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
        <Container flex column style={{ backgroundColor: '#f5f5f5' }}>
          {this.state.showViews && (this.props.jurisdiction === null || this.props.questionOrder.length === 0
            ? null
            : this.onShowCodeView())}
        </Container>
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
      : state.data.user.currentUser.firstName[0] + state.data.user.currentUser.lastName[0]
  }
}

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(Validation)