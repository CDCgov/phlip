import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Divider from 'material-ui/Divider'
import { MenuItem } from 'material-ui/Menu'
import { withRouter } from 'react-router'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'
import { Field } from 'redux-form'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import FormModal from 'components/FormModal'
import { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import Container, { Row, Column } from 'components/Layout'
import * as actions from '../../actions'
import { validateRequired, validateRequiredArray, validateDate, validateDateRanges } from 'utils/formHelpers'
import DatePicker from 'components/DatePicker'
import Autocomplete from 'components/Autocomplete'
import { default as formActions } from 'redux-form/lib/actions'
import withFormAlert from 'components/withFormAlert'
import moment from 'moment'
import api from 'services/api'
import { normalize } from 'utils'
import Dropdown from 'components/Dropdown'

const getSuggestionValue = suggestion => suggestion

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

export class JurisdictionForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    formName: PropTypes.string,
    jurisdiction: PropTypes.object,
    jurisdictions: PropTypes.array,
    suggestions: PropTypes.array,
    suggestionValue: PropTypes.string,
    actions: PropTypes.object,
    formActions: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object,
    history: PropTypes.object,
    onCloseModal: PropTypes.func,
    formError: PropTypes.string,
    goBack: PropTypes.bool
  }

  constructor(props, context) {
    super(props, context)
    this.jurisdictionDefined = this.props.location.state.jurisdictionDefined !== undefined
      ? props.location.state.jurisdictionDefined
      : null

    this.state = {
      edit: this.jurisdictionDefined !== null,
      submitting: false,
      endDate: this.jurisdictionDefined ? this.jurisdictionDefined.endDate : new Date(),
      startDate: this.jurisdictionDefined ? this.jurisdictionDefined.startDate : new Date(),
      errors: {}
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.submitting === true) {
      if (nextProps.formError !== null) {
        this.setState({
          submitting: false
        })
        this.props.onSubmitError(nextProps.formError)
      } else if (nextProps.goBack === true) {
        this.props.history.push(`/project/${this.props.project.id}/jurisdictions`)
      }
    }
  }

  componentWillUnmount() {
    this.props.actions.onClearSuggestions()
  }

  onSubmitPreset = values => {
    const jurisdiction = {
      startDate: moment(this.state.startDate).toISOString(),
      endDate: moment(this.state.endDate).toISOString(),
      tag: values.name
    }

    this.setState({
      submitting: true
    })

    this.props.actions.addPresetJurisdictionRequest(jurisdiction, this.props.project.id)
  }

  onSubmitForm = values => {
    if (Object.values(this.state.errors).length === 0) {
      const jurisdiction = {
        ...values,
        startDate: moment(this.state.startDate).toISOString(),
        endDate: moment(this.state.endDate).toISOString(),
        jurisdictionId: this.props.jurisdiction.id
      }

      this.setState({
        submitting: true
      })

      if (this.state.edit) {
        this.props.actions.updateJurisdiction(jurisdiction, this.props.project.id)
      } else {
        this.props.actions.addJurisdiction(jurisdiction, this.props.project.id)
      }
    }
  }

  throwErrors = (values, out) => {
    if (out.length === 0) {
      throw { name: 'You must choose a pre-defined jurisdiction name.' }
    } else if (out.length > 1) {
      throw { name: 'There are multiple jurisdictions that match this string. Please choose one from the list.' }
    } else {
      this.props.actions.onJurisdictionSelected(out[0])
      this.props.formActions.stopAsyncValidation('jurisdictionForm', { clear: true })
    }
  }

  validateJurisdiction = values => {
    if (values.hasOwnProperty('name')) {
      const updatedValues = { ...values, name: values.name.trim() }
      const prom = new Promise(resolve => resolve(api.searchJurisdictionList(updatedValues.name)))
      return prom.then(out => {
        if (!this.state.edit) {
          if (!this.props.jurisdiction) {
            this.throwErrors(updatedValues, out)
          } else if (this.props.jurisdiction && this.props.jurisdiction.name !== updatedValues.name) {
            this.throwErrors(updatedValues, out)
          } else {
            this.props.formActions.stopAsyncValidation('jurisdictionForm', { clear: true })
          }
        }
      })
    }
  }

  onJurisdictionsFetchRequest = ({ value }) => {
    this.props.actions.searchJurisdictionList(value)
  }

  onCloseForm = () => {
    this.props.actions.onClearSuggestions()
    this.props.actions.onSuggestionValueChanged('')
    this.props.history.goBack()
  }

  onJurisdictionSelected = (event, { suggestionValue }) => {
    this.props.formActions.stopAsyncValidation('jurisdictionForm', { clear: true })
    this.props.actions.onJurisdictionSelected(suggestionValue)
  }

  onSuggestionChange = event => {
    this.props.actions.onSuggestionValueChanged(event.target.value)
  }

  onClearSuggestions = () => {
    this.props.actions.onClearSuggestions()
  }

  getNameInputField = () => {
    if (this.props.location.state.preset === true) {
      const options = [
        { value: 'US States', label: 'US States' }
        //{ value: 'Counties', label: 'Counties' }
      ]

      return (
        <Field
          name="name"
          component={Dropdown}
          id="preset-type"
          defaultValue="US States"
          validate={validateRequired}
          label="Preset Type"
          options={options}
          required
        />
      )
    } else {
      return (
        <Field
          name="name"
          component={Autocomplete}
          validate={validateRequired}
          suggestions={this.props.suggestions}
          handleGetSuggestions={this.onJurisdictionsFetchRequest}
          handleClearSuggestions={this.onClearSuggestions}
          inputProps={{
            value: this.state.edit ? this.jurisdictionDefined.name : this.props.suggestionValue,
            onChange: this.onSuggestionChange,
            id: 'jurisdiction-name',
            disabled: this.state.edit,
            label: 'Name',
            placeholder: 'Enter jurisdiction name',
            required: true
          }}
          handleSuggestionSelected={this.onJurisdictionSelected}
          renderSuggestion={renderSuggestion}
          getSuggestionValue={getSuggestionValue}
        />
      )
    }
  }

  validateMinDate = value => {
    let errors = { ...this.state.errors }

    if (value === undefined || value === '' || value === null) {
      errors['startDate'] = 'Required'
    } else {
      errors['startDate'] = ''
    }

    if (new Date(value).getFullYear() < '1850') {
      errors['startDate'] = 'Minimum year for start date is 1850'
    } else if (new Date(value).getFullYear() > '2050') {
      errors['startDate'] = 'Maximum year for start date is 2050'
    } else {
      const rangeErrors = validateDateRanges({ ...this.state, startDate: value }, errors)
      errors = { ...rangeErrors }
    }

    this.setState({ errors })
  }

  validateMaxDate = value => {
    let errors = { ...this.state.errors }

    if (value === undefined || value === '' || value === null) {
      errors['endDate'] = 'Required'
    } else {
      errors['endDate'] = ''
    }

    if (new Date(value).getFullYear() > '2050') {
      errors['endDate'] = 'Maximum year for end date is 2050'
    } else if (new Date(value).getFullYear() < '1850') {
      errors['endDate'] = 'Minimum year for end date is 1850'
    } else {
      const rangeErrors = validateDateRanges({ ...this.state, endDate: value }, errors)
      errors = { ...rangeErrors }
    }

    this.setState({ errors })
  }

  onChangeDate = dateField => event => {
    if (event.format() === 'Invalid date') {
      this.setState({ [dateField]: '' })
      if (dateField === 'startDate') this.validateMinDate('')
      else this.validateMaxDate('')
    } else {
      this.setState({ [dateField]: new Date(event) })
      if (dateField === 'startDate') this.validateMinDate(event)
      else this.validateMaxDate(event)
    }
  }

  render() {
    const formActions = [
      { value: 'Cancel', onClick: this.onCloseForm, type: 'button', otherProps: { 'aria-label': 'Close form' } },
      {
        value: this.state.edit
          ? 'Save'
          : 'Add',
        type: 'submit',
        disabled: false,
        otherProps: { 'aria-label': 'Save form' }
      }
    ]

    return (
      <FormModal
        form="jurisdictionForm"
        handleSubmit={this.props.location.state.preset === true ? this.onSubmitPreset : this.onSubmitForm}
        initialValues={this.jurisdictionDefined ||
        { name: this.props.location.state.preset ? 'US States' : '', startDate: new Date(), endDate: new Date() }}
        asyncValidate={(this.state.edit || this.props.location.state.preset === true)
          ? null
          : this.validateJurisdiction}
        asyncBlurFields={this.props.location.state.preset === true ? [] : ['endDate', 'startDate']}
        width="600px"
        height="400px"
        validate={validateDateRanges}
        open={true}
        onClose={() => this.props.onCloseModal({ endDate: this.state.endDate, startDate: this.state.startDate })}>
        <ModalTitle
          title={this.state.edit
            ? 'Edit Jurisdiction' : this.props.location.state.preset === true
              ? 'Load Preset Jurisdiction List'
              : 'Add Jurisdiction'
          }
          onCloseForm={this.onCloseForm}
        />
        <Divider />
        <ModalContent>
          <Container column style={{ minWidth: 550, minHeight: 230, padding: '30px 15px' }}>
            <Row style={{ paddingBottom: 20 }}>
              {this.getNameInputField()}
            </Row>
            <Container style={{ marginTop: 30 }}>
              <Column flex>
                <DatePicker
                  required
                  name="startDate"
                  label="Segment Start Date"
                  dateFormat="MM/DD/YYYY"
                  minDate="01/01/1850"
                  maxDate="12/31/2050"
                  onChange={this.onChangeDate('startDate')}
                  value={this.state.startDate}
                  autoOk={true}
                  error={this.state.errors.startDate}
                />
              </Column>
              <Column>
                <DatePicker
                  required
                  name="endDate"
                  label="Segment End Date"
                  dateFormat="MM/DD/YYYY"
                  minDate="01/01/1850"
                  maxDate="12/31/2050"
                  value={this.state.endDate}
                  onChange={this.onChangeDate('endDate')}
                  autoOk={true}
                  error={this.state.errors.endDate}
                />
              </Column>
            </Container>
          </Container>
        </ModalContent>
        <button style={{ display: 'none' }} type="submit" onClick={event => event.preventDefault()}></button>
        <ModalActions actions={formActions}></ModalActions>
      </FormModal>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  project: state.scenes.home.main.projects.byId[ownProps.match.params.id],
  form: state.form.jurisdictionForm || {},
  formName: 'jurisdictionForm',
  suggestions: state.scenes.home.addEditJurisdictions.suggestions || [],
  suggestionValue: state.scenes.home.addEditJurisdictions.suggestionValue || '',
  jurisdiction: state.scenes.home.addEditJurisdictions.jurisdiction || {},
  jurisdictions: normalize.mapArray(Object.values(state.scenes.home.addEditJurisdictions.jurisdictions.byId), 'name') ||
  [],
  formError: state.scenes.home.addEditJurisdictions.formError || null,
  goBack: state.scenes.home.addEditJurisdictions.goBack || false
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  formActions: bindActionCreators(formActions, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withFormAlert(JurisdictionForm)))