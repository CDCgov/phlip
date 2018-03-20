import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Header from './Header'
import QuestionCard from './QuestionCard'
import FooterNavigate from './FooterNavigate'
import Navigator from './Navigator'
import Container, { Row, Column } from 'components/Layout'
import Typography from 'material-ui/Typography'
import TextLink from 'components/TextLink'
import Icon from 'components/Icon'
import Button from 'components/Button'
import { withStyles } from 'material-ui/styles'
import classNames from 'classnames'
import { default as MuiButton } from 'material-ui/Button'
import HeaderedLayout from 'components/HeaderedLayout'
import Alert from 'components/Alert'
import Tooltip from 'components/Tooltip'
import { capitalizeFirstLetter } from 'utils/formHelpers'

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

const styles = theme => bodyStyles(theme)

const withCodingValidation = (WrappedComponent, actions) => {
  class CodingValidation extends WrappedComponent {
    constructor(context, props) {
      super(context, props)

      console.log(this.props)

      this.state = {
        selectedJurisdiction: this.props.jurisdictionId,
        showViews: false,
        navOpen: true,
        applyAllAlertOpen: false
      }

      this.modalActions = [
        {
          value: 'Cancel',
          type: 'button',
          onClick: this.onCloseApplyAllAlert
        },
        {
          value: 'Continue',
          type: 'button',
          onClick: this.onApplyToAll
        }
      ]
    }

    componentWillUnmount() {
      this.props.actions.onCloseScreen()
    }

    onToggleNavigator = () => {
      this.setState({ navOpen: !this.state.navOpen })
    }

    getNextQuestion = index => {
      this.props.actions.getNextQuestion(this.props.questionOrder[index], index, this.props.projectId, this.props.jurisdictionId)
    }

    getPrevQuestion = index => {
      this.props.actions.getPrevQuestion(this.props.questionOrder[index], index, this.props.projectId, this.props.jurisdictionId)
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

    onOpenApplyAllAlert = () => {
      this.setState({
        applyAllAlertOpen: true
      })
    }

    onCloseApplyAllAlert = () => {
      this.setState({
        applyAllAlertOpen: false
      })
    }

    onApplyToAll = () => {
      this.onCloseApplyAllAlert()
      this.props.actions.applyAnswerToAll(this.props.projectId, this.props.jurisdictionId, this.props.question.id)
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
        <Container
          column
          flex
          alignItems="center"
          style={{ justifyContent: 'center', padding: 30, textAlign: 'center' }}>
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
          question={this.props.question}
          onChange={this.onAnswer}
          userAnswers={this.props.question.isCategoryQuestion
            ? this.props.userAnswers[this.props.selectedCategoryId]
            : this.props.userAnswers}
          onChangeTextAnswer={this.onChangeTextAnswer}
          categories={this.props.categories}
          selectedCategory={this.props.selectedCategory}
          onChangeCategory={(event, selection) => this.props.actions.onChangeCategory(selection)}
          isValidation={this.props.isValidation}
          mergedUserQuestions={this.props.mergedUserQuestions}
          onClearAnswer={() => this.props.actions.onClearAnswer(this.props.projectId, this.props.jurisdictionId, this.props.question.id)}
          onOpenAlert={this.onOpenApplyAllAlert}
          onSaveFlag={this.onSaveFlag}
          onOpenFlagConfirmAlert={this.onOpenFlagConfirmAlert}
          selectedCategoryId={this.props.selectedCategoryId}
          user={this.props.user} />
        <FooterNavigate
          currentIndex={this.props.currentIndex}
          getNextQuestion={this.getNextQuestion}
          getPrevQuestion={this.getPrevQuestion}
          totalLength={this.props.questionOrder.length}
          showNextButton={this.props.showNextButton} />
      </Fragment>
    )

    render() {
      return (
        <Container
          flex style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexWrap: 'nowrap' }}>
          {super.render()}
          <Alert
            open={this.state.applyAllAlertOpen}
            text="You are applying your answer to ALL categories. Previously answered questions will be changed."
            actions={this.modalActions} />
          <Navigator
            open={this.state.navOpen}
            scheme={this.props.scheme}
            allUserAnswers={this.props.allUserAnswers}
            currentQuestion={this.props.question}
            selectedCategory={this.props.selectedCategory}
            handleQuestionSelected={(item) => this.props.actions.onQuestionSelectedInNav(item, this.props.projectId, this.props.jurisdictionId)} />
          <HeaderedLayout
            padding={false}
            className={classNames(this.props.classes.mainContent, { [this.props.classes.openNavShift]: this.state.navOpen })}>
            <Column flex displayFlex style={{ width: '100%', flexWrap: 'nowrap' }}>
              <Header
                projectName={this.props.projectName}
                projectId={this.props.projectId}
                jurisdictionsList={this.props.jurisdictionsList}
                selectedJurisdiction={this.state.selectedJurisdiction}
                onJurisdictionChange={this.onJurisdictionChange}
                pageTitle={capitalizeFirstLetter(this.props.page)}
                currentJurisdiction={this.props.jurisdiction}
                empty={this.props.jurisdiction === null || this.props.questionOrder === null ||
                this.props.questionOrder.length === 0} />
              <Container flex style={{ backgroundColor: '#f5f5f5' }}>
                <Row displayFlex flex style={{ overflow: 'auto' }}>
                  <Column>
                    {this.state.showViews &&
                    (this.props.jurisdiction !== null && this.props.questionOrder.length !== 0) &&
                    <Tooltip
                      placement="right"
                      text="Toggle Navigator"
                      id="toggle-navigator"
                      aria-label="Toggle Navigator">
                      <MuiButton style={navButtonStyles} aria-label="Toggle Navigator" onClick={this.onToggleNavigator}>
                        <Icon color="white" style={iconStyle}>menu</Icon></MuiButton></Tooltip>}
                  </Column>
                  <Column displayFlex flex style={{ padding: '1px 27px 10px 27px', overflow: 'auto' }}>
                    {this.state.showViews && (this.props.jurisdiction === null || this.props.questionOrder.length === 0
                      ? this.onShowGetStartedView(this.props.questionOrder.length === 0, this.props.jurisdiction ===
                        null)
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

  const mapStateToProps = (state, ownProps) => {
    const project = state.scenes.home.main.projects.byId[ownProps.match.params.id]
    const page = ownProps.match.url.split('/')[3] === 'code' ? 'coding' : 'validation'
    const pageState = state.scenes[page]

    return {
      projectName: project.name,
      page,
      isValidation: page === 'validation',
      projectId: ownProps.match.params.id,
      question: pageState.question || {},
      currentIndex: pageState.currentIndex || 0,
      questionOrder: pageState.scheme === null ? null : pageState.scheme.order,
      categories: state.scenes[page].categories || undefined,
      selectedCategory: state.scenes[page].selectedCategory || 0,
      userAnswers: state.scenes[page].userAnswers[state.scenes[page].question.id] || {},
      showNextButton: state.scenes[page].showNextButton,
      jurisdictionsList: project.projectJurisdictions || [],
      jurisdictionId: state.scenes[page].jurisdictionId || (project.projectJurisdictions.length > 0
        ? project.projectJurisdictions[0].id
        : null),
      jurisdiction: state.scenes[page].jurisdiction || (project.projectJurisdictions.length > 0
        ? project.projectJurisdictions[0]
        : null),
      isSchemeEmpty: state.scenes[page].scheme === null ? null : state.scenes[page].scheme.order.length === 0,
      userRole: state.data.user.currentUser.role,
      user: state.data.user.currentUser,
      scheme: state.scenes[page].scheme === null ? {} : state.scenes[page].scheme,
      allUserAnswers: state.scenes[page].userAnswers || {},
      selectedCategoryId: state.scenes[page].selectedCategoryId || null,
      mergedUserQuestions: pageState.mergedUserQuestions
        ? pageState.question.isCategoryQuestion
          ? pageState.mergedUserQuestions[pageState.question.id][pageState.selectedCategoryId]
          : pageState.mergedUserQuestions[pageState.question.id]
        : null
    }
  }

  const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })
  return connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CodingValidation))
}

export const bodyStyles = theme => ({
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

export default withCodingValidation