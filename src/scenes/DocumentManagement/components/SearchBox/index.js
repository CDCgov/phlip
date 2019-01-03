import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FlexGrid, Button, Icon, DatePicker, Typography, Autocomplete } from 'components'
import SearchBar from 'components/SearchBox'
import TextField from '@material-ui/core/TextField'
import ButtonBase from '@material-ui/core/ButtonBase'
import { Manager, Reference, Popper } from 'react-popper'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import actions, { jurisdictionAutocomplete, projectAutocomplete } from './actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'
import { AccountBox, Alphabetical, City, Clipboard, CalendarBlank } from 'mdi-material-ui'

export class SearchBox extends Component {
  static propTypes = {
    form: PropTypes.object,
    searchValue: PropTypes.string,
    projectSuggestions: PropTypes.array,
    jurisdictionSuggestions: PropTypes.array,
    projectSearchValue: PropTypes.string,
    jurisdictionSearchValue: PropTypes.string,
    actions: PropTypes.object
  }

  constructor(props, context) {
    super(props, context)
    this.buttonRef = null
  }

  componentWillUnmount() {
    this.clearForm()
    this.props.actions.clearSearchString()
  }

  state = {
    isFocused: false,
    showFilterForm: false,
    datePickerOpen: false
  }

  handleFocusChange = focused => {
    this.setState({
      isFocused: focused,
      showFilterForm: false
    })
  }

  handleFormValueChange = (property, value) => {
    this.props.actions.updateFormValue(property, value)
  }

  handleSearchFieldChange = e => {
    if (e.target.value === '') {
      this.clearForm()
    }
    this.props.actions.updateSearchValue(e.target.value, this.props.form)
  }

  handleGetSuggestions = (suggestionType, index = null) => ({ value: searchString }) => {
    suggestionType === 'project'
      ? this.props.actions.projectAutocomplete.searchForSuggestionsRequest(searchString, '_MAIN')
      : this.props.actions.jurisdictionAutocomplete.searchForSuggestionsRequest(searchString, '_MAIN', index)
  }

  handleSuggestionSelected = (suggestionType) => (event, { suggestionValue }) => {
    suggestionType === 'project'
      ? this.props.actions.updateFormValue('project', suggestionValue)
      : this.props.actions.updateFormValue('jurisdiction', suggestionValue)
  }

  handleAutocompleteSearchValueChange = (suggestionType, value) => {
    suggestionType === 'jurisdiction'
      ? this.props.actions.jurisdictionAutocomplete.updateSearchValue(value)
      : this.props.actions.projectAutocomplete.updateSearchValue(value)
  }

  handleClearSuggestions = suggestionType => () => {
    suggestionType === 'jurisdiction'
      ? this.props.actions.jurisdictionAutocomplete.clearSuggestions()
      : this.props.actions.projectAutocomplete.clearSuggestions()
  }

  handleSearchFormSubmit = () => {
    const searchString = this.buildSearchFilter()
    this.props.actions.updateSearchValue(searchString, this.props.form)
    this.handleToggleForm()
  }

  handleClickAway = e => {
    if (!this.state.datePickerOpen) {
      this.clearForm()
      if (e.path[1] !== this.buttonRef) {
        this.handleToggleForm(e)
      }
    }
  }

  clearForm = () => {
    this.props.actions.clearForm()
    this.props.actions.projectAutocomplete.clearAll()
    this.props.actions.jurisdictionAutocomplete.clearAll()
  }

  handleToggleForm = () => {
    this.setState({
      showFilterForm: !this.state.showFilterForm
    })
  }

  buildSearchFilter = () => {
    const params = ['name', 'uploadedBy', 'uploadedDate']

    let searchTerms = []
    params.forEach((key, index) => {
      if (this.props.form[key] !== '') {
        let p = this.props.form[key]
        if (key === 'uploadedDate') {
          p = moment.utc(p).local().format('M/D/YYYY')
        }
        searchTerms.push(key.concat(':', p))
      }
    })

    if (this.props.form.project.id !== null) {
      searchTerms.push(`project:${this.props.form.project.name}`)
    }

    if (this.props.form.jurisdiction.id !== null) {
      searchTerms.push(`jurisdiction:${this.props.form.jurisdiction.name}`)
    }

    return searchTerms.join(' | ')
  }

