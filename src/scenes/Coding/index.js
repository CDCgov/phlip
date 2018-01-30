import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Container, { Row } from 'components/Layout'
import Header from './components/Header'
import Footer from './components/Footer'
import QuestionCard from './components/QuestionCard'
import FooterNavigate from './components/FooterNavigate'
import * as actions from './actions'
import Typography from 'material-ui/Typography'
import TextLink from 'components/TextLink'
import Button from 'components/Button'

export class Coding extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      selectedJurisdiction: this.props.jurisdictionId,
      showViews: false
    }
  }

  componentWillMount() {
    this.props.actions.getCodingOutlineRequest(this.props.projectId, this.props.jurisdictionId)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isSchemeEmpty !== null) { this.setState({ showViews: true }) }
  }

  getNextQuestion = index => {
    this.props.actions.getNextQuestion(this.props.questionOrder[index], index)
  }

  getPrevQuestion = index => {
    this.props.actions.getPrevQuestion(this.props.questionOrder[index], index)
  }

  onAnswer = id => (event, value) => {
    this.props.actions.answerQuestionRequest(
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

  onJurisdictionChange = (event) => {
    this.setState({ selectedJurisdiction: event.target.value })
    this.props.actions.onJurisdictionChange(event.target.value, this.props.jurisdictionsList)
    this.props.actions.getUserCodedQuestions(this.props.projectId, event.target.value)
  }

  onShowGetStartedView = (noScheme, noJurisdictions) => {
    let startedText = ''
    if (this.props.userRole === 'Coder') {
      startedText = 'The coordinator for this project has not created a coding scheme or added jurisdictions.'
    } else if (noScheme && !noJurisdictions) {
      startedText = 'You must add questions to the project coding scheme before coding.'
    } else if (!noScheme && noJurisdictions) {
      startedText = 'You must add jurisdictions to the project before coding.'
    } else {
      startedText = 'You must add jurisdictions and questions to the project coding scheme before coding.'
    }

    return (
      <Container column flex alignItems="center" style={{ justifyContent: 'center', padding: 30, textAlign: 'center' }}>
        <Typography type="display1" style={{ marginBottom: '20px' }}>{startedText}</Typography>
        <Row>
          {noScheme && this.props.userRole !== 'Coder' && <TextLink to={{ pathname: `/project/${this.props.projectId}/coding-scheme/` }}>
            <Button value="Create Coding Scheme" color="accent" />
          </TextLink>}
          {noJurisdictions && this.props.userRole !== 'Coder' && <TextLink to={{ pathname: `/project/${this.props.projectId}/jurisdictions/` }}>
            <Button value="Add Jurisdictions" color="accent" style={{ marginLeft: 50 }} />
          </TextLink>}
        </Row>
      </Container>
    )
  }

  onShowCodeView = () => (
    <Fragment>
      <QuestionCard
        question={this.props.question} onChange={this.onAnswer}
        userAnswers={this.props.userAnswers}
        onChangeTextAnswer={this.onChangeTextAnswer} categories={this.props.categories}
        selectedCategory={this.props.selectedCategory}
        onChangeCategory={this.props.actions.onChangeCategory}
        onClearAnswer={() => this.props.actions.onClearAnswer(this.props.projectId, this.props.jurisdictionId, this.props.question.id)}
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
      <Container column flex>
        <Header projectName={this.props.projectName} projectId={this.props.projectId}
          jurisdictionsList={this.props.jurisdictionsList}
          selectedJurisdiction={this.state.selectedJurisdiction}
          onJurisdictionChange={this.onJurisdictionChange}
          currentJurisdiction={this.props.jurisdiction}
          empty={this.props.jurisdiction === null || this.props.questionOrder === null || this.props.questionOrder.length === 0}
        />
        <Container flex column style={{ backgroundColor: '#f5f5f5', padding: '20px 20px 10px 20px' }}>
          {this.state.showViews && (this.props.jurisdiction === null || this.props.questionOrder.length === 0
            ? this.onShowGetStartedView(this.props.questionOrder.length === 0, this.props.jurisdiction === null)
            : this.onShowCodeView())}
        </Container>
        <Footer onClose={() => this.props.actions.onCloseCodeScreen()} />
      </Container>
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

const mapStateToProps = (state, ownProps) => {
  const project = state.scenes.home.main.projects.byId[ownProps.match.params.id]

  return {
    projectName: project.name,
    projectId: ownProps.match.params.id,
    question: state.scenes.coding.question || {},
    currentIndex: state.scenes.coding.currentIndex || 0,
    questionOrder: state.scenes.coding.scheme === null ? null : state.scenes.coding.scheme.order,
    categories: state.scenes.coding.categories || undefined,
    selectedCategory: state.scenes.coding.selectedCategory || 0,
    userAnswers: state.scenes.coding.userAnswers[state.scenes.coding.question.id] || {},
    showNextButton: state.scenes.coding.showNextButton,
    jurisdictionsList: project.projectJurisdictions || [],
    jurisdictionId: state.scenes.coding.jurisdictionId || (project.projectJurisdictions.length > 0
      ? project.projectJurisdictions[0].id
      : null),
    jurisdiction: state.scenes.coding.jurisdiction || (project.projectJurisdictions.length > 0
      ? project.projectJurisdictions[0]
      : null),
    isSchemeEmpty: state.scenes.coding.scheme === null ? null : state.scenes.coding.scheme.order.length === 0,
    userRole: state.data.user.currentUser.role
  }
}

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(Coding)