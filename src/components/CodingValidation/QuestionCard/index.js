import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Divider from 'material-ui/Divider'
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
import { bindActionCreators } from 'redux'
import { getInitials } from 'utils/normalize'
import Alert from 'components/Alert'

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
      confirmCategoryUncheckOpen: false
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
      categoryToUncheck: {}
    })
  }

  onContinue = () => {
    this.props.onChange(this.state.categoryToUncheck.id)(this.state.categoryToUncheck.event, this.state.categoryToUncheck.value)
    this.setState({
      confirmCategoryUncheckOpen: false,
      categoryToUncheck: {}
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
      userAnswers: this.props.userAnswers,
      comment: this.props.userAnswers.comment,
      isValidation: this.props.isValidation,
      mergedUserQuestions: this.props.mergedUserQuestions,
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

    return (
      <Row displayFlex style={{ flex: '1 0 50%' }}>
        <Alert
          text="Unselecting a category will remove any answers associated to this category. Do you wish to continue?"
          actions={alertActions}
          open={this.state.confirmCategoryUncheckOpen}
        />
        <Column component={<Card />} displayFlex flex style={{ width: '100%' }}>
          <Row displayFlex style={{ alignItems: 'center', justifyContent: 'flex-end', height: 42, paddingRight: 15 }}>
            {this.props.question.questionType !== questionTypes.CATEGORY &&
              <IconButton
                onClick={this.props.onClearAnswer}
                aria-label="Clear answer"
                tooltipText="Clear answer"
                id="clear-answer">
                <Broom className={styles.sweep} aria-labelledby="Clear answer" />
              </IconButton>}
            {!this.props.isValidation && <FlagPopover
              userFlag={this.props.userAnswers.flag}
              onSaveFlag={this.props.onSaveFlag}
              questionFlags={this.props.question.flags}
              user={this.props.user} />}
          </Row>
          <Divider />
          {this.props.categories !== undefined
            ? <TabContainer
              tabs={this.props.categories}
              selected={this.props.selectedCategory}
              onChangeCategory={this.props.onChangeCategory}>
              <QuestionContent {...questionContentProps} />
            </TabContainer>
            : <QuestionContent{...questionContentProps} />
          }
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
    question: pageState.question,
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
    userImages: pageState.userImages
  }
}

export default connect(mapStateToProps)(QuestionCard)

