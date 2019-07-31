import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Container, { Row, Column } from 'components/Layout'
import { default as formActions } from 'redux-form/lib/actions'
import FormModal from 'components/FormModal'
import TextInput from 'components/TextInput'
import DropDown from 'components/Dropdown'
import actions from './actions'
import { ModalTitle, ModalActions, ModalContent } from 'components/Modal'
import { Field, FieldArray } from 'redux-form'
import AnswerList from './components/AnswerList'
import CheckboxLabel from 'components/CheckboxLabel'
import styles from './add-edit-question.scss'
import { trimWhitespace } from 'utils/formHelpers'
import * as questionTypes from './constants'
import withFormAlert from 'components/withFormAlert'
import CircularLoader from 'components/CircularLoader'

/**
 * Main / entry component for all things related to adding and editing a question for the coding scheme. This component
 * is a modal and is rendered and mounted when the user clicks the 'Add New Question' button or the pencil icon on a
 * question node in the scheme. The Edit or Add view is determined by the location and location.state props variables.
 * If a question is passed along, then it's edit, otherwise it's Add. This component is wrapped by the withFormAlert,
 * and react-redux's connect HOCs.
 */
export class AddEditQuestion extends Component {
  static propTypes = {
    /**
     * ID of project for which this view was opened
     */
    projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Redux actions
     */
    actions: PropTypes.object,
    /**
     * Redux-form actions
     */
    formActions: PropTypes.object,
    /**
     * Redux-form
     */
    form: PropTypes.object,
    /**
     * Name of form
     */
    formName: PropTypes.string,
    /**
     * react-router location match object
     */
    match: PropTypes.object,
    /**
     * Browser history object
     */
    history: PropTypes.object,
    /**
     * react-router location object
     */
    location: PropTypes.object,
    /**
     * Function passed in from withFormAlert HOC
     */
    onCloseModal: PropTypes.func,
    /**
     * Form error if any that occurred when manipulating the form
     */
    formError: PropTypes.string,
    /**
     * Whether or not the protocol is currently checked out
     */
    hasLock: PropTypes.bool,
    /**
     * Whether or not the protocol is checked out by the current user logged in
     */
    lockedByCurrentUser: PropTypes.bool,
    /**
     * Called when there's an error that occurs while sending a request. Passed in from formModal -- opens an alert
     */
    onSubmitError: PropTypes.func,
    /**
     * Whether or not to close the modal and go back to the coding scheme page
     */
    goBack: PropTypes.bool
  }
  
  constructor(props, context) {
    super(props, context)
    const { match, projectId, location, lockedByCurrentUser } = props
    
    // User is editing a question
    this.questionDefined = match.url === `/project/${projectId}/coding-scheme/add`
      ? null
      : location.state.questionDefined
    
    // Parent of question if it's a child question
    this.parentDefined = location.state
      ? location.state.parentDefined
        ? location.state.parentDefined
        : null
      : null
    
    this.state = {
      edit: this.questionDefined,
      submitting: false,
      canModify: location.state
        ? location.state.canModify
        : lockedByCurrentUser
    }
    
    this.defaultForm = {
      questionType: questionTypes.MULTIPLE_CHOICE,
      possibleAnswers: [{}, {}, {}],
      includeComment: false,
      isCategoryQuestion: false
    }
    
    this.binaryForm = {
      questionType: questionTypes.BINARY,
      possibleAnswers: [{ text: 'Yes' }, { text: 'No' }],
      includeComment: false,
      isCategoryQuestion: false
    }
    
    this.textFieldForm = {
      questionType: questionTypes.TEXT_FIELD,
      includeComment: false,
      isCategoryQuestion: false
    }
  }
  
  componentDidMount() {
    this.prevTitle = document.title
    document.title = this.questionDefined
      ? `${document.title} - Edit Question`
      : `${document.title} - Add Question`
  }
  
  componentDidUpdate(prevProps) {
    const { formError, onSubmitError, history, goBack } = this.props
    
    if (this.state.submitting) {
      if (formError !== null) {
        this.setState({ submitting: false })
        onSubmitError(formError)
      } else if (goBack) {
        history.goBack()
      }
    }
  }
  
