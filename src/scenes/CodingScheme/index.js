import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Typography from 'material-ui/Typography'
import { Route } from 'react-router-dom'
import * as actions from './actions'
import Container from 'components/Layout'
import Scheme from './components/Scheme'
import Button from 'components/Button'
import TextLink from 'components/TextLink'
import AddEditQuestion from './scenes/AddEditQuestion'
import PageHeader from 'components/PageHeader'

export class CodingScheme extends Component {
  constructor(props, context) {
    super(props, context)
  }

  componentWillMount() {
    this.props.actions.getSchemeRequest(this.props.projectId)
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.actions.setEmptyState()
    }, 1000)
  }

  handleQuestionTreeChange = questions => {
    this.props.actions.updateQuestionTree(questions)
  }

  handleQuestionNodeMove = () => {
    this.props.actions.reorderSchemeRequest(this.props.projectId)
  }

  renderGetStarted = () => (
    <Container column flex alignItems="center" style={{ justifyContent: 'center' }}>
      <Typography type="display1" style={{ textAlign: 'center', marginBottom: '20px' }}>
        The coding scheme is empty. To get started, add a question.</Typography>
      <TextLink
        to={{
          pathname: `/project/${this.props.projectId}/coding-scheme/add`,
          state: { questionDefined: null }
        }}
        aria-label="Add new question"
      >
        <Button value="+ Add New Question" color="accent" aria-label="Add new question to coding scheme" />
      </TextLink>
    </Container>
  )

  render() {
    return (
      <Container column flex>
        <PageHeader
          projectName={this.props.projectName}
          showButton={this.props.questions.length > 0}
          projectId={this.props.projectId}
          pageTitle="Coding Scheme"
          protocolButton
          otherButton={{
            isLink: true,
            text: '+ Add New Question',
            path: `/project/${this.props.projectId}/coding-scheme/add`,
            state: { questionDefined: null },
            props: { 'aria-label': 'Add new question to  coding scheme' }
          }}
        />
        <Container flex style={{ backgroundColor: '#f5f5f5', paddingTop: 25, marginLeft: -30 }}>
          {this.props.empty
            ? this.renderGetStarted()
            : <Scheme
              questions={this.props.questions}
              handleQuestionTreeChange={this.handleQuestionTreeChange}
              handleQuestionNodeMove={this.handleQuestionNodeMove}
              handleHoverOnQuestion={this.props.actions.toggleHover}
              disableHover={this.props.actions.disableHover}
              enableHover={this.props.actions.enableHover}
              projectId={this.props.projectId}
              outline={this.props.outline}
              flatQuestions={this.props.flatQuestions}
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
  flatQuestions: PropTypes.array
}

const mapStateToProps = (state, ownProps) => ({
  projectName: state.scenes.home.main.projects.byId[ownProps.match.params.id].name,
  projectId: ownProps.match.params.id,
  questions: state.scenes.codingScheme.questions || [],
  empty: state.scenes.codingScheme.empty || false,
  outline: state.scenes.codingScheme.outline || {},
  flatQuestions: state.scenes.codingScheme.flatQuestions || []
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(CodingScheme)