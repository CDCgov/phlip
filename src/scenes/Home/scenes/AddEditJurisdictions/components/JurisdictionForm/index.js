import React from 'react'
import PropTypes from 'prop-types'
import Divider from 'material-ui/Divider'
import FormModal from 'components/FormModal'
import { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import Container, { Row, Column } from 'components/Layout'
import { Field } from 'redux-form'
import TextInput from 'components/TextInput'
import * as actions from '../../actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { validateRequired, validateDate, validateDateRanges } from 'utils/formHelpers'
import DatePicker from 'components/DatePicker'

export const JurisdictionForm = ({ open, edit, jurisdiction, onHandleSubmit, onCloseForm, form, actions }) => {
  const formActions = [
    { value: 'Cancel', onClick: onCloseForm, type: 'button' },
    {
      value: edit
        ? 'Save'
        : 'Add',
      type: 'submit',
      disabled: !!(form.syncErrors)
    }
  ]

  return (
    <FormModal
      form="jurisdictionForm"
      handleSubmit={onHandleSubmit}
      initialValues={edit ? jurisdiction : {}}
      asyncBlurFields={['name']}
      width="600px" height="400px"
      validate={validateDateRanges}
      open={open}
    >
      <ModalTitle title={edit ? 'Edit Jurisdiction' : 'Add Jurisdiction'} closeButton={true}
                  onCloseForm={onCloseForm} />
      <Divider />
      <ModalContent>
        <Container column style={{ minWidth: 550, minHeight: 230, padding: '30px 15px' }}>
          <Row style={{ paddingBottom: 20 }}>
            <Field component={TextInput} label="Name" name="name" validate={validateRequired}
                   placeholder="Enter jurisdiction name" />
          </Row>
          <Container style={{ marginTop: 30 }}>
            <Column flex>
              <Field component={DatePicker} name="startDate" invalidLabel="mm/dd/yyyy" label="Start Date"
                   dateFormat="MM/DD/YYYY" validate={validateDate} />
            </Column>
            <Column>
              <Field component={DatePicker} name="endDate" invalidLabel="mm/dd/yyyy" label="End Date"
                     dateFormat="MM/DD/YYYY" validate={validateDate} />
            </Column>
          </Container>
        </Container>
      </ModalContent>
      <ModalActions edit={true} actions={formActions}></ModalActions>
    </FormModal>
  )
}

JurisdictionForm.propTypes = {
  open: PropTypes.bool,
  edit: PropTypes.bool,
  jurisdiction: PropTypes.object
}

const mapStateToProps = (state) => ({
  form: state.form.jurisdictionForm || {}
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(JurisdictionForm)