  handleOpenDatePicker = () => {
    this.setState({
      datePickerOpen: true
    })
  }

  handleCloseDatePicker = () => {
    this.setState({
      datePickerOpen: false
    })
  }

  render() {
    const {
      form: {
        uploadedDate,
        uploadedBy,
        name
      },
      searchValue,
      projectSuggestions,
      jurisdictionSuggestions,
      projectSearchValue,
      jurisdictionSearchValue
    } = this.props

    const iconColor = '#949494'

    const boxStyle = {
      backgroundColor: 'white',
      borderRadius: this.state.showFilterForm ? '5px 5px 0 0' : '5px',
      border: `1px solid rgba(${189}, ${189}, ${189}, ${.33}`,
      display: 'flex',
      alignItems: 'center',
      padding: 5,
      flex: 1,
      boxShadow: this.state.isFocused
        ? '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)'
        : 'none'
    }

    const formRowStyles = {
      marginBottom: 20
    }

    const formRowFontStyles = {
      color: '#5f6368',
      letterSpacing: .2,
      fontWeight: 300,
      paddingLeft: 5,
      fontSize: 13,
      width: '25%',
      maxWidth: '25%'
    }

    const inputProps = {
      style: {
        padding: 0
      }
    }

    return (
      <Manager>
        <Reference>
          {({ ref }) => {
            return (
              <div ref={ref} style={boxStyle}>
                <SearchBar
                  placeholder="Search documents"
                  fullWidth
                  searchValue={searchValue}
                  handleSearchValueChange={this.handleSearchFieldChange}
                  searchIcon="search"
                  InputProps={{
                    onFocus: () => this.handleFocusChange(true),
                    onBlur: () => this.handleFocusChange(false),
                    inputProps: { style: { fontSize: 15, padding: 0 } }
                  }}
                />
                <ButtonBase buttonRef={node => this.buttonRef = node} disableRipple onClick={this.handleToggleForm}>
                  <Icon color={iconColor}>arrow_drop_down</Icon>
                </ButtonBase>
              </div>
            )
          }}
        </Reference>
        <Popper
          placement="bottom-start"
          eventsEnabled={this.state.showFilterForm}
          style={{ pointerEvents: this.state.showFilterForm ? 'auto' : 'none' }}>
          {({ placement, ref, style }) => {
            return (
              this.state.showFilterForm &&
              <ClickAwayListener onClickAway={this.handleClickAway}>
                <div data-placement={placement} style={{ ...style, width: '100%', zIndex: 5 }} ref={ref}>
                  <FlexGrid container type="column" padding={24} raised>
                    <FlexGrid container type="row" style={formRowStyles}>
                      <Alphabetical
                        style={{
                          color: 'white',
                          backgroundColor: '#757575',
                          fontSize: 15,
                          borderRadius: 3,
                          marginLeft: 2,
                          marginRight: 2,
                          marginTop: 1
                        }}
                      />
                      <Typography variant="body2" style={formRowFontStyles}>
                        Name
                      </Typography>
                      <TextField
                        fullWidth
                        inputProps={inputProps}
                        value={name}
                        onChange={e => this.handleFormValueChange('name', e.target.value)}
                      />
                    </FlexGrid>
                    <FlexGrid container type="row" style={formRowStyles}>
                      <AccountBox style={{ fontSize: 18, color: '#757575' }} />
                      <Typography variant="body2" htmlFor="uploaded-by" style={formRowFontStyles}>
                        Uploaded By
                      </Typography>
                      <TextField
                        fullWidth
                        name="uploaded-by"
                        inputProps={inputProps}
                        value={uploadedBy}
                        onChange={e => this.handleFormValueChange('uploadedBy', e.target.value)}
                      />
                    </FlexGrid>
                    <FlexGrid container type="row" style={formRowStyles}>
                      <CalendarBlank style={{ fontSize: 18, color: '#757575' }} />
                      <Typography variant="body2" htmlFor="uploaded-date" style={formRowFontStyles}>
                        Uploaded On
                      </Typography>
                      <DatePicker
                        name="uploadedDateSearch"
                        dateFormat="MM/DD/YYYY"
                        onChange={date => this.handleFormValueChange('uploadedDate', date)}
                        value={uploadedDate}
                        style={{ marginTop: 0 }}
                        containerProps={{ fullWidth: true }}
                        inputProps={inputProps}
                        onOpen={this.handleOpenDatePicker}
                        onClose={this.handleCloseDatePicker}
                        InputAdornmentProps={{
                          disableTypography: true,
                          style: {
                            height: 19,
                            width: 19,
                            margin: 0,
                            marginRight: 15,
                            alignItems: 'flex-end',
                            marginBottom: -8
                          }
                        }}
                      />
                    </FlexGrid>
                    <FlexGrid container type="row" style={formRowStyles}>
                      <Clipboard style={{ fontSize: 18, color: '#757575' }} />
                      <Typography variant="body2" htmlFor="project" style={formRowFontStyles}>
                        Project
                      </Typography>
                      <Autocomplete
                        suggestions={projectSuggestions}
                        handleGetSuggestions={this.handleGetSuggestions('project')}
                        handleClearSuggestions={this.handleClearSuggestions('project')}
                        showSearchIcon={false}
                        inputProps={{
                          value: projectSearchValue,
                          onChange: (e, { newValue }) => {
                            if (e.target.value === undefined) {
                              this.handleAutocompleteSearchValueChange('project', newValue.name)
                            } else {
                              this.handleAutocompleteSearchValueChange('project', e.target.value)
                            }
                          },
                          id: 'project-name',
                          ...inputProps
                        }}
                        handleSuggestionSelected={this.handleSuggestionSelected('project')}
                      />
                    </FlexGrid>
                    <FlexGrid container type="row" style={formRowStyles}>
                      <City style={{ fontSize: 18, color: '#757575' }} />
                      <Typography variant="body2" htmlFor="jurisdiction" style={formRowFontStyles}>
                        Jurisdiction
                      </Typography>
                      <Autocomplete
                        suggestions={jurisdictionSuggestions}
                        handleGetSuggestions={this.handleGetSuggestions('jurisdiction')}
                        handleClearSuggestions={this.handleClearSuggestions('jurisdiction')}
                        showSearchIcon={false}
                        inputProps={{
                          value: jurisdictionSearchValue,
                          onChange: (e, { newValue }) => {
                            if (e.target.value === undefined) {
                              this.handleAutocompleteSearchValueChange('jurisdiction', newValue.name)
                            } else {
                              this.handleAutocompleteSearchValueChange('jurisdiction', e.target.value)
                            }
                          },
                          id: 'jurisdiction-name',
                          ...inputProps
                        }}
                        handleSuggestionSelected={this.handleSuggestionSelected('jurisdiction')}
                      />
                    </FlexGrid>
                    <FlexGrid container type="row" justify="flex-end">
                      <Button
                        raised={false}
                        color="secondary"
                        listButton
                        onClick={this.handleSearchFormSubmit}
                        style={{ letterSpacing: '.5px', textTransform: 'unset', borderRadius: 5 }}>
                        Search
                      </Button>
                    </FlexGrid>
                  </FlexGrid>
                </div>
              </ClickAwayListener>
            )
          }}
        </Popper>
      </Manager>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = state => {
  const searchState = state.scenes.docManage.search
  return {
    form: searchState.form.params,
    searchValue: searchState.form.searchValue,
    projectSuggestions: searchState.projectSuggestions.suggestions,
    jurisdictionSuggestions: searchState.jurisdictionSuggestions.suggestions,
    projectSearchValue: searchState.projectSuggestions.searchValue,
    jurisdictionSearchValue: searchState.jurisdictionSuggestions.searchValue,
    selectedJurisdiction: searchState.jurisdictionSuggestions.selectedSuggestion,
    selectedProject: searchState.projectSuggestions.selectedSuggestion
  }
}

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  actions: {
    ...bindActionCreators(actions, dispatch),
    projectAutocomplete: bindActionCreators(projectAutocomplete, dispatch),
    jurisdictionAutocomplete: bindActionCreators(jurisdictionAutocomplete, dispatch)
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox)