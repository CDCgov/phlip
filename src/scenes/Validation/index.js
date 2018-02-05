import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Container, { Row } from 'components/Layout'
import { Coding } from '../Coding/index';
import * as actions from './actions'
import Header from 'components/CodingValidation/Header'
import Footer from 'components/CodingValidation/Footer'


export class Validation extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      selectedJurisdiction: this.props.jurisdictionId,
    }
  }

  componentWillMount() {
    this.props.actions.getValidationOutlineRequest(this.props.projectId, this.props.jurisdictionId)
  }

  render() {
    return (
      <Container column flex>
        <Header projectName={this.props.projectName} projectId={this.props.projectId}
          jurisdictionsList={this.props.jurisdictionsList}
          selectedJurisdiction={this.state.selectedJurisdiction}
          currentJurisdiction={this.props.jurisdiction}
          isValidation={true}
        // empty={this.props.jurisdiction === null || this.props.questionOrder === null || this.props.questionOrder.length === 0}
        />
        <Container></Container>
        <Footer></Footer>
      </Container>
    )
  }
}

Validation.propTypes = {
  projectName: PropTypes.string,
  projectId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  question: PropTypes.object,
  currentIndex: PropTypes.number,
  questionOrder: PropTypes.array,
  actions: PropTypes.object,
  categories: PropTypes.array
}


const mapStateToProps = (state, ownProps) => {
  const project = state.scenes.home.main.projects.byId[ownProps.match.params.id]

  return {
    projectName: project.name,
    projectId: ownProps.match.params.id,
    question: state.scenes.validation.question || {},
    currentIndex: state.scenes.validation.currentIndex || 0,
    questionOrder: state.scenes.validation.scheme === null ? null : state.scenes.validation.scheme.order,
    categories: state.scenes.validation.categories || undefined,
    selectedCategory: state.scenes.validation.selectedCategory || 0,
    userAnswers: state.scenes.validation.userAnswers[state.scenes.validation.question.id] || {},
    showNextButton: state.scenes.validation.showNextButton,
    jurisdictionsList: project.projectJurisdictions || [],
    jurisdictionId: state.scenes.validation.jurisdictionId || (project.projectJurisdictions.length > 0
      ? project.projectJurisdictions[0].id
      : null),
    jurisdiction: state.scenes.validation.jurisdiction || (project.projectJurisdictions.length > 0
      ? project.projectJurisdictions[0]
      : null),
    isSchemeEmpty: state.scenes.validation.scheme === null ? null : state.scenes.validation.scheme.order.length === 0,
    userRole: state.data.user.currentUser.role
  }
}

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(Validation)