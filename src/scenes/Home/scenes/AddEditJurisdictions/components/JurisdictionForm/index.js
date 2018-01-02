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
import Autosuggest from 'react-autosuggest'
import Paper from 'material-ui/Paper'
import { withStyles } from 'material-ui/styles'
import { MenuItem } from 'material-ui/Menu'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'

const renderInput = ({ autoFocus, value, ref, ...other }) => {
  return (
    <TextInput
      label="Name" placeholder="Enter jurisdiction name" autoFocus={autoFocus} inputRef={ref}
      value={value} {...other}
    />
  )
}

const renderSuggestionsContainer = (options) => {
  const { containerProps, children } = options

  return (
    <Paper {...containerProps} style={{ zIndex: '10000' }} square>
      {children}
    </Paper>
  )
}

const getSuggestionValue = (suggestion) => {
  return suggestion.name
}

const renderSuggestion = (suggestion, { query, isHighlighted }) => {
  const matches = match(suggestion.name, query)
  const parts = parse(suggestion.name, matches)

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

const classes = theme => ({
  suggestionsContainerOpen: {
    width: 500,
    position: 'absolute',
    maxHeight: 500,
    overflow: 'auto',
    '& div:last-child': {
      borderBottom: 'none'
    }
  },
  suggestion: {
    display: 'block'
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    overflow: 'auto'
  },
  sectionContainer: {
    margin: '0 10px',
    borderBottom: `1px dashed ${theme.palette.primary['600']}`
  }
})

export const JurisdictionForm = ({ open, onClearSuggestions, onJurisdictionSelected, classes, edit, jurisdiction, suggestions, onSearchList, onSuggestionValueChanged, suggestionValue, onHandleSubmit, onCloseForm, form, actions }) => {
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
            <Autosuggest
              theme={{
                container: classes.container,
                suggestionsContainerOpen: classes.suggestionsContainerOpen,
                suggestionsList: classes.suggestionsList,
                suggestion: classes.suggestion,
                sectionContainer: classes.sectionContainer
              }}
              suggestions={suggestions}
              onSuggestionsFetchRequested={onSearchList}
              onSuggestionsClearRequested={onClearSuggestions}
              renderSuggestionsContainer={renderSuggestionsContainer}
              renderInputComponent={renderInput}
              inputProps={{
                value: suggestionValue,
                onChange: onSuggestionValueChanged,
                id: 'jurisdiction-name',
                disabled: edit
              }}
              onSuggestionSelected={onJurisdictionSelected}
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
  jurisdiction: PropTypes.object
}

const mapStateToProps = (state) => ({
  form: state.form.jurisdictionForm || {},
  suggestions: state.scenes.home.addEditJurisdictions.suggestions || [],
  suggestionValue: state.scenes.home.addEditJurisdictions.suggestionValue || ''
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(classes)(JurisdictionForm))