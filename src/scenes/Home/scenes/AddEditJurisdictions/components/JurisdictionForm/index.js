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
import MultiSelectDropdown from 'components/MultiSelectDropdown'

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
      selectedPresets: []
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
        //this.props.history.goBack()
      }
    }
  }

  componentWillUnmount() {
    this.props.actions.onClearSuggestions()
  }

  onSubmitPreset = values => {
    const jurisdiction = {
      startDate: moment(values.startDate).toISOString(),
      endDate: moment(values.endDate).toISOString(),
      tag: this.state.selectedPresets.join()
    }

    this.setState({
      submitting: true
    })

    this.props.actions.addPresetJurisdictionRequest(jurisdiction, this.props.project.id)
  }

  onSubmitForm = values => {
    const jurisdiction = {
      ...values,
      startDate: moment(values.startDate).toISOString(),
      endDate: moment(values.endDate).toISOString(),
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

  onSelectPreset = event => {
    this.setState({
      selectedPresets: event.target.value
    })
  }

  getNameInputField = () => {
    if (this.props.location.state.preset === true) {
      const options = [
        { value: 'US States', label: 'US States', checked: false }
        //{ value: 'Counties', label: 'Counties', checked: false }
      ]

      return (
        <Field
          name="name"
          component={MultiSelectDropdown}
          validate={validateRequiredArray}
          defaultValue={[]}
          label="Preset Type"
          selected={this.state.selectedPresets}
          onChange={this.onSelectPreset}
          placeholder="Choose lists to load"
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

  validateMinDate = value => moment(value).year() < '1850' ? 'Minimum year for start date is 1850' : undefined
  validateMaxDate = value => moment(value).year() > '2050' ? 'Maximum year for end date is 2050' : undefined

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
        { name: this.props.location.state.preset === true ? [] : '', startDate: new Date(), endDate: new Date() }}
        asyncValidate={(this.state.edit || this.props.location.state.preset === true)
          ? null
          : this.validateJurisdiction}
        asyncBlurFields={this.props.location.state.preset === true ? [] : ['name']}
        width="600px" height="400px"
        validate={validateDateRanges}
        open={true}
        onClose={this.props.onCloseModal}
      >
        <ModalTitle
          title={this.state.edit ? 'Edit Jurisdiction' : this.props.location.state.preset === true
            ? 'Load Preset Jurisdiction List'
            : 'Add Jurisdiction'} closeButton onCloseForm={this.onCloseForm} />
        <Divider />
        <ModalContent>
          <Container column style={{ minWidth: 550, minHeight: 230, padding: '30px 15px' }}>
            <Row style={{ paddingBottom: 20 }}>
              {this.getNameInputField()}
            </Row>
            <Container style={{ marginTop: 30 }}>
              <Column flex>
                <Field
                  component={DatePicker}
                  required
                  name="startDate"
                  label="Segment Start Date"
                  dateFormat="MM/DD/YYYY"
                  validate={this.validateMinDate}
                  minDate={new Date(1850, 1, 1)}
                  maxDate={new Date(2050, 1, 1)}
                  autoOk={true}
                />
              </Column>
              <Column>
                <Field
                  component={DatePicker}
                  required
                  name="endDate"
                  label="Segment End Date"
                  dateFormat="MM/DD/YYYY"
                  validate={this.validateMaxDate}
                  minDate={new Date(1850, 1, 1)}
                  maxDate={new Date(2050, 1, 1)}
                  autoOk={true}
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