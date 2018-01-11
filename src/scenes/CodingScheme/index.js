import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from './actions'
import Container from 'components/Layout'
import Header from './components/Header'
import Footer from './components/Footer'
import Scheme from './components/Scheme'
import { Route } from 'react-router-dom'
import AddEditQuestion from './scenes/AddEditQuestion'

export class CodingScheme extends Component {
  constructor(props, context) {
    super(props, context)
  }

  componentWillMount() {
    this.props.actions.getSchemeRequest(this.props.projectId)
  }

  render() {
    return (
      <Container column flex>
        <Header projectName={this.props.projectName} projectId={this.props.projectId} />
        <Container flex style={{ backgroundColor: '#f5f5f5', paddingTop: 25 }}>
          <Scheme
            questions={this.props.questions}
            handleQuestionTreeChange={this.props.actions.updateQuestionTree}
            handleHoverOnQuestion={this.props.actions.toggleHover}
            disableHover={this.props.actions.disableHover}
            enableHover={this.props.actions.enableHover}
          />
        </Container>
        <Footer />
        <Route
          path="/project/:id/coding-scheme/add"
          component={AddEditQuestion} />
      </Container>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  projectName: state.scenes.home.main.projects.byId[ownProps.match.params.id].name,
  projectId: ownProps.match.params.id,
  questions: state.scenes.codingScheme.questions || []
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(CodingScheme)