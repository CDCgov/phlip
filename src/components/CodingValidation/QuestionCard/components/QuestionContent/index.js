import React, { Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import InputBox from 'components/InputBox'
import RadioGroupValidation from 'components/SelectionControls/RadioGroupValidation'
import CheckboxGroupValidation from 'components/SelectionControls/CheckboxGroupValidation'
import Icon from 'components/Icon'
import SimpleInput from 'components/SimpleInput'
import Typography from 'material-ui/Typography'
import Container, { Row, Column } from 'components/Layout'
import * as questionTypes from 'components/CodingValidation/constants'
import TextFieldQuestions from '../TextFieldQuestions'
import Divider from 'material-ui/Divider'
import Button from 'components/Button'
import ValidationTable from '../ValidationTable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { QuestionCard } from 'components/CodingValidation/QuestionCard/index'

export class QuestionContent2 extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const questionAnswerPadding = {
      paddingTop: 0,
      paddingRight: 25,
      paddingBottom: 15,
      paddingLeft: (question.number && (question.number.split('.').length * 3) + 40) || 40
    }

    const answerPadding = {
      ...questionAnswerPadding,
      paddingLeft: 65 - questionAnswerPadding.paddingLeft
    }

    return (
      <Container column flex style={{ flexWrap: 'nowrap', paddingBottom: 15, overflow: 'auto' }}>
        <Row displayFlex style={{ padding: '20px 20px 10px 20px' }}>
          <Column>
            <Typography type="subheading">{question.number})</Typography>
          </Column>
          <Column flex style={{ paddingLeft: 10 }}>
            <Typography type="subheading">{question.text}</Typography>
          </Column>
        </Row>
        <Column flex style={{ ...questionAnswerPadding, flexBasis: '60%' }}>
          {(question.questionType === questionTypes.MULTIPLE_CHOICE ||
            question.questionType === questionTypes.BINARY) &&
          <Row flex displayFlex style={{ ...answerPadding, paddingRight: 0, overflow: 'auto' }}>
            <RadioGroupValidation
              choices={question.possibleAnswers}
              question={question}
              onChange={onChange}
              userAnswers={userAnswers}
              onChangePincite={onChangeTextAnswer}
              mergedUserQuestions={mergedUserQuestions}
              currentUserInitials={currentUserInitials}
              disableAll={disableAll}
              userImages={userImages}
            />
          </Row>}

          {(question.questionType === questionTypes.CATEGORY ||
            question.questionType === questionTypes.CHECKBOXES) &&
          <Row flex displayFlex style={{ ...answerPadding, paddingRight: 0, overflow: 'auto' }}>
            <CheckboxGroupValidation
              choices={question.possibleAnswers}
              onChange={onChange}
              question={question}
              userAnswers={userAnswers}
              onChangePincite={onChangeTextAnswer}
              pincites={question.questionType !== questionTypes.CATEGORY}
              mergedUserQuestions={mergedUserQuestions}
              currentUserInitials={currentUserInitials}
              disableAll={disableAll}
              userImages={userImages}
            />
          </Row>}

          {question.questionType === questionTypes.TEXT_FIELD && mergedUserQuestions === null &&
          <Column displayFlex style={{ ...answerPadding, paddingRight: 0 }}>
            <InputBox
              rows="7" name="text-answer" onChange={onChangeTextAnswer} placeholder="Enter answer"
              value={userAnswers.answers[question.possibleAnswers[0].id]} answerId={question.possibleAnswers[0].id}
              disabled={disableAll}
            />
          </Column>}

          {question.questionType === questionTypes.TEXT_FIELD && mergedUserQuestions !== null &&
          <TextFieldQuestions
            style={{ ...answerPadding, paddingRight: 0 }}
            mergedUserQuestions={mergedUserQuestions}
            validatorAnswer={userAnswers.answers[question.possibleAnswers[0].id]}
            validator={userAnswers.validatedBy}
            onChange={onChangeTextAnswer}
            userImages={userImages}
            answerId={question.possibleAnswers[0].id}
            currentUserInitials={currentUserInitials}
            disabled={disableAll}
          />
          }
          <Row style={{ ...answerPadding, paddingRight: 0, paddingTop: 0, paddingBottom: 0 }}>
            {question.includeComment &&
            <Row>
              <SimpleInput
                onChange={onChangeTextAnswer(null, 'comment')}
                name="comment"
                shrinkLabel={true}
                style={{ whiteSpace: 'pre-wrap' }}
                placeholder="Enter comment"
                value={comment}
                rowsMax={3}
                label="Comment"
                disabled={disableAll}
              />
            </Row>}
          </Row>
        </Column>

        {question.hint &&
        <Row displayFlex style={{ padding: '20px 35px 0px 35px' }}>
          <Icon color="#98b3be" size="18px">lightbulb_outline</Icon>
          <Typography type="body1" style={{ color: '#98b3be' }}><strong>Coding Directions: </strong>{question.hint}</Typography>
        </Row>
        }

        {isValidation && <ValidationTable
          onOpenAlert={onOpenFlagConfirmAlert}
          mergedUserQuestions={mergedUserQuestions}
          questionFlags={question.flags}
          userImages={userImages}
        />}

        {question.isCategoryQuestion &&
        <Fragment>
          <Divider />
          <Row
            displayFlex
            style={{
              ...answerPadding,
              paddingBottom: 20,
              paddingTop: 20,
              paddingRight: 0,
              justifyContent: 'flex-end'
            }}
          >
            <Button onClick={onOpenAlert} color="accent" value="Apply Answer to all categories" />
          </Row>
        </Fragment>}
      </Container>
    )
  }
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
    isChangingQuestion: pageState.isChangingQuestion || false
  }
}

