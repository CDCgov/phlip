import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from './actions'
import Container from 'components/Layout'
import Header from './components/Header'
import Footer from './components/Footer'
import Scheme from './components/Scheme'

export class CodingScheme extends Component {
  constructor (props, context) {
    super(props, context)
  }

  componentWillMount() {
    this.props.actions.getSchemeRequest(this.props.projectId)
  }

  render () {
    return (
      <Container column flex>
        <Header projectName={this.props.projectName} />
        <Container flex style={{ backgroundColor: '#f5f5f5', paddingTop: 25 }}>
          <Scheme questions={this.props.questions} handleQuestionTreeChange={this.props.actions.updateQuestionTree} />
        </Container>
        <Footer />
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