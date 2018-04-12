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
import ApiErrorView from 'components/ApiErrorView'
import ApiErrorAlert from 'components/ApiErrorAlert'
import PageLoader from 'components/PageLoader'

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

export const withCodingValidation = (WrappedComponent, actions) => {
  class CodingValidation extends WrappedComponent {

    static propTypes = {
      projectName: PropTypes.string,
      page: PropTypes.string,
      isValidation: PropTypes.bool,
      projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      question: PropTypes.object,
      currentIndex: PropTypes.number,
      questionOrder: PropTypes.array,
      showNextButton: PropTypes.bool,
      jurisdictionsList: PropTypes.array,
      jurisdictionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      jurisdiction: PropTypes.object,
      isSchemeEmpty: PropTypes.bool,
      areJurisdictionsEmpty: PropTypes.bool,
      userRole: PropTypes.string,
      user: PropTypes.object,
      selectedCategory: PropTypes.number,
      schemeError: PropTypes.string,
      updateAnswerError: PropTypes.string,
      answerErrorContent: PropTypes.any,
      saveFlagErrorContent: PropTypes.string,
      getQuestionErrors: PropTypes.string,
      isLoadingPage: PropTypes.bool,
      pageLoadingMessage: PropTypes.string,
      showPageLoader: PropTypes.bool,
      actions: PropTypes.object
    }

    constructor(context, props) {
      super(context, props)

      this.state = {
        selectedJurisdiction: this.props.jurisdictionId,
        showViews: false,
        navOpen: false,
        applyAllAlertOpen: false,
        showSchemeError: false
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

    componentWillReceiveProps(nextProps) {
      if (this.props.isSchemeEmpty === null) {
        if (nextProps.isSchemeEmpty !== null) {
          this.setState({ showViews: true })
        }
        if (nextProps.schemeError !== null) {
          this.setState({ showSchemeError: true })
        }
        if (nextProps.isSchemeEmpty === false && nextProps.areJurisdictionsEmpty === false) {
          this.setState({ navOpen: true })
        }
      }
    }

    componentWillUnmount() {
      this.props.actions.onCloseScreen()
    }

    onToggleNavigator = () => {
      this.setState({ navOpen: !this.state.navOpen })
    }

    getNextQuestion = index => {
      this.props.actions.getNextQuestion(this.props.questionOrder[index], index, this.props.projectId, this.props.jurisdictionId)
      this.onShowQuestionLoader()
    }

    getPrevQuestion = index => {
      this.props.actions.getPrevQuestion(this.props.questionOrder[index], index, this.props.projectId, this.props.jurisdictionId)
      this.onShowQuestionLoader()
    }

    onQuestionSelectedInNav = item => {
      this.props.actions.onQuestionSelectedInNav(item, this.props.projectId, this.props.jurisdictionId)
      this.onShowQuestionLoader()
    }

    onShowQuestionLoader = () => {
      setTimeout(() => {
        if (this.props.isChangingQuestion) {
          this.props.actions.showQuestionLoader()
        }
      }, 1000)
    }

    onAnswer = id => (event, value) => {
      this.props.actions.answerQuestionRequest(
        this.props.projectId, this.props.jurisdictionId, this.props.question.id, id, value
      )
    }

    onSave = () => {

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
    }

    onOpenApplyAllAlert = () => {
      this.setState({ applyAllAlertOpen: true })
    }

    onCloseAlert = () => {
      this.props.actions.clearAnswerError()
    }

    onCloseApplyAllAlert = () => {
      this.setState({ applyAllAlertOpen: false })
    }

    onApplyToAll = () => {
      this.onCloseApplyAllAlert()
      this.props.actions.applyAnswerToAll(this.props.projectId, this.props.jurisdictionId, this.props.question.id)
    }

    onShowGetStartedView = (noScheme, noJurisdictions) => {
      let startedText = ''
      if (this.props.isValidation) {
        if (noScheme && !noJurisdictions) {
          startedText = 'This project doesn\'t have a coding scheme.'
        } else if (!noScheme && noJurisdictions) {
          startedText = 'This project doesn\'t have jurisdictions.'
        } else {
          startedText = 'This project doesn\'t have a coding scheme or jurisdictions.'
        }
      } else {
        if (this.props.userRole === 'Coder') {
          startedText = 'The coordinator for this project has not created a coding scheme or added jurisdictions.'
        } else if (noScheme && !noJurisdictions) {
          startedText = 'You must add questions to the project coding scheme before coding.'
        } else if (!noScheme && noJurisdictions) {
          startedText = 'You must add jurisdictions to the project before coding.'
        } else {
          startedText = 'You must add jurisdictions and questions to the project coding scheme before coding.'
        }
      }

      return (
        <Container
          column
          flex
          alignItems="center"
          style={{ justifyContent: 'center', padding: 30, textAlign: 'center' }}>
          <Typography type="display1" style={{ marginBottom: '20px' }}>{startedText}</Typography>
          <Row displayFlex style={{ width: '100%', justifyContent: 'space-evenly' }}>
            {noScheme && this.props.userRole !== 'Coder' &&
            <TextLink to={{ pathname: `/project/${this.props.projectId}/coding-scheme` }}>
              <Button value="Create Coding Scheme" color="accent" />
            </TextLink>}
            {noJurisdictions && this.props.userRole !== 'Coder' &&
            <TextLink to={{ pathname: `/project/${this.props.projectId}/jurisdictions` }}>
              <Button value="Add Jurisdictions" color="accent" />
            </TextLink>}
          </Row>
        </Container>
      )
    }

    onShowCodeView = () => {
      return (
        <Fragment>
          <QuestionCard
            page={this.props.page}
            onChange={this.onAnswer}
            onChangeTextAnswer={this.onChangeTextAnswer}
            onChangeCategory={(event, selection) => this.props.actions.onChangeCategory(selection)}
            onClearAnswer={() => this.props.actions.onClearAnswer(this.props.projectId, this.props.jurisdictionId, this.props.question.id)}
            onOpenAlert={this.onOpenApplyAllAlert}
            onSaveFlag={this.onSaveFlag}
            onOpenFlagConfirmAlert={this.onOpenFlagConfirmAlert}
          />
          <FooterNavigate
            currentIndex={this.props.currentIndex}
            getNextQuestion={this.getNextQuestion}
            getPrevQuestion={this.getPrevQuestion}
            totalLength={this.props.questionOrder.length}
            showNextButton={this.props.showNextButton}
          />
        </Fragment>
      )
    }

    render() {
      return (
        <Container
          flex style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexWrap: 'nowrap' }}>
          <Alert
            open={this.state.applyAllAlertOpen}
            text=""
            actions={this.modalActions}>
            <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
              You are applying your answer to ALL categories. Previously answered questions will be changed.
            </Typography>
          </Alert>
          <ApiErrorAlert
            open={this.props.updateAnswerError !== null}
            content={this.props.answerErrorContent}
            onCloseAlert={this.onCloseAlert} />
          <ApiErrorAlert
            open={this.props.getQuestionErrors !== null}
            content={this.props.getQuestionErrors}
            onCloseAlert={() => this.props.actions.dismissApiAlert('getQuestionErrors')} />
          {!this.props.showPageLoader &&
          <Navigator
            open={this.state.navOpen}
            page={this.props.page}
            selectedCategory={this.props.selectedCategory}
            handleQuestionSelected={this.onQuestionSelectedInNav}
          />}
          <HeaderedLayout
            padding={false}
            className={
              classNames(this.props.classes.mainContent, {
                [this.props.classes.openNavShift]: this.state.navOpen && !this.props.showPageLoader,
                [this.props.classes.pageLoading]: this.props.showPageLoader
              })}>
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
                  {!this.props.showPageLoader && <Column>
                    {this.state.showViews &&
                    (this.props.jurisdiction !== null && this.props.questionOrder.length !== 0) &&
                    <Tooltip
                      placement="right"
                      text="Toggle Navigator"
                      id="toggle-navigator"
                      aria-label="Toggle Navigator">
                      <MuiButton style={navButtonStyles} aria-label="Toggle Navigator" onClick={this.onToggleNavigator}>
                        <Icon color="white" style={iconStyle}>menu</Icon></MuiButton></Tooltip>}
                  </Column>}
                  <Column displayFlex flex style={{ padding: '1px 27px 10px 27px', overflow: 'auto' }}>
                    {this.state.showSchemeError &&
                    <ApiErrorView error="We couldn't get the coding scheme for this project." />}
                    {this.props.showPageLoader === true
                      ? <PageLoader
                        message={this.props.pageLoaderMessage}
                        circularLoaderProps={{ color: 'primary', size: 50 }} />
                      : this.state.showViews &&
                      (this.props.areJurisdictionsEmpty === true || this.props.isSchemeEmpty === true
                        ? this.onShowGetStartedView(this.props.isSchemeEmpty, this.props.areJurisdictionsEmpty)
                        : this.onShowCodeView())}
                  </Column>
                </Row>
              </Container>
            </Column>
          </HeaderedLayout>
          {super.render()}
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
      question: pageState.scheme === null ? {} : pageState.scheme.byId[pageState.scheme.order[pageState.currentIndex]],
      currentIndex: pageState.currentIndex || 0,
      questionOrder: pageState.scheme === null ? null : pageState.scheme.order,
      showNextButton: pageState.showNextButton,
      jurisdictionsList: project.projectJurisdictions || [],
      jurisdictionId: pageState.jurisdictionId || (project.projectJurisdictions.length > 0
        ? project.projectJurisdictions[0].id
        : null),
      jurisdiction: pageState.jurisdiction || (project.projectJurisdictions.length > 0
        ? project.projectJurisdictions[0]
        : null),
      isSchemeEmpty: pageState.isSchemeEmpty,
      areJurisdictionsEmpty: pageState.areJurisdictionsEmpty,
      userRole: state.data.user.currentUser.role,
      user: state.data.user.currentUser,
      selectedCategory: pageState.selectedCategory,
      schemeError: pageState.schemeError || null,
      updateAnswerError: pageState.updateAnswerError || null,
      answerErrorContent: pageState.errorTypeMsg || '',
      saveFlagErrorContent: pageState.saveFlagErrorContent || null,
      getQuestionErrors: pageState.getQuestionErrors || null,
      isLoadingPage: pageState.isLoadingPage || false,
      pageLoaderMessage: pageState.pageLoaderMessage,
      showPageLoader: pageState.showPageLoader || false,
      isChangingQuestion: pageState.isChangingQuestion || false
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
  },
  pageLoading: {
    marginLeft: 0
  }
})

withCodingValidation.propTypes = {
  WrappedComponent: PropTypes.component,
  actions: PropTypes.object
}

export default withCodingValidation