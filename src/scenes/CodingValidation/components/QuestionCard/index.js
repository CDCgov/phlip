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
      isSaving: false
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
  
  /**
   * User is changing or updating answer of some sort
   * @param id
   * @returns {Function}
   */
  onChangeAnswer = id => (event, value) => {
    const { question, userAnswers, annotationModeEnabled } = this.props
    if (annotationModeEnabled) {
      this.showDisableAnnoModeAlert()
    } else {
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
  }
  
  /**
   * Shows an alert to confirm clearing answer
   */
  onClearAnswer = () => {
    const { annotationModeEnabled, actions } = this.props
    
    if (annotationModeEnabled) {
      this.showDisableAnnoModeAlert()
    } else {
      actions.setAlert({
        open: true,
        title: 'Warning',
        text: 'Are you sure you want to clear your answer?',
        type: 'clearAnswer',
        data: {}
      })
    }
  }
  
  showDisableAnnoModeAlert = () => {
    this.props.actions.setAlert({
      open: true,
      title: 'Close Annotation Mode',
      text: 'You are currently in annotation mode. To make changes to your answer or to change questions, please exit annotation mode by clicking the \'Done\' button.',
      type: 'disableAnnoMode'
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
      this.showDisableAnnoModeAlert()
    } else {
      onChangeCategory(event, selection)
      actions.toggleAnnotationMode(question.id, enabledAnswerId, false)
    }
  }
  
  onApplyAll = () => {
    const { annotationModeEnabled, onOpenAlert } = this.props
    
    if (annotationModeEnabled) {
      this.showDisableAnnoModeAlert()
    } else {
      onOpenAlert()
    }
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
   * Handles toggling on / off showing a coder's annotations
   */
  onToggleCoderAnnotations = (id, userId, isValidatorSelected) => () => {
    if (this.props.annotationModeEnabled) {
      this.showDisableAnnoModeAlert()
    } else {
      this.props.actions.toggleCoderAnnotations(this.props.question.id, id, userId, isValidatorSelected)
    }
  }
  
  render() {
    const {
      onChangeTextAnswer, onOpenFlagConfirmAlert, user, question, userAnswers, isValidation,
      mergedUserQuestions, disableAll, userImages, enabledAnswerId, enabledUserId, annotationModeEnabled,
      areDocsEmpty, questionChangeLoader, hasTouchedQuestion, categories, saveFailed, onClearAnswer, onSaveFlag,
      selectedCategory, currentIndex, getNextQuestion, getPrevQuestion, totalLength, showNextButton,
      isValidatorSelected, selectedCategoryId, alert, actions
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
      onToggleCoderAnnotations: this.onToggleCoderAnnotations,
      isValidatorSelected,
      enabledAnswerId,
      enabledUserId,
      annotationModeEnabled,
      areDocsEmpty
    }
    
    const { isSaving } = this.state
    
    this.alertActions = alert.type === 'disableAnnoMode'
      ? [
        {
          value: 'Dismiss',
          type: 'button',
          onClick: this.onCloseAlert
        }
      ] : [
        { value: 'Cancel', type: 'button', onClick: this.onCloseAlert, preferred: true },
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
        <Alert actions={this.alertActions} title={alert.title} open={alert.open}>
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
                  <FlexGrid onClick={annotationModeEnabled ? this.showDisableAnnoModeAlert : null}>
                    <FlagPopover
                      userFlag={userAnswers.flag}
                      questionId={question.id}
                      onSaveFlag={onSaveFlag}
                      annotationModeEnabled={annotationModeEnabled}
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
    isValidatorSelected: docState.isValidatorSelected,
    areDocsEmpty: docState.showEmptyDocs,
    showDisableAnnoMode: cardState.showDisableAnnoMode,
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