  componentWillUnmount() {
    document.title = this.prevTitle
  }
  
  /**
   * Shows a spinner next to button text when a request is in progress
   * @param text
   * @returns {*}
   */
  getButtonText = text => {
    if (this.state.submitting) {
      return (
        <Fragment>
          {text}
          <CircularLoader size={18} style={{ paddingLeft: 10 }} />
        </Fragment>
      )
    } else {
      return <Fragment>{text}</Fragment>
    }
  }
  
  /**
   * Function called when the form is submitted, dispatches a redux action for updating or adding depending on state and
   * whether or not the request if for a child question. Trims whitespace from all of the question form fields.
   *
   * @public
   * @param {Object} values
   */
  handleSubmit = values => {
    this.setState({ submitting: true })
    
    let updatedValues = { ...values }
    for (let field of ['text', 'hint']) {
      if (updatedValues[field]) updatedValues[field] = trimWhitespace(values[field])
      else updatedValues[field] = values[field]
    }
    
    if (values.possibleAnswers) {
      values.possibleAnswers.forEach((answer, i) => {
        if (updatedValues.possibleAnswers[i].text) updatedValues.possibleAnswers[i] = {
          ...answer,
          text: answer.text.trim()
        }
        else updatedValues.possibleAnswers[i] = answer
      })
    }
    
    this.questionDefined
      ? this.props.actions.updateQuestionRequest(
        updatedValues,
        this.props.projectId,
        this.questionDefined.id,
        this.props.location.state.path
      )
      : this.parentDefined
        ? this.props.actions.addChildQuestionRequest(
          updatedValues,
          this.props.projectId,
          this.parentDefined.id,
          this.parentDefined,
          this.props.location.state.path
        )
        : this.props.actions.addQuestionRequest(updatedValues, this.props.projectId, 0)
    
  }
  
  /**
   * In edit mode, the user clicks the cancel button. Resets to form values to whatever they were before editing.
   *
   * @public
   */
  onCancel = () => {
    this.props.formActions.reset('questionForm')
    this.props.history.goBack()
  }
  
  /**
   * Handles updating the form fields when the user changes the question type in the form. Dispatches a redux-form
   * action to change form fields and values. Values are kept for questionText and questionHint. If the type of
   * question is changed another other than TextField or Binary, then the possibleAnswers text is kept. If the question
   * type is changed to Binary then the possibleAnswers are changed to True and False. If the question type is changed
   * to TextField, the possibleAnswers are removed.
   *
   * @public
   * @param {Object} event
   * @param {Number} value
   */
  handleTypeChange = (event, value) => {
    if (value === questionTypes.BINARY) {
      const currentValues = this.props.form.values
      this.props.formActions.initialize('questionForm', this.binaryForm, {
        options: {
          keepDirty: false,
          keepValues: false
        }
      })
      Object.keys(currentValues).map(key => {
        if (key !== 'possibleAnswers') {
          this.props.formActions.change('questionForm', key, currentValues[key])
        }
      })
    } else if (value === questionTypes.TEXT_FIELD) {
      this.props.formActions.initialize('questionForm', this.textFieldForm, true)
    } else {
      this.props.formActions.initialize('questionForm', this.defaultForm, true)
    }
  }
  
  /**
   * Validates that all required fields are filled out. This included every available possibleAnswer text field on the
   * form.
   *
   * @public
   * @param {Object} values
   */
  validate = values => {
    const errors = {}
    if (!values.text) {
      errors.text = 'Required'
    }
    const answersArrayErrors = []
    if (!(values.questionType === questionTypes.TEXT_FIELD)) {
      values.possibleAnswers.forEach((answer, index) => {
        const answerErrors = {}
        if (!answer || !answer.text) {
          answerErrors.text = 'Required'
          answersArrayErrors[index] = answerErrors
        }
      })
      if (answersArrayErrors.length) {
        errors.possibleAnswers = answersArrayErrors
      }
    }
    
    return errors
  }
  
  render() {
    const options = [
      { value: questionTypes.BINARY, label: 'Binary' },
      { value: questionTypes.CHECKBOXES, label: 'Checkbox' },
      { value: questionTypes.MULTIPLE_CHOICE, label: 'Radio Button' },
      { value: questionTypes.TEXT_FIELD, label: 'Text Field' },
      { value: questionTypes.CATEGORY, label: 'Tabbed' }
    ]
    
    const categoryChildOptions = options.filter(option => option.value !== questionTypes.CATEGORY)
    
    const actions = [
      {
        value: 'Cancel',
        onClick: this.onCancel,
        type: 'button',
        otherProps: { 'aria-label': 'Cancel and close form' }
      },
      {
        value: this.questionDefined
          ? this.getButtonText('Save')
          : this.getButtonText('Add'),
        type: 'submit',
        disabled: !this.state.canModify || this.state.submitting === true,
        otherProps: { 'aria-label': 'Save form' }
      }
    ]
    
    return (
      <FormModal
        form="questionForm"
        handleSubmit={this.handleSubmit}
        initialValues={this.questionDefined || this.defaultForm}
        maxWidth="md"
        validate={this.validate}
        onClose={this.props.onCloseModal}>
        <Container column style={{ minWidth: 890, padding: '20px 20px 0 20px' }}>
          <Container column className={styles.dashed}>
            <ModalTitle title={this.state.edit ? 'Edit Question' : 'Add New Question'} />
            <ModalContent>
              <Container>
                <Column flex style={{ padding: '0 10px 20px 0' }}>
                  <Field
                    name="text"
                    component={TextInput}
                    label="Question"
                    shrinkLabel
                    multiline
                    smallLabel
                    required
                    disabled={!this.state.canModify}
                    placeholder="Enter question"
                  />
                </Column>
                <Column>
                  <Field
                    name="questionType"
                    component={DropDown}
                    fullWidth
                    label="Answer Type"
                    required
                    options={this.parentDefined && (this.parentDefined.questionType === questionTypes.CATEGORY)
                      ? categoryChildOptions : options}
                    defaultValue={questionTypes.MULTIPLE_CHOICE}
                    onChange={this.handleTypeChange}
                    disabled={!!this.state.edit || !this.state.canModify}
                  />
                </Column>
              </Container>
              <Container>
                <Row flex style={{ padding: '0 10px 20px 0' }}>
                  <Field
                    name="hint"
                    component={TextInput}
                    shrinkLabel
                    smallLabel
                    label="Coding directions"
                    disabled={!this.state.canModify}
                    placeholder="Enter any special directions or considerations to display when coding this question"
                  />
                </Row>
              </Container>
              <FieldArray
                name="possibleAnswers"
                answerType={this.props.form.values
                  ? this.props.form.values.questionType
                  : questionTypes.MULTIPLE_CHOICE
                }
                isEdit={!!this.state.edit}
                component={AnswerList}
                canModify={this.state.canModify}
              />
              <Container>
                <Row
                  flex
                  style={{
                    paddingLeft: this.props.form.values
                      ? (this.props.form.values.questionType !== questionTypes.TEXT_FIELD && '47px')
                      : '47px'
                  }}>
                  <Field
                    name="includeComment"
                    label="Include comment box"
                    component={CheckboxLabel}
                    disabled={!this.state.canModify}
                  />
                </Row>
              </Container>
            </ModalContent>
          </Container>
          <ModalActions
            actions={actions}
            style={{ paddingTop: 15, paddingBottom: 15, margin: 0 }}
          />
        </Container>
      </FormModal>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {
  const formState = state.scenes.codingScheme.addEditQuestion
  const schemeState = state.scenes.codingScheme.main
  
  return {
    form: state.form.questionForm || {},
    projectId: ownProps.match.params.id,
    formName: 'questionForm',
    formError: formState.formError || null,
    lockedByCurrentUser: schemeState.lockedByCurrentUser || false,
    hasLock: Object.keys(schemeState.lockInfo).length > 0 || false,
    goBack: formState.goBack,
    submitting: formState.submitting
  }
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
  formActions: bindActionCreators(formActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(withFormAlert(AddEditQuestion))