//export default connect(mapStateToProps)(QuestionContent2)





export const QuestionContent = props => {
  const {
    question, currentUserInitials, comment, userAnswers, mergedUserQuestions, isValidation, disableAll,
    onChange, onChangeTextAnswer, onOpenAlert, onOpenFlagConfirmAlert, userImages
  } = props

  console.log(question, userAnswers)
  console.log(comment)

  const questionAnswerPadding = {
    paddingTop: 0,
    paddingRight: 25,
    paddingBottom: 15,
    paddingLeft: (question.number && (question.number.split('.').length * 3) + 40) || 40
  }

  const answerPadding = {
    ...questionAnswerPadding,
    paddingLeft: 65 - questionAnswerPadding.paddingLeft
  }

  return (
    <Container column flex style={{ flexWrap: 'nowrap', paddingBottom: 15, overflow: 'auto' }}>
      <Row displayFlex style={{ padding: '20px 20px 10px 20px' }}>
        <Column>
          <Typography type="subheading">{question.number})</Typography>
        </Column>
        <Column flex style={{ paddingLeft: 10 }}>
          <Typography type="subheading">{question.text}</Typography>
        </Column>
      </Row>
      <Column flex style={{ ...questionAnswerPadding, flexBasis: '60%' }}>
        {(question.questionType === questionTypes.MULTIPLE_CHOICE ||
          question.questionType === questionTypes.BINARY) &&
        <Row flex displayFlex style={{ ...answerPadding, paddingRight: 0, overflow: 'auto' }}>
          <RadioGroupValidation
            choices={question.possibleAnswers}
            question={question}
            onChange={onChange}
            userAnswers={userAnswers}
            onChangePincite={onChangeTextAnswer}
            mergedUserQuestions={mergedUserQuestions}
            currentUserInitials={currentUserInitials}
            disableAll={disableAll}
            userImages={userImages}
          />
        </Row>}

        {(question.questionType === questionTypes.CATEGORY ||
          question.questionType === questionTypes.CHECKBOXES) &&
        <Row flex displayFlex style={{ ...answerPadding, paddingRight: 0, overflow: 'auto' }}>
          <CheckboxGroupValidation
            choices={question.possibleAnswers}
            onChange={onChange}
            question={question}
            userAnswers={userAnswers}
            onChangePincite={onChangeTextAnswer}
            pincites={question.questionType !== questionTypes.CATEGORY}
            mergedUserQuestions={mergedUserQuestions}
            currentUserInitials={currentUserInitials}
            disableAll={disableAll}
            userImages={userImages}
          />
        </Row>}

        {question.questionType === questionTypes.TEXT_FIELD && mergedUserQuestions === null &&
        <Column displayFlex style={{ ...answerPadding, paddingRight: 0 }}>
          <InputBox
            rows="7" name="text-answer" onChange={onChangeTextAnswer} placeholder="Enter answer"
            value={userAnswers.answers[question.possibleAnswers[0].id]} answerId={question.possibleAnswers[0].id}
            disabled={disableAll}
          />
        </Column>}

        {question.questionType === questionTypes.TEXT_FIELD && mergedUserQuestions !== null &&
        <TextFieldQuestions
          style={{ ...answerPadding, paddingRight: 0 }}
          mergedUserQuestions={mergedUserQuestions}
          validatorAnswer={userAnswers.answers[question.possibleAnswers[0].id]}
          validator={userAnswers.validatedBy}
          onChange={onChangeTextAnswer}
          userImages={userImages}
          answerId={question.possibleAnswers[0].id}
          currentUserInitials={currentUserInitials}
          disabled={disableAll}
        />
        }
        <Row style={{ ...answerPadding, paddingRight: 0, paddingTop: 0, paddingBottom: 0 }}>
          {question.includeComment &&
          <Row>
            <SimpleInput
              onChange={onChangeTextAnswer(null, 'comment')}
              name="comment"
              shrinkLabel={true}
              style={{ whiteSpace: 'pre-wrap' }}
              placeholder="Enter comment"
              value={comment}
              rowsMax={3}
              label="Comment"
              disabled={disableAll}
            />
          </Row>}
        </Row>
      </Column>

      {question.hint &&
        <Row displayFlex style={{ padding: '20px 35px 0px 35px' }}>
          <Icon color="#98b3be" size="18px">lightbulb_outline</Icon>
          <Typography type="body1" style={{ color: '#98b3be' }}><strong>Coding Directions: </strong>{question.hint}</Typography>
        </Row>
      }

      {isValidation && <ValidationTable
        onOpenAlert={onOpenFlagConfirmAlert}
        mergedUserQuestions={mergedUserQuestions}
        questionFlags={question.flags}
        userImages={userImages}
      />}

      {question.isCategoryQuestion &&
        <Fragment>
          <Divider />
          <Row
            displayFlex
            style={{
              ...answerPadding,
              paddingBottom: 20,
              paddingTop: 20,
              paddingRight: 0,
              justifyContent: 'flex-end'
            }}
          >
            <Button onClick={onOpenAlert} color="accent" value="Apply Answer to all categories" />
          </Row>
        </Fragment>}
    </Container>
  )
}

QuestionContent.defaultProps = {
  mergedUserQuestions: { answers: [] }
}

QuestionContent.propTypes = {
  question: PropTypes.object,
  onChange: PropTypes.func
}

export default QuestionContent