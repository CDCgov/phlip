import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Header from './components/Header'
import Footer from './components/Footer'
import Container from 'components/Layout'

export class Coding extends Component {
  constructor(props, context) {
    super(props, context)
  }

  componentWillMount() {

  }

  render() {
    return (
      <Container column flex>
        <Header projectName={this.props.projectName} projectId={this.props.projectId} />
        <Container flex style={{ backgroundColor: '#f5f5f5', paddingTop: 25 }}>
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
  projectId: ownProps.match.params.id
})

export default connect(mapStateToProps)(Coding)