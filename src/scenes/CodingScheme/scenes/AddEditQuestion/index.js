import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Container, { Row, Column } from 'components/Layout'
import { default as formActions } from 'redux-form/lib/actions'
import FormModal from 'components/FormModal'
import TextInput from 'components/TextInput'
import DropDown from 'components/Dropdown'
import { withRouter } from 'react-router'
import * as actions from './actions'
import Modal, { ModalTitle, ModalActions, ModalContent } from 'components/Modal'
import { Field, FieldArray } from 'redux-form'
import AnswerList from './components/AnswerList'
import CheckboxLabel from 'components/CheckboxLabel'
import styles from './add-edit-question.scss'
import { trimWhitespace } from 'utils/formHelpers'


export class AddEditQuestion extends Component {
  constructor(props, context) {
    super(props, context)
    this.questionDefined = this.props.match.url === `/project/${this.props.projectid}/coding-scheme/add`
      ? null
      : this.props.location.state.questionDefined
    this.state = {
      edit: this.questionDefined
    }
    this.defaultForm = {
      questionType: 4,
      possibleAnswers: [{}, {}, {}],
      includeComment: false
    }
    this.binaryForm = {
      questionType: 1,
      possibleAnswers: [{ text: 'Yes' }, { text: 'No' }],
      includeComment: false
    }

    this.onCancel = this.onCancel.bind(this)
  }

  onCancel = () => {
    this.props.formActions.reset('questionForm')
    this.props.history.goBack()
  }

  handleSubmit = values => {
    let updatedValues = { ...values }
    for (let field of ['text', 'hint']) {
      if (updatedValues[field]) updatedValues[field] = trimWhitespace(values[field])
      else updatedValues[field] = values[field]
    }

    values.possibleAnswers.forEach((answer, i) => {
      if (updatedValues.possibleAnswers[i].text) updatedValues.possibleAnswers[i] = { ...answer, text: answer.text.trim() }
      else updatedValues.possibleAnswers[i] = answer
    })

    this.questionDefined
      ? this.props.actions.updateQuestionRequest(updatedValues, this.props.projectId, this.props.location.state.questionDefined.id)
      : this.props.actions.addQuestionRequest(updatedValues, this.props.projectId)

    this.props.history.goBack()
  }

  handleTypeChange = (event, value) => {
    value === 1
      ? this.props.formActions.initialize('questionForm', this.binaryForm)
      : this.props.formActions.initialize('questionForm', this.defaultForm)
  }



  validate = values => {
    const errors = {}
    if (!values.text) {
      errors.text = 'Required'
    }
    const answersArrayErrors = []
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
    return errors
  }

  render() {
    const options = [
      { value: 1, label: 'Binary' },
      // { value: '2, label: 'Category' },  //TODO: Enable when we implement category questions
      { value: 3, label: 'Checkboxes' },
      { value: 4, label: 'Multiple choice' },
      { value: 5, label: 'Text field' }
    ]
    const actions = [
      { value: 'Cancel', onClick: this.onCancel, type: 'button' },
      {
        value: this.questionDefined
          ? 'Save'
          : 'Add',
        type: 'submit',
        disabled: !!(this.props.form.asyncErrors || this.props.form.syncErrors)
      }
    ]
    return (
      <FormModal
        form="questionForm"
        handleSubmit={this.handleSubmit}
        initialValues={this.questionDefined || this.defaultForm}
        maxWidth='md'
        // enableReinitialize={true}
        // keepDirtyOnReinitialize={true}
        validate={this.validate}
        onClose={this.onCancel}>

        <Container column style={{ minWidth: 890, padding: '20px 20px 0 20px' }}>
          <Container column className={styles.dashed}>
            <ModalTitle title={this.state.edit ? 'Edit Question' : 'Add New Question'} />
            <ModalContent>
              <Container>
                <Column flex style={{ padding: '0 10px 20px 0' }}>
                  <Field
                    name="text"
                    component={TextInput}
                    label='Question'
                    multiline={true}
                    placeholder="Enter question"
                  />
                </Column>
                <Column>
                  <Field
                    name="questionType"
                    component={DropDown}
                    label="Type"
                    options={options}
                    defaultValue={4}
                    onChange={this.handleTypeChange}
                    disabled={this.state.edit ? true : false}
                  />
                </Column>
              </Container>
              <Container>
                <Row flex style={{ padding: '0 10px 20px 0' }}>
                  <Field
                    name="hint"
                    component={TextInput}
                    label="Question Hint"
                    placeholder="Enter hint"
                  />
                </Row>
              </Container>
              <FieldArray name="possibleAnswers"
                answerType={this.props.form.values ? this.props.form.values.questionType : 4}
                component={AnswerList}
              />
              <Container>
                <Row flex style={{ paddingLeft: '47px' }}>
                  <Field
                    name="includeComment"
                    label="Include comment box"
                    component={CheckboxLabel}
                  />
                </Row>
              </Container>
            </ModalContent>
          </Container>
          <ModalActions edit={this.state.edit} actions={actions} raised={true} style={{ paddingTop: 15, paddingBottom: 15, margin: 0 }}></ModalActions>
        </Container>
      </FormModal>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  form: state.form.questionForm || {},
  projectId: ownProps.match.params.id
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  formActions: bindActionCreators(formActions, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddEditQuestion))