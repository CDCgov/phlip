import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from './actions'
import Header from './components/Header'
import Footer from './components/Footer'
import Container from 'components/Layout'

export class CodingScheme extends Component {
  constructor (props, context) {
    super(props, context)
  }

  render () {
    return (
      <Container column flex>
        <Header projectName={this.props.projectName} />
        <Container flex style={{ backgroundColor: '#f5f5f5' }}>
        </Container>
        <Footer />
      </Container>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  projectName: state.scenes.home.main.projects.byId[ownProps.match.params.id].name,
  projectId: ownProps.match.params.id,
  questions: state.scenes.codingScheme.questions
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(CodingScheme)