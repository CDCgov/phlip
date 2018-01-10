import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Container, { Row, Column } from 'components/Layout'
import FormModal from 'components/FormModal'
import TextInput from 'components/TextInput'
import DropDown from 'components/Dropdown'
import { withRouter } from 'react-router'
import * as actions from './actions'
import Modal, { ModalTitle, ModalActions, ModalContent } from 'components/Modal'
import { Field } from 'redux-form'
import AnswerList from './components/AnswerList'
import CheckboxLabel from 'components/CheckboxLabel'

export class AddEditQuestion extends Component {
  constructor(props, context) {
    super(props, context)
    this.onCancel = this.onCancel.bind(this)
  }

  onCancel() {
    this.props.history.goBack()
  }

  handleSubmit = values => {
    this.props.actions.addQuestionRequest(values, 10002)
    this.props.history.goBack()
  }


  render() {

    const mockAnswers = [
      { id: 1, text: 'One' },
      { id: 2, text: 'Two' },
      { id: 3, text: 'Three' },
    ]

    const types = [
      { value: 'binary', label: 'Binary' },
      { value: 'cat', label: 'Category' },
      { value: 'cb', label: 'Checkboxes' },
      { value: 'mc', label: 'Multiple choice' },
      { value: 'text', label: 'Text field' }
    ]
    const formActions = [
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
      <FormModal form="questionForm"
        handleSubmit={this.handleSubmit}
        maxWidth='md'>
        <Container column style={{ minWidth: 890, padding: '20px' }}>
          <Container column style={{ minWidth: 600, minHeight: 230, borderStyle: 'dashed', borderColor: '#99D0E9', backgroundColor: '#E2F2F1' }}>
            <ModalTitle title='New Question' />
            <ModalContent>
              <Container>
                <Column flex style={{ padding: '0 10px 10px 0' }}>
                  <Field
                    name="questionBody"
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
                    options={types}
                    defaultValue=""
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

              <AnswerList answers={mockAnswers} />

              <Container>
                <CheckboxLabel label='Include comment box' />
              </Container>
            </ModalContent>
          </Container>
          <ModalActions edit={true} actions={formActions} raised={true}></ModalActions>
        </Container>
      </FormModal>
    )
  }
}

const mapStateToProps = (state) => ({
  form: state.form.questionForm || {}
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
})


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddEditQuestion))