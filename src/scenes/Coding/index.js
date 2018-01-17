import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Typography from 'material-ui/Typography'
import Container, { Row, Column } from 'components/Layout'
import IconButton from 'components/IconButton'
import Header from './components/Header'
import Footer from './components/Footer'
import QuestionCard from './components/QuestionCard'
import * as actions from './actions'

export class Coding extends Component {
  constructor(props, context) {
    super(props, context)
  }

  componentWillMount() {
    this.props.actions.getCodingOutlineRequest(this.props.projectId, '1')
  }

  render() {
    return (
      <Container column flex>
        <Header projectName={this.props.projectName} projectId={this.props.projectId} />
        <Container flex column style={{ backgroundColor: '#f5f5f5', padding: '20px 20px 10px 20px' }}>
          <Row flex displayFlex>
            <QuestionCard question={this.props.question} />
          </Row>
          <Row displayFlex style={{ height: 50, alignItems: 'center', paddingTop: 10, justifyContent: 'space-between' }}>
            <Row displayFlex>
              <IconButton color="black">arrow_back</IconButton>
              <Typography type="body2"><span style={{ color: '#0faee6', fontSize: 16, paddingLeft: 5 }}>Previous question</span></Typography>
            </Row>
            <Row displayFlex>
              <Typography type="body2"><span style={{ color: '#0faee6', fontSize: 16, paddingRight: 5 }}>Next question</span></Typography>
              <IconButton color="black">arrow_forward</IconButton>
            </Row>
          </Row>
        </Container>
        <Footer />
      </Container>
    )
  }
}

Coding.propTypes = {

}

const mapStateToProps = (state, ownProps) => ({
  projectName: state.scenes.home.main.projects.byId[ownProps.match.params.id].name,
  projectId: ownProps.match.params.id,
  question: state.scenes.coding.question || {},
  outline: state.scenes.coding.outline || {}
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(Coding)