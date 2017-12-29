import React from 'react'
import PropTypes from 'prop-types'
import Divider from 'material-ui/Divider'
import FormModal from 'components/FormModal'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import Container, { Row } from 'components/Layout'
import { Field } from 'redux-form'
import TextInput from 'components/TextInput'
import * as actions from '../../actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { validateRequired } from 'utils/helpers'
import DatePicker from 'components/DatePicker'
import Icon from 'components/Icon'

export const JurisdictionForm = ({ open, edit, jurisdiction, onHandleSubmit, onCloseForm, form, actions }) => {
  const formActions = [
    { value: 'Cancel', onClick: onCloseForm, type: 'button' },
    {
      value: edit
        ? 'Save'
        : 'Add',
      type: 'submit',
      disabled: !!(form.errors)
    }
  ]

  return (
    <Modal open={open}>
      <form onSubmit={onHandleSubmit}>
        <ModalTitle title={edit ? 'Edit Jurisdiction' : 'Add Jurisdiction'} closeButton={true}
                    onCloseForm={onCloseForm} />
        <Divider />
        <ModalContent>
          <Container column style={{ width: 500, minHeight: 230, padding: '30px 15px' }}>
            <Row style={{ paddingBottom: 20 }}>
              <TextInput label="Name" placeholder="Enter jurisdiction name" name="name"
                         onChange={(event) => actions.onChangeForm('name', event.target.value)} />
            </Row>
            <Row>
              <DatePicker value={form.startDate} name="startDate" label="Start Date"
                          format="MM/DD/YYYY" onChange={(event) => actions.onChangeForm('startDate', event) } />
            </Row>
          </Container>
        </ModalContent>
        <ModalActions edit={true} actions={formActions}></ModalActions>
      </form>
    </Modal>
  )
}

JurisdictionForm.propTypes = {
  open: PropTypes.bool,
  edit: PropTypes.bool,
  jurisdiction: PropTypes.object
}

const mapStateToProps = (state) => ({
  form: state.scenes.home.addEditJurisdictions || {}
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(JurisdictionForm)