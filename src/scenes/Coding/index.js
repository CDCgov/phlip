import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Header from 'components/CodingValidation/Header'
import QuestionCard from 'components/CodingValidation/QuestionCard'
import FooterNavigate from 'components/CodingValidation/FooterNavigate'
import Container, { Row, Column } from 'components/Layout'
import Navigator from './components/Navigator'
import * as actions from './actions'
import Typography from 'material-ui/Typography'
import TextLink from 'components/TextLink'
import Icon from 'components/Icon'
import Button from 'components/Button'
import { withStyles } from 'material-ui/styles'
import classNames from 'classnames'
import { default as MuiButton } from 'material-ui/Button'
import HeaderedLayout from 'components/HeaderedLayout'

const navButtonStyles = {
  height: 90,
  width: 20,
  minWidth: 'unset',
  minHeight: 'unset',
  backgroundColor: '#a7bdc6',
  padding: 0,
  top: '35%',
  borderRadius: '0 5px 5px 0',
  boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
  color: 'white'
}

const iconStyle = {
  transform: 'rotate(90deg)'
}

const styles = theme => ({
  mainContent: {
    height: '100vh',
    width: '100%',
    flex: '1 !important',
    overflow: 'auto',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -330
  },
  openNavShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }
})

export class Coding extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      selectedJurisdiction: this.props.jurisdictionId,
      showViews: false,
      navOpen: false
    }
  }

  componentWillMount() {
    this.props.actions.getCodingOutlineRequest(this.props.projectId, this.props.jurisdictionId)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isSchemeEmpty !== null) {
      this.setState({ showViews: true })
    }
  }

  componentWillUnmount() {
    this.props.actions.onCloseCodeScreen()
  }

  onToggleNavigator = () => {
    this.setState({ navOpen: !this.state.navOpen })
  }

  getNextQuestion = index => {
    this.props.actions.getNextQuestion(this.props.questionOrder[index], index)
  }

  getPrevQuestion = index => {
    this.props.actions.getPrevQuestion(this.props.questionOrder[index], index)
  }

  onAnswer = id => (event, value) => {
    this.props.actions.answerQuestionRequest(
      this.props.projectId, this.props.jurisdictionId, this.props.question.id, id, value
    )
    this.props.actions.updateEditedFields(this.props.projectId)
  }

  onChangeTextAnswer = (id, field) => event => {
    switch (field) {
      case 'textAnswer':
        this.props.actions.answerQuestionRequest(
          this.props.projectId, this.props.jurisdictionId, this.props.question.id, id, event.target.value
        )
        break

      case 'comment':
        this.props.actions.onChangeComment(
          this.props.projectId, this.props.jurisdictionId, this.props.question.id, event.target.value
        )
        break

      case 'pincite':
        this.props.actions.onChangePincite(
          this.props.projectId, this.props.jurisdictionId, this.props.question.id, id, event.target.value
        )
    }
    this.props.actions.updateEditedFields(this.props.projectId)
  }

  onJurisdictionChange = (event) => {
    this.setState({ selectedJurisdiction: event.target.value })
    this.props.actions.onJurisdictionChange(event.target.value, this.props.jurisdictionsList)
    this.props.actions.getUserCodedQuestions(this.props.projectId, event.target.value)
  }

  onShowGetStartedView = (noScheme, noJurisdictions) => {
    let startedText = ''
    if (this.props.userRole === 'Coder') {
      startedText = 'The coordinator for this project has not created a coding scheme or added jurisdictions.'
    } else if (noScheme && !noJurisdictions) {
      startedText = 'You must add questions to the project coding scheme before coding.'
    } else if (!noScheme && noJurisdictions) {
      startedText = 'You must add jurisdictions to the project before coding.'
    } else {
      startedText = 'You must add jurisdictions and questions to the project coding scheme before coding.'
    }

    return (
      <Container column flex alignItems="center" style={{ justifyContent: 'center', padding: 30, textAlign: 'center' }}>
        <Typography type="display1" style={{ marginBottom: '20px' }}>{startedText}</Typography>
        <Row>
          {noScheme && this.props.userRole !== 'Coder' &&
          <TextLink to={{ pathname: `/project/${this.props.projectId}/coding-scheme/` }}>
            <Button value="Create Coding Scheme" color="accent" />
          </TextLink>}
          {noJurisdictions && this.props.userRole !== 'Coder' &&
          <TextLink to={{ pathname: `/project/${this.props.projectId}/jurisdictions/` }}>
            <Button value="Add Jurisdictions" color="accent" style={{ marginLeft: 50 }} />
          </TextLink>}
        </Row>
      </Container>
    )
  }

  onShowCodeView = () => (
    <Fragment>
      <QuestionCard
        question={this.props.question} onChange={this.onAnswer}
        userAnswers={this.props.userAnswers}
        onChangeTextAnswer={this.onChangeTextAnswer} categories={this.props.categories}
        selectedCategory={this.props.selectedCategory}
        onChangeCategory={this.props.actions.onChangeCategory}
        mergedUserQuestions={null}
        onClearAnswer={() => this.props.actions.onClearAnswer(this.props.projectId, this.props.jurisdictionId, this.props.question.id)}
      />
      <FooterNavigate
        currentIndex={this.props.currentIndex} getNextQuestion={this.getNextQuestion}
        getPrevQuestion={this.getPrevQuestion}
        totalLength={this.props.questionOrder.length} showNextButton={this.props.showNextButton}
      />
    </Fragment>
  )

  render() {
    return (
      <Container
        flex
        style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexWrap: 'nowrap' }}
      >
        <Navigator
          open={this.state.navOpen}
          scheme={this.props.scheme}
          allUserAnswers={this.props.allUserAnswers}
          currentQuestion={this.props.question}
          selectedCategory={this.props.selectedCategory}
          handleQuestionSelected={this.props.actions.onQuestionSelectedInNav}
        />
        <HeaderedLayout
          padding={false}
          className={classNames(this.props.classes.mainContent, { [this.props.classes.openNavShift]: this.state.navOpen })}
        >
          <Column flex displayFlex>
            <Header
              projectName={this.props.projectName} projectId={this.props.projectId}
              jurisdictionsList={this.props.jurisdictionsList}
              selectedJurisdiction={this.state.selectedJurisdiction}
              onJurisdictionChange={this.onJurisdictionChange}
              currentJurisdiction={this.props.jurisdiction}
              empty={this.props.jurisdiction === null || this.props.questionOrder === null ||
              this.props.questionOrder.length === 0}
            />
            <Container flex style={{ backgroundColor: '#f5f5f5' }}>
              <Row displayFlex flex style={{ overflow: 'auto' }}>
                <Column>
                  {this.state.showViews &&
                  (this.props.jurisdiction !== null && this.props.questionOrder.length !== 0) &&
                  <MuiButton style={navButtonStyles} onClick={this.onToggleNavigator}>
                    <Icon color="white" style={iconStyle}>menu</Icon></MuiButton>}
                </Column>
                <Column displayFlex flex style={{ padding: '1px 27px 10px 27px', overflow: 'auto' }}>
                  {this.state.showViews && (this.props.jurisdiction === null || this.props.questionOrder.length === 0
                    ? this.onShowGetStartedView(this.props.questionOrder.length === 0, this.props.jurisdiction === null)
                    : this.onShowCodeView())}
                </Column>
              </Row>
            </Container>
          </Column>
        </HeaderedLayout>
      </Container>
    )
  }
}

Coding.propTypes = {
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
    question: state.scenes.coding.question || {},
    currentIndex: state.scenes.coding.currentIndex || 0,
    questionOrder: state.scenes.coding.scheme === null ? null : state.scenes.coding.scheme.order,
    categories: state.scenes.coding.categories || undefined,
    selectedCategory: state.scenes.coding.selectedCategory || 0,
    userAnswers: state.scenes.coding.userAnswers[state.scenes.coding.question.id] || {},
    showNextButton: state.scenes.coding.showNextButton,
    jurisdictionsList: project.projectJurisdictions || [],
    jurisdictionId: state.scenes.coding.jurisdictionId || (project.projectJurisdictions.length > 0
      ? project.projectJurisdictions[0].id
      : null),
    jurisdiction: state.scenes.coding.jurisdiction || (project.projectJurisdictions.length > 0
      ? project.projectJurisdictions[0]
      : null),
    isSchemeEmpty: state.scenes.coding.scheme === null ? null : state.scenes.coding.scheme.order.length === 0,
    userRole: state.data.user.currentUser.role,
    scheme: state.scenes.coding.scheme === null ? {} : state.scenes.coding.scheme,
    allUserAnswers: state.scenes.coding.userAnswers || {}
  }
}

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Coding))