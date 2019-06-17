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
import { default as codingActions } from 'scenes/CodingValidation/actions'
import actions from './actions'

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
      hoveredAnswerChoice: 0
    }
    
    this.alertActions = []
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
  
  onMouseOutAnswerChoice = () => {
    this.setState({
      hoveredAnswerChoice: 0
    })
  }
  
  onMouseInAnswerChoice = answerId => {
    this.setState({
      hoveredAnswerChoice: answerId
    })
  }
  
  /**
   * User is changing or updating answer of some sort
   * @param id
   * @returns {Function}
   */
  onChangeAnswer = id => (event, value) => {
    const { question, userAnswers, annotationModeEnabled, enabledAnswerId, actions } = this.props
    let text = '', open = false
  
    if (annotationModeEnabled) {
      actions.toggleAnnotationMode(question.id, enabledAnswerId, false)
    }
    
    if (question.questionType === questionTypes.CATEGORY) {
      if (userAnswers.answers.hasOwnProperty(id)) {
        open = true
        text = 'Deselecting a category will remove answers, pincites and annotations associated with this category. Do you want to continue?'
      }
    } else {
      text = 'Changing your answer will remove the pincites and annotations associated with this answer. Do you want to continue?'
      
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
      this.props.actions.setAlert({
        open: true,
        type: 'changeAnswer',
        title: 'Warning',
        text,
        data: { id, value }
      })
    } else {
      this.props.onChange(id)(event, value)
    }
  }
  
  /**
   * Shows an alert to confirm clearing answer
   */
  onClearAnswer = () => {
    const { annotationModeEnabled, actions, question, enabledAnswerId } = this.props
    
    if (annotationModeEnabled) {
      actions.toggleAnnotationMode(question.id, enabledAnswerId, false)
    }
    
    actions.setAlert({
      open: true,
      title: 'Warning',
      text: 'Clearing your answer will remove the selected answer choice, pincites and annotations associated with this answer. Do you want to continue?',
      type: 'clearAnswer',
      data: {}
    })
  }
  
  /**
   * Closes the open alert on the page
   */
  onCloseAlert = () => {
    this.props.actions.closeAlert()
  }
  
  /**
   * Determines how much margin for the question answer area
   * @returns {number}
   */
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
   * When the user changes the category
   */
  onChangeCategory = (event, selection) => {
    const { annotationModeEnabled, question, enabledAnswerId, actions, onChangeCategory } = this.props
    
    if (annotationModeEnabled) {
      actions.toggleAnnotationMode(question.id, enabledAnswerId, false)
    }
    onChangeCategory(event, selection)
  }
  
  onApplyAll = () => {
    const { annotationModeEnabled, onOpenAlert, actions, question, enabledAnswerId } = this.props
    
    if (annotationModeEnabled) {
      actions.toggleAnnotationMode(question.id, enabledAnswerId, false)
    }
    onOpenAlert()
  }
  
  /**
   * Toggles annotation mode
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
  
  /**
   * Toggles showing annotations for an answer choice
   * @param answerId
   */
  onToggleViewAnnotations = answerId => () => {
    const { question, actions, enabledAnswerId, annotationModeEnabled } = this.props
    
    if (annotationModeEnabled) {
      actions.toggleAnnotationMode(question.id, enabledAnswerId, false)
    }
    
    actions.toggleViewAnnotations(question.id, answerId)
  }
  
  disableAnnotationMode = () => {
    const { question, actions, enabledAnswerId } = this.props
    actions.toggleAnnotationMode(question.id, enabledAnswerId, false)
  }
  
  render() {
    const {
      onChangeTextAnswer, onOpenFlagConfirmAlert, user, question, userAnswers, isValidation,
      mergedUserQuestions, disableAll, userImages, enabledAnswerId, enabledUserId, annotationModeEnabled,
      areDocsEmpty, questionChangeLoader, hasTouchedQuestion, categories, saveFailed, onClearAnswer, onSaveFlag,
      selectedCategory, currentIndex, getNextQuestion, getPrevQuestion, totalLength, showNextButton,
      isUserAnswerSelected, selectedCategoryId, alert, actions
    } = this.props
    
    const questionContentProps = {
      onChange: this.onChangeAnswer,
      onChangeTextAnswer: onChangeTextAnswer,
      onOpenFlagConfirmAlert: onOpenFlagConfirmAlert,
      currentUserInitials: getInitials(user.firstName, user.lastName),
      user,
      question,
      onApplyAll: this.onApplyAll,
      userAnswers: { validatedBy: { ...user }, ...userAnswers },
      comment: userAnswers.comment,
      isValidation,
      mergedUserQuestions,
      disableAll,
      userImages,
      onToggleAnnotationMode: this.onToggleAnnotationMode,
      onToggleViewAnnotations: this.onToggleViewAnnotations,
      isUserAnswerSelected,
      enabledAnswerId,
      enabledUserId,
      annotationModeEnabled,
      areDocsEmpty,
      onMouseInAnswerChoice: this.onMouseInAnswerChoice,
      onMouseOutAnswerChoice: this.onMouseOutAnswerChoice,
      hoveredAnswerChoice: this.state.hoveredAnswerChoice
    }
    
    const { isSaving } = this.state
    
    const closeButton = { value: alert.type === 'disableAnnoMode' ? 'Dismiss' : 'Cancel' }
    this.alertActions = alert.type === 'disableAnnoMode'
      ? [] : [
        {
          value: 'Continue',
          type: 'button',
          onClick: () => {
            if (alert.type === 'clearAnswer') {
              onClearAnswer()
              actions.toggleAnnotationMode(question.id, enabledAnswerId, false)
            } else {
              this.props.onChange(alert.data.id)(alert.data.value)
            }
            this.props.actions.setAlert({ open: false })
          }
        }
      ]
    
    return (
      <FlexGrid container type="row" flex style={{ minWidth: '10%', flexBasis: '0%' }}>
        <Alert
          actions={this.alertActions}
          title={alert.title}
          onCloseAlert={this.onCloseAlert}
          closeButton={closeButton}
          open={alert.open}>
          <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
            {alert.text}
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
                  {!isValidation &&
                  <FlexGrid onClick={annotationModeEnabled ? this.disableAnnotationMode : null}>
                    <FlagPopover
                      userFlag={userAnswers.flag}
                      questionId={question.id}
                      onSaveFlag={onSaveFlag}
                      questionFlags={question.flags}
                      categoryId={selectedCategoryId}
                      user={user}
                      disableAll={disableAll}
                    />
                  </FlexGrid>}
                </FlexGrid>
              </FlexGrid>
              <Divider />
              {categories !== undefined
                ? (
                  <TabContainer
                    tabs={categories}
                    selected={selectedCategory}
                    onChangeCategory={this.onChangeCategory}>
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

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {
  const pageState = state.scenes.codingValidation.coding
  const docState = state.scenes.codingValidation.documentList
  const cardState = pageState.card
  
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
    isUserAnswerSelected: docState.isUserAnswerSelected,
    areDocsEmpty: docState.showEmptyDocs,
    alert: cardState.alert
  }
}

const mapDispatchToProps = dispatch => ({
  actions: {
    ...bindActionCreators(actions, dispatch),
    ...bindActionCreators(codingActions, dispatch)
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(QuestionCard)

