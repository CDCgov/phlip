import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Container, { Row, Column } from 'components/Layout'
import Header from './components/Header'
import Footer from './components/Footer'
import QuestionCard from './components/QuestionCard'
import FooterNavigate from './components/FooterNavigate'
import * as actions from './actions'

export class Coding extends Component {
  constructor(props, context) {
    super(props, context)
  }

  componentWillMount() {
    this.props.actions.getCodingOutlineRequest(this.props.projectId, '1')
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
  }

  onChangeTextAnswer = (id, field) => event => {
    switch(field) {
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
  }

  render() {
    return (
      <Container column flex>
        <Header projectName={this.props.projectName} projectId={this.props.projectId} />
        <Container flex column style={{ backgroundColor: '#f5f5f5', padding: '20px 20px 10px 20px' }}>
          <QuestionCard question={this.props.question} onChange={this.onAnswer}
                        userAnswers={this.props.userAnswers}
                        onChangeTextAnswer={this.onChangeTextAnswer} categories={this.props.categories}
                        selectedCategory={this.props.selectedCategory} onChangeCategory={this.props.actions.onChangeCategory}
          />
          <FooterNavigate currentIndex={this.props.currentIndex} getNextQuestion={this.getNextQuestion} getPrevQuestion={this.getPrevQuestion}
                          totalLength={this.props.questionOrder.length} />
        </Container>
    <Footer onClose={() => this.props.actions.onCloseCodeScreen() } />
  </Container>
  )
  }
}

Coding.propTypes = {
  projectName: PropTypes.string,
  projectId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  question: PropTypes.object,
  outline: PropTypes.object,
  currentIndex: PropTypes.number,
  questionOrder: PropTypes.array,
  actions: PropTypes.object,
  categories: PropTypes.array
}

const mapStateToProps = (state, ownProps) => ({
  projectName: state.scenes.home.main.projects.byId[ownProps.match.params.id].name,
  projectId: ownProps.match.params.id,
  question: state.scenes.coding.question || {},
  outline: state.scenes.coding.outline || {},
  currentIndex: state.scenes.coding.currentIndex || 0,
  questionOrder: state.scenes.coding.scheme.order || [],
  categories: state.scenes.coding.categories || undefined,
  selectedCategory: state.scenes.coding.selectedCategory || 0,
  jurisdictionId: '1',
  userAnswers: state.scenes.coding.userAnswers[state.scenes.coding.question.id] || {}
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(Coding)