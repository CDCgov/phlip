import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Broom } from 'mdi-material-ui'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import { getInitials } from 'utils/normalize'
import { connect } from 'react-redux'
import { Card, IconButton, Tabs, Alert, PageLoader } from 'components'
import { Row, Column } from 'components/Layout'
import styles from './card-styles.scss'
import * as questionTypes from '../../constants'
import FlagPopover from './components/FlagPopover'
import FooterNavigate from './components/FooterNavigate'
import QuestionContent from './components/QuestionContent'

const TabContainer = props => {
  return (
    <Tabs tabs={props.tabs} selectedTab={props.selected} onChangeTab={props.onChangeCategory}>
      {props.children}
    </Tabs>
  )
}

TabContainer.propTypes = {
  tabs: PropTypes.array,
  selected: PropTypes.number,
  onChangeCategory: PropTypes.func,
  children: PropTypes.any
}

export class QuestionCard extends Component {
  static propTypes = {
    question: PropTypes.object,
    userAnswers: PropTypes.any,
    onChange: PropTypes.func,
    isValidation: PropTypes.bool,
    user: PropTypes.object,
    categories: PropTypes.array,
    selectedCategory: PropTypes.number,
    selectedCategoryId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    mergedUserQuestions: PropTypes.object,
    disableAll: PropTypes.bool,
    userImages: PropTypes.object,
    questionChangeLoader: PropTypes.bool,
    isChangingQuestion: PropTypes.bool,
    unsavedChanges: PropTypes.bool,
    saveFailed: PropTypes.bool,
    hasTouchedQuestion: PropTypes.bool,
    enabledAnswerChoice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    areDocsEmpty: PropTypes.bool
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      isSaving: false,
      clearAnswerAlertOpen: false,
      confirmAlertOpen: false,
      confirmAnswerChange: {},
      confirmAlertInfo: {
        text: '',
        title: ''
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
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
    const { question, userAnswers } = this.props
    let text = '', open = false

    if (question.questionType === questionTypes.CATEGORY) {
      if (userAnswers.answers.hasOwnProperty(id)) {
        open = true
        text = 'Unselecting a category will remove any answers associated to this category. Do you wish to continue?'
      }
    } else {
      text = 'Changing your answer will remove any pincites and annotations for the currently selected answer. Do you want to continue?'

      if (question.questionType !== questionTypes.TEXT_FIELD) {
        if (Object.keys(userAnswers.answers).length > 0) {
          if (!userAnswers.answers.hasOwnProperty(id) &&
            (question.questionType === questionTypes.MULTIPLE_CHOICE || question.questionType === questionTypes.BINARY)) {
            open = true
          } else if (userAnswers.answers.hasOwnProperty(id) && question.questionType === questionTypes.CHECKBOXES) {
            open = true
          }
        }
      }
    }

    if (open) {
      this.setState({
        confirmAlertOpen: true,
        confirmAnswerChange: { id, event, value },
        confirmAlertInfo: {
          text,
          title: 'Warning'
        }
      })
    } else {
      this.props.onChange(id)(event, value)
    }
  }

  onCancel = () => {
    this.setState({
      confirmAlertOpen: false,
      confirmAnswerChange: {},
      clearAnswerAlertOpen: false,
      confirmAlertInfo: {
        text: '',
        title: ''
      }
    })
  }

  onContinue = () => {
    this.props.onChange(this.state.confirmAnswerChange.id)(
      this.state.confirmAnswerChange.event,
      this.state.confirmAnswerChange.value
    )
    this.setState({
      confirmAlertOpen: false,
      confirmAnswerChange: {},
      confirmAlertInfo: {
        text: '',
        title: ''
      }
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

  onToggleAnswerForAnno = id => () => {
    this.props.onToggleAnswerForAnno(id)
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
      userImages: this.props.userImages,
      onToggleAnswerForAnno: this.onToggleAnswerForAnno,
      enabledAnswerChoice: this.props.enabledAnswerChoice,
      areDocsEmpty: this.props.areDocsEmpty
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
      <Row displayFlex style={{ flex: 1, width: '50%' }}>
        <Alert actions={alertActions} title={this.state.confirmAlertInfo.title} open={this.state.confirmAlertOpen}>
          <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.confirmAlertInfo.text}
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
            : <>
              <Row displayFlex style={{ alignItems: 'center', height: 55, paddingRight: 15 }}>
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
                    disableAll={this.props.disableAll}
                  />}
                </Row>
              </Row>
              <Divider />
              {this.props.categories !== undefined
                ? (
                  <TabContainer
                    tabs={this.props.categories}
                    selected={this.props.selectedCategory}
                    onChangeCategory={this.props.onChangeCategory}>
                    <QuestionContent {...questionContentProps} />
                  </TabContainer>
                ) : <QuestionContent {...questionContentProps} />}
              <Divider />
              <FooterNavigate
                currentIndex={this.props.currentIndex}
                getNextQuestion={this.props.getNextQuestion}
                getPrevQuestion={this.props.getPrevQuestion}
                totalLength={this.props.totalLength}
                showNextButton={this.props.showNextButton}
              />
            </>}
        </Column>
      </Row>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const pageState = state.scenes.codingValidation.coding
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
    hasTouchedQuestion: pageState.hasTouchedQuestion || false,
    enabledAnswerChoice: pageState.enabledAnswerChoice || null,
    areDocsEmpty: state.scenes.codingValidation.documentList.showEmptyDocs || false
  }
}

export default connect(mapStateToProps)(QuestionCard)

