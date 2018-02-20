import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Container from 'components/Layout'
import Header from './components/Header'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

export class Protocol extends Component {
  static propTypes = {
  }

  constructor(props, context) {
    super(props, context)
  }

  render() {
    return (
      <Container column flex>
        <Header projectName={this.props.projectName} projectId={this.props.projectId} />
      </Container>
    )
  }
}

Protocol.propTypes = {
  projectName: PropTypes.string,
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

const mapStateToProps = (state, ownProps) => ({
  projectName: state.scenes.home.main.projects.byId[ownProps.match.params.id].name,
  projectId: ownProps.match.params.id,
})

//const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps)(Protocol)