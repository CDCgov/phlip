import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Divider from '@material-ui/core/Divider'
import Card from 'components/Card/index'
import { Row, Column } from 'components/Layout'
import IconButton from 'components/IconButton'
import QuestionContent from './components/QuestionContent'
import Tabs from 'components/Tabs'
import { Broom } from 'mdi-material-ui'
import styles from './card-styles.scss'
import * as questionTypes from '../constants'
import FlagPopover from './components/FlagPopover'
import { connect } from 'react-redux'
import { getInitials } from 'utils/normalize'
import Alert from 'components/Alert'
import Typography from '@material-ui/core/Typography'
import PageLoader from 'components/PageLoader'
import FooterNavigate from './components/FooterNavigate'

const TabContainer = props => {
  return (
    <Tabs tabs={props.tabs} selectedTab={props.selected} onChangeTab={props.onChangeCategory}>
      {props.children}
    </Tabs>
  )
}

export class QuestionCard extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      categoryToUncheck: {},
      confirmCategoryUncheckOpen: false,
      isSaving: false,
      clearAnswerAlertOpen: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.unsavedChanges === true) {
      this.setState({
        isSaving: true
      })
      clearTimeout()
    }

    if (this.props.unsavedChanges === true && nextProps.unsavedChanges === false) {
      setTimeout(() => {
        this.setState({
          isSaving: false
        })
      }, 600)
    }
  }

  // Need to check if the user is un-checking a category
  onChangeAnswer = id => (event, value) => {
    if (this.props.question.questionType === questionTypes.CATEGORY) {
      if (this.props.userAnswers.answers.hasOwnProperty(id)) {
        this.setState({
          confirmCategoryUncheckOpen: true,
          categoryToUncheck: { id, event, value }
        })
      } else {
        this.props.onChange(id)(event, value)
      }
    } else {
      this.props.onChange(id)(event, value)
    }
  }

  onCancel = () => {
    this.setState({
      confirmCategoryUncheckOpen: false,
      categoryToUncheck: {},
      clearAnswerAlertOpen: false
    })
  }

  onContinue = () => {
    this.props.onChange(this.state.categoryToUncheck.id)(
      this.state.categoryToUncheck.event,
      this.state.categoryToUncheck.value)
    this.setState({
      confirmCategoryUncheckOpen: false,
      categoryToUncheck: {}
    })
  }

  getMargin = () => {
    return !this.props.isValidation
      ? this.props.question.questionType !== questionTypes.CATEGORY
        ? -70
        : -46
      : this.props.question.questionType !== questionTypes.CATEGORY
        ? -24
        : 0
  }

  onClearAnswer = () => {
    this.setState({
      clearAnswerAlertOpen: true
    })
  }

  render() {
    const questionContentProps = {
      onChange: this.onChangeAnswer,
      onChangeTextAnswer: this.props.onChangeTextAnswer,
      onOpenFlagConfirmAlert: this.props.onOpenFlagConfirmAlert,
      currentUserInitials: getInitials(this.props.user.firstName, this.props.user.lastName),
      user: this.props.user,
      question: this.props.question,
      onOpenAlert: this.props.onOpenAlert,
      userAnswers: { validatedBy: { ...this.props.user }, ...this.props.userAnswers },
      comment: this.props.userAnswers.comment,
      isValidation: this.props.isValidation,
      mergedUserQuestions: this.props.mergedUserQuestions,
      disableAll: this.props.disableAll,
      userImages: this.props.userImages
    }

    const alertActions = [
      {
        value: 'Cancel',
        type: 'button',
        onClick: this.onCancel
      },
      {
        value: 'Continue',
        type: 'button',
        onClick: this.onContinue
      }
    ]

    const clearAnswerActions = [
      {
        value: 'Cancel',
        type: 'button',
        onClick: this.onCancel
      },
      {
        value: 'Clear answer',
        type: 'button',
        onClick: () => {
          this.onCancel()
          this.props.onClearAnswer()
        }
      }
    ]

    return (
      <Row displayFlex style={{ flex: '1 0 50%' }}>
        <Alert actions={alertActions} open={this.state.confirmCategoryUncheckOpen}>
          <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
            Unselecting a category will remove any answers associated to this category. Do you wish to continue?
          </Typography>
        </Alert>
        <Alert actions={clearAnswerActions} open={this.state.clearAnswerAlertOpen}>
          <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
            Are you sure you want to clear your answer to this question?
          </Typography>
        </Alert>
        <Column component={<Card />} displayFlex flex style={{ width: '100%' }}>
          {this.props.questionChangeLoader === true
            ? <PageLoader circularLoaderProps={{ color: 'primary', size: 50 }} />
            : <Fragment>
              <Row displayFlex style={{ alignItems: 'center', height: 42, paddingRight: 15 }}>
                <Row style={{ width: '100%' }}>
                  {this.props.hasTouchedQuestion &&
                  <Typography variant="caption" style={{ paddingLeft: 10, textAlign: 'center', color: '#757575' }}>
                    {this.props.saveFailed ? 'Save failed!' : this.state.isSaving ? 'Saving...' : 'All changes saved'}
                  </Typography>}
                </Row>
                <Row displayFlex style={{ marginLeft: this.getMargin() }}>
                  {this.props.question.questionType !== questionTypes.CATEGORY &&
                  <IconButton
                    onClick={this.onClearAnswer}
                    aria-label="Clear answer"
                    tooltipText="Clear answer"
                    id="clear-answer"
                    style={{ height: 24 }}>
                    {!this.props.disableAll && <Broom className={styles.icon} aria-labelledby="Clear answer" />}
                  </IconButton>}
                  {!this.props.isValidation && <FlagPopover
                    userFlag={this.props.userAnswers.flag}
                    onSaveFlag={this.props.onSaveFlag}
                    questionFlags={this.props.question.flags}
                    user={this.props.user}
                    disableAll={this.props.disableAll} />}
                </Row>
              </Row>
              <Divider />
              {this.props.categories !== undefined
                ? <TabContainer
                  tabs={this.props.categories}
                  selected={this.props.selectedCategory}
                  onChangeCategory={this.props.onChangeCategory}>
                  <QuestionContent {...questionContentProps} />
                </TabContainer>
                : <QuestionContent{...questionContentProps} />}
              <Divider />
              <FooterNavigate
                currentIndex={this.props.currentIndex}
                getNextQuestion={this.props.getNextQuestion}
                getPrevQuestion={this.props.getPrevQuestion}
                totalLength={this.props.totalLength}
                showNextButton={this.props.showNextButton}
              />
            </Fragment>}
        </Column>
      </Row>
    )
  }
}

