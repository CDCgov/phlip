import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { default as formActions } from 'redux-form/lib/actions'
import { withRouter } from 'react-router'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import SearchBar from 'components/SearchBar'
import Button from 'components/Button'
import Container, { Column } from 'components/Layout'
import Card from 'components/Card'
import JurisdictionList from './components/JurisdictionList'
import * as actions from './actions'
import JurisdictionForm from './components/JurisdictionForm'
import moment from 'moment'
import api from 'services/api'
import { normalize } from 'utils'

export class AddEditJurisdictions extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      formOpen: false,
      edit: false,
      formJurisdiction: {}
    }
  }

  componentWillMount () {
    this.props.actions.getProjectJurisdictions(this.props.project.id)
  }

  onCloseModal = () => {
    this.props.actions.clearJurisdictions()
    this.props.history.goBack()
  }

  getButton = () => <Button onClick={() => this.onOpenForm(false)} value="+ Add Jurisdiction" color="accent" />

  onOpenForm = (edit, jurisdiction = {}) => {
    this.setState({
      formOpen: true,
      edit: edit,
      formJurisdiction: jurisdiction
    })
  }

  onSubmitForm = values => {
    const jurisdiction = {
      ...values,
      startDate: moment(values.startDate).toISOString(),
      endDate: moment(values.endDate).toISOString(),
      ...this.props.jurisdiction
    }

    if (this.state.edit) {
      this.props.actions.updateJurisdiction(jurisdiction, this.props.project.id)
    } else {
      this.props.actions.addJurisdiction(jurisdiction, this.props.project.id)
    }

    this.props.actions.updateEditedFields(this.props.project.id)

    this.setState({
      formOpen: false,
      edit: false,
      formJurisdiction: {}
    })

    this.props.actions.clearJurisdictions()
  }

  throwErrors = (values, out) => {
    if (out.length === 0) {
      throw { name: 'You must choose a pre-defined jurisdiction name.' }
    } else if (this.props.jurisdictions.includes(values.name)) {
      throw { name: 'This jurisdiction is already included in this project.' }
    } else if (out.length > 1) {
      throw { name: 'There are multiple jurisdictions that match this string. Please choose one from the list.' }
    } else {
      this.props.actions.onJurisdictionSelected(out[0])
      this.props.formActions.stopAsyncValidation('jurisdictionForm', { clear: true })
    }
  }

  validateJurisdiction = values => {
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

  onJurisdictionsFetchRequest = ({ value }) => {
    this.props.actions.searchJurisdictionList(value)
  }

  onCloseForm = () => {
    this.setState({
      formJurisdiction: {},
      formOpen: false,
      edit: false
    })
    this.props.actions.clearJurisdictions()
  }

  onJurisdictionSelected = (event, { suggestionValue }) => {
    this.props.formActions.stopAsyncValidation('jurisdictionForm', { clear: true })
    this.props.actions.onJurisdictionSelected(suggestionValue)
  }

  render () {
    return (
      <Modal onClose={this.onCloseModal} open={true} maxWidth="md" hideOverflow>
        <ModalTitle
          title="Jurisdictions"
          buttons={this.getButton()}
          editButton={false}
          closeButton={false}
          onCloseForm={this.onCloseModal}
          search
          SearchBarProps={{
            searchValue: this.props.searchValue,
            handleSearchValueChange: (event) => this.props.actions.updateSearchValue(event.target.value),
            placeholder: 'Search'
          }}
        />
        <ModalContent style={{ display: 'flex', flexDirection: 'column' }}>
          <Container flex style={{ marginTop: 20 }}>
            <Column flex displayFlex style={{ overflowX: 'auto' }} component={<Card />}>
              <JurisdictionList jurisdictions={this.props.visibleJurisdictions} onOpenForm={this.onOpenForm} />
            </Column>
          </Container>
        </ModalContent>
        <JurisdictionForm
          open={this.state.formOpen} edit={this.state.edit} jurisdiction={this.state.formJurisdiction}
          onHandleSubmit={this.onSubmitForm} onCloseForm={this.onCloseForm}
          onSearchList={this.onJurisdictionsFetchRequest} suggestions={this.props.suggestions}
          suggestionValue={this.props.suggestionValue}
          onClearSuggestions={this.props.actions.onClearSuggestions}
          onSuggestionValueChanged={event => this.props.actions.onSuggestionValueChanged(event.target.value)}
          onJurisdictionSelected={this.onJurisdictionSelected}
          asyncValidate={this.validateJurisdiction}
        />
      </Modal>
    )
  }
}

AddEditJurisdictions.propTypes = {
  project: PropTypes.object,
  visibleJurisdictions: PropTypes.array,
  searchValue: PropTypes.string,
  suggestions: PropTypes.array,
  suggestionValue: PropTypes.string,
  jurisdiction: PropTypes.object
}

const mapStateToProps = (state, ownProps) => ({
  project: state.scenes.home.main.projects.byId[ownProps.match.params.id],
  visibleJurisdictions: state.scenes.home.addEditJurisdictions.visibleJurisdictions || [],
  searchValue: state.scenes.home.addEditJurisdictions.searchValue || '',
  suggestions: state.scenes.home.addEditJurisdictions.suggestions || [],
  suggestionValue: state.scenes.home.addEditJurisdictions.suggestionValue || '',
  jurisdiction: state.scenes.home.addEditJurisdictions.jurisdiction || {},
  jurisdictions: normalize.mapArray(Object.values(state.scenes.home.addEditJurisdictions.jurisdictions.byId), 'name') ||
  []
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  formActions: bindActionCreators(formActions, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddEditJurisdictions))
