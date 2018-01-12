import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Typography from 'material-ui/Typography'
import { Route } from 'react-router-dom'
import * as actions from './actions'
import Container from 'components/Layout'
import Header from './components/Header'
import Footer from './components/Footer'
import Scheme from './components/Scheme'
import Button from 'components/Button'
import TextLink from 'components/TextLink'
import AddEditQuestion from './scenes/AddEditQuestion'

export class CodingScheme extends Component {
  constructor(props, context) {
    super(props, context)
  }

  componentWillMount() {
    this.props.actions.getSchemeRequest(this.props.projectId)
  }

  handleQuestionTreeChange = questions => {
    this.props.actions.updateQuestionTree(questions)
    this.props.actions.reorderSchemeRequest(this.props.projectId)
  }

  renderGetStarted = () => {
    return (
      <Container column flex alignItems="center" style={{ justifyContent: 'center' }}>
        <Typography type="display1" style={{ marginBottom: '20px' }}>The coding scheme is empty. To get started, add a question.</Typography>
        <TextLink to={`/project/${this.props.projectId}/coding-scheme/add`}>
          <Button value="+ Add New Question" color="accent" />
        </TextLink>
      </Container>
    )
  }

  render() {
    return (
      <Container column flex>
        <Header projectName={this.props.projectName} showButton={this.props.questions.length > 0}
                projectId={this.props.projectId} />
        <Container flex style={{ backgroundColor: '#f5f5f5', paddingTop: 25 }}>
          {this.props.questions.length > 0
            ? <Scheme
              questions={this.props.questions}
              handleQuestionTreeChange={this.handleQuestionTreeChange}
              handleHoverOnQuestion={this.props.actions.toggleHover}
              disableHover={this.props.actions.disableHover}
              enableHover={this.props.actions.enableHover}
            />
            : this.renderGetStarted()
          }
        </Container>
        <Footer />
        <Route
          path="/project/:id/coding-scheme/add"
          component={AddEditQuestion} />
      </Container>
    )
  }
}

CodingScheme.propTypes = {
  projectName: PropTypes.string,
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  questions: PropTypes.array,
  actions: PropTypes.object
}

const mapStateToProps = (state, ownProps) => ({
  projectName: state.scenes.home.main.projects.byId[ownProps.match.params.id].name,
  projectId: ownProps.match.params.id,
  questions: state.scenes.codingScheme.questions || []
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(CodingScheme)