QuestionCard.propTypes = {
  question: PropTypes.object,
  userAnswer: PropTypes.any,
  onChange: PropTypes.func
}

const mapStateToProps = (state, ownProps) => {
  const pageState = state.scenes[ownProps.page]
  return {
    isValidation: ownProps.page === 'validation',
    user: state.data.user.currentUser || {},
    question: pageState.scheme === null ? {} : pageState.scheme.byId[pageState.scheme.order[pageState.currentIndex]],
    categories: pageState.categories || undefined,
    selectedCategory: pageState.selectedCategory || 0,
    userAnswers: pageState.userAnswers
      ? pageState.question.isCategoryQuestion
        ? pageState.userAnswers[pageState.question.id][pageState.selectedCategoryId]
        : pageState.userAnswers[pageState.question.id]
      : {},
    selectedCategoryId: pageState.selectedCategoryId || null,
    mergedUserQuestions: pageState.mergedUserQuestions
      ? pageState.question.isCategoryQuestion
        ? pageState.mergedUserQuestions[pageState.question.id][pageState.selectedCategoryId]
        : pageState.mergedUserQuestions[pageState.question.id]
      : null,
    disableAll: pageState.codedQuestionsError !== null || false,
    userImages: pageState.userImages,
    questionChangeLoader: pageState.questionChangeLoader || false,
    isChangingQuestion: pageState.isChangingQuestion || false,
    unsavedChanges: pageState.unsavedChanges || false,
    saveFailed: pageState.saveFailed || false,
    hasTouchedQuestion: pageState.hasTouchedQuestion || false
  }
}

export default connect(mapStateToProps)(QuestionCard)

