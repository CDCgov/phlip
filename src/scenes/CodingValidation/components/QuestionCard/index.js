import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Broom } from 'mdi-material-ui'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import { getInitials } from 'utils/normalize'
import { connect } from 'react-redux'
import { IconButton, Tabs, Alert, PageLoader, FlexGrid } from 'components'
import styles from './card-styles.scss'
import * as questionTypes from '../../constants'
import FlagPopover from './components/FlagPopover'
import FooterNavigate from './components/FooterNavigate'
import QuestionContent from './components/QuestionContent'
import { bindActionCreators } from 'redux'
import actions from 'scenes/CodingValidation/actions'

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
    enabledAnswerId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    enabledUserId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    annotationModeEnabled: PropTypes.bool,
    areDocsEmpty: PropTypes.bool,
    actions: PropTypes.object
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

  componentDidUpdate(prevProps) {
    if (!prevProps.unsavedChanges && this.props.unsavedChanges) {
      this.setState({
        isSaving: true
      })
      clearTimeout()
    } else if (prevProps.unsavedChanges && !this.props.unsavedChanges) {
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
        text = 'Deselecting a category will remove any answers associated with this category. Do you want to continue?'
      }
    } else {
      text = 'Changing your answer will remove any pincites and annotations associated with this answer. Do you want to continue?'

      if (question.questionType !== questionTypes.TEXT_FIELD) {
        if (Object.keys(userAnswers.answers).length > 0) {
          if (!userAnswers.answers.hasOwnProperty(id) &&
            (question.questionType === questionTypes.MULTIPLE_CHOICE || question.questionType ===
              questionTypes.BINARY)) {
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

  /**
   * Opens an alert asking user to confirm clearing answer
   */
  onClearAnswer = () => {
    this.setState({
      clearAnswerAlertOpen: true
    })
  }

  /**
   * Enables annotation mode
   * @param id
   * @returns {Function}
   */
  onToggleAnnotationMode = id => () => {
    const { annotationModeEnabled, enabledAnswerId, question, actions } = this.props

    const enabled = annotationModeEnabled
      ? enabledAnswerId !== id
      : true

    actions.toggleAnnotationMode(question.id, id, enabled)
  }

  onToggleCoderAnnotations = (id, userId, isValidatorSelected) => () => {
    this.props.actions.toggleCoderAnnotations(this.props.question.id, id, userId, isValidatorSelected)
  }

  render() {
    const {
      onChangeTextAnswer, onOpenFlagConfirmAlert, user, question, onOpenAlert, userAnswers, isValidation,
      mergedUserQuestions, disableAll, userImages, enabledAnswerId, enabledUserId, annotationModeEnabled,
      areDocsEmpty, questionChangeLoader, hasTouchedQuestion, categories, saveFailed, onClearAnswer, onSaveFlag,
      selectedCategory, onChangeCategory, currentIndex, getNextQuestion, getPrevQuestion, totalLength, showNextButton,
      isValidatorSelected
    } = this.props

    const questionContentProps = {
      onChange: this.onChangeAnswer,
      onChangeTextAnswer: onChangeTextAnswer,
      onOpenFlagConfirmAlert: onOpenFlagConfirmAlert,
      currentUserInitials: getInitials(user.firstName, user.lastName),
      user,
      question,
      onOpenAlert,
      userAnswers: { validatedBy: { ...user }, ...userAnswers },
      comment: userAnswers.comment,
      isValidation,
      mergedUserQuestions,
      disableAll,
      userImages,
      onToggleAnnotationMode: this.onToggleAnnotationMode,
      onToggleCoderAnnotations: this.onToggleCoderAnnotations,
      isValidatorSelected,
      enabledAnswerId,
      enabledUserId,
      annotationModeEnabled,
      areDocsEmpty
    }

    const { confirmAlertInfo, confirmAlertOpen, clearAnswerAlertOpen, isSaving } = this.state

    const alertActions = [
      {
        value: 'Cancel',
        type: 'button',
        onClick: this.onCancel,
        preferred: true
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
        onClick: this.onCancel,
        preferred: true
      },
      {
        value: 'Continue',
        type: 'button',
        onClick: () => {
          this.onCancel()
          onClearAnswer()
        }
      }
    ]

    return (
      <FlexGrid container type="row" flex style={{ width: '50%', minWidth: '10%' }}>
        <Alert actions={alertActions} title={confirmAlertInfo.title} open={confirmAlertOpen}>
          <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
            {confirmAlertInfo.text}
          </Typography>
        </Alert>
        <Alert actions={clearAnswerActions} open={clearAnswerAlertOpen}>
          <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
            Are you sure you want to clear your answer to this question?
          </Typography>
        </Alert>
        <FlexGrid container flex raised style={{ width: '100%' }}>
          {questionChangeLoader
            ? <PageLoader circularLoaderProps={{ color: 'primary', size: 50 }} />
            : <>
              <FlexGrid container type="row" align="center" padding="0 15px 0 0" style={{ height: 55, minHeight: 55 }}>
                <FlexGrid flex style={{ width: '100%' }}>
                  {hasTouchedQuestion &&
                  <Typography variant="caption" style={{ paddingLeft: 10, textAlign: 'center', color: '#757575' }}>
                    {saveFailed ? 'Save failed!' : isSaving ? 'Saving...' : 'All changes saved'}
                  </Typography>}
                </FlexGrid>
                <FlexGrid container type="row" style={{ marginLeft: this.getMargin() }}>
                  {question.questionType !== questionTypes.CATEGORY &&
                  <IconButton
                    onClick={this.onClearAnswer}
                    aria-label="Clear answer"
                    tooltipText="Clear answer"
                    id="clear-answer"
                    style={{ height: 24 }}>
                    {!disableAll && <Broom className={styles.icon} aria-labelledby="Clear answer" />}
                  </IconButton>}
                  {!isValidation && <FlagPopover
                    userFlag={userAnswers.flag}
                    onSaveFlag={onSaveFlag}
                    questionFlags={question.flags}
                    user={user}
                    disableAll={disableAll}
                  />}
                </FlexGrid>
              </FlexGrid>
              <Divider />
              {categories !== undefined
                ? (
                  <TabContainer
                    tabs={categories}
                    selected={selectedCategory}
                    onChangeCategory={onChangeCategory}>
                    <QuestionContent {...questionContentProps} />
                  </TabContainer>
                ) : <QuestionContent {...questionContentProps} />}
              <Divider />
              <FooterNavigate
                currentIndex={currentIndex}
                getNextQuestion={getNextQuestion}
                getPrevQuestion={getPrevQuestion}
                totalLength={totalLength}
                showNextButton={showNextButton}
              />
            </>}
        </FlexGrid>
      </FlexGrid>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const pageState = state.scenes.codingValidation.coding
  const docState = state.scenes.codingValidation.documentList

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
    questionChangeLoader: pageState.questionChangeLoader || false,
    isChangingQuestion: pageState.isChangingQuestion || false,
    unsavedChanges: pageState.unsavedChanges || false,
    saveFailed: pageState.saveFailed || false,
    hasTouchedQuestion: pageState.hasTouchedQuestion || false,

    userImages: state.data.user.byId,
    enabledAnswerId: docState.enabledAnswerId,
    enabledUserId: docState.enabledUserId,
    annotationModeEnabled: docState.annotationModeEnabled,
    isValidatorSelected: docState.isValidatorSelected,
    areDocsEmpty: docState.showEmptyDocs
  }
}

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(QuestionCard)

