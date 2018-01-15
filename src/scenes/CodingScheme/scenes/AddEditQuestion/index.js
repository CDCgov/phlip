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
import AnswerSwitch from './components/AnswerSwitch'

export class AddEditQuestion extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      edit: false,
      defaultForm: {
        type: 4,
        possibleAnswers: [{ text: '' }],
        includeComment: false
      }
    }
    this.onCancel = this.onCancel.bind(this)
    // this.defaultForm = {
    //   type: 4,
    //   answers: [{ id: 1, text: '' }],
    //   includeComment: false
    // }
  }

  onCancel() {
    this.props.formActions.reset('questionForm')
    this.props.history.goBack()
  }

  handleSubmit = values => {
    this.props.actions.addQuestionRequest(values, this.props.projectId)
    this.props.history.goBack()
  }

  handleTypeChange() {
    // console.log(this.props)
    // switch (this.props.form.values.type) {
    //   case 1:
    //     this.defaultForm = {
    //       type: 1,
    //       answers: [{ id: 1, text: '' }, { id: 2, text: '' }],
    //       includeComment: false
    //     }
    //     break;
    //   default:

    // }
  }

  render() {


    const options = [
      { value: 1, label: 'Binary' },
      // { value: '2, label: 'Category' },
      { value: 3, label: 'Checkboxes' },
      { value: 4, label: 'Multiple choice' },
      { value: 5, label: 'Text field' }
    ]
    const actions = [
      { value: 'Cancel', onClick: this.onCancel, type: 'button' },
      {
        value: false
          ? 'Save'
          : 'Add',
        type: 'submit',
        // disabled: Boolean(form.syncErrors || (form.asyncErrors ? form.asyncErrors.name : false))
      }
    ]
    return (
      <FormModal
        form="questionForm"
        handleSubmit={this.handleSubmit}
        initialValues={this.state.edit ? question : this.state.defaultForm}
        maxWidth='md'
        enableReinitialize >
        <Container column style={{ minWidth: 890, padding: '20px' }}>
          <Container column className={styles.dashed}>
            <ModalTitle title={this.state.edit ? 'Edit Question' : 'Add Question'} />
            <ModalContent>
              <Container>
                <Column flex style={{ padding: '0 10px 10px 0' }}>
                  <Field
                    name="text"
                    component={TextInput}
                    label='Question'
                    multiline={true}
                    placeholder="Enter question"
                  />
                </Column>
                <Column >
                  <Field
                    name="type"
                    component={DropDown}
                    label="Type"
                    options={options}
                    disabled={this.state.edit ? true : false}
                  />
                </Column>
              </Container>
              <Container>
                <Row flex>
                  <Field
                    name="hint"
                    component={TextInput}
                    label="Question Hint"
                    placeholder="Enter hint"
                  />
                </Row>
              </Container>
              <FieldArray name="possibleAnswers" answerType={this.props.form.values ? this.props.form.values.type : 1} component={AnswerList} />
              <Container>
                <Field
                  name='includeComment'
                  label='Include comment box'
                  component={CheckboxLabel}
                />
              </Container>
            </ModalContent>
          </Container>
          <ModalActions edit={true} actions={actions} raised={true}></ModalActions>
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