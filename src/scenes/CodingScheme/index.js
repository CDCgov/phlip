import React, { Component, Fragment } from 'react'
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
import Alert from 'components/Alert'
import Icon from 'components/Icon'
import ApiErrorView from 'components/ApiErrorView'

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

  onCloseAlert = () => {
    this.props.actions.resetReorderError()
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
        <Alert
          actions={[{ value: 'Dismiss', type: 'button', onClick: this.onCloseAlert }]}
          open={this.props.reorderError !== null}
          title={<Fragment><Icon size={30} color="red" style={{ paddingRight: 10 }}>sentiment_very_dissatisfied</Icon>
            Uh-oh! Something went wrong.</Fragment>}>
          <Typography variant="body1">
            We failed to save the reorder of the scheme. The question order has been reset. Please try again later.
          </Typography>
        </Alert>
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
  reorderError: state.scenes.codingScheme.reorderError || null
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(CodingScheme)