import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Container, { Row } from 'components/Layout'
import { Coding } from '../Coding/index';
import * as actions from './actions'



export class Validation extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    return (
      <Container column flex>
      </Container>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  const project = state.scenes.home.main.projects.byId[ownProps.match.params.id]

  return {
    projectName: project.name
  }
}

const mapDispatchToProps = (dispatch) => ({ acitons: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(Validation)