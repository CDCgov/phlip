import React from 'react'
import PropTypes from 'prop-types'
import Divider from 'material-ui/Divider'
import { MenuItem } from 'material-ui/Menu'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'
import { Field } from 'redux-form'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import FormModal from 'components/FormModal'
import { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import Container, { Row, Column } from 'components/Layout'
import * as actions from '../../actions'
import { validateRequired, validateDate, validateDateRanges } from 'utils/formHelpers'
import DatePicker from 'components/DatePicker'
import Autocomplete from 'components/Autocomplete'

const getSuggestionValue = suggestion => suggestion

const renderSuggestion = (suggestion, { query, isHighlighted }) => {
  const matches = match(suggestion, query)
  const parts = parse(suggestion, matches)

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </strong>
          )
        })}
      </div>
    </MenuItem>
  )
}

export const JurisdictionForm = props => {
  const {
    open,
    edit,
    jurisdiction,
    suggestions,
    suggestionValue,
    form,
    asyncValidate,
    onClearSuggestions,
    onJurisdictionSelected,
    onSearchList,
    onSuggestionValueChanged,
    onHandleSubmit,
    onCloseForm
  } = props

  const formActions = [
    { value: 'Cancel', onClick: onCloseForm, type: 'button' },
    {
      value: edit
        ? 'Save'
        : 'Add',
      type: 'submit',
      disabled: Boolean(form.syncErrors || (form.asyncErrors ? form.asyncErrors.name : false))
    }
  ]

  return (
    <FormModal
      form="jurisdictionForm"
      handleSubmit={onHandleSubmit}
      initialValues={edit ? jurisdiction : {}}
      asyncValidate={edit ? null : asyncValidate}
      asyncBlurFields={['name']}
      width="600px" height="400px"
      validate={validateDateRanges}
      open={open}
    >
      <ModalTitle title={edit ? 'Edit Jurisdiction' : 'Add Jurisdiction'} closeButton onCloseForm={onCloseForm} />
      <Divider />
      <ModalContent>
        <Container column style={{ minWidth: 550, minHeight: 230, padding: '30px 15px' }}>
          <Row style={{ paddingBottom: 20 }}>
            <Field
              name="name"
              component={Autocomplete}
              validate={validateRequired}
              suggestions={suggestions}
              handleGetSuggestions={onSearchList}
              handleClearSuggestions={onClearSuggestions}
              inputProps={{
                value: edit ? jurisdiction.name : suggestionValue,
                onChange: onSuggestionValueChanged,
                id: 'jurisdiction-name',
                disabled: edit,
                label: 'Name',
                placeholder: 'Enter jurisdiction name',
              }}
              handleSuggestionSelected={onJurisdictionSelected}
              renderSuggestion={renderSuggestion}
              getSuggestionValue={getSuggestionValue}
            />
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
  jurisdiction: PropTypes.object,
  suggestions: PropTypes.array,
  suggestionValue: PropTypes.string,
  form: PropTypes.object,
  onClearSuggestions: PropTypes.func,
  onJurisdictionSelected: PropTypes.func,
  onSearchList: PropTypes.func,
  onSuggestionValueChanged: PropTypes.func,
  onHandleSubmit: PropTypes.func,
  onCloseForm: PropTypes.func
}

const mapStateToProps = (state) => ({
  form: state.form.jurisdictionForm || {}
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(JurisdictionForm)