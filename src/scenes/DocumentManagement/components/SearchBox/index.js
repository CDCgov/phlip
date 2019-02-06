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
import { checkIfMultiWord } from 'utils/commonHelpers'
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

  state = {
    isFocused: false,
    showFilterForm: false,
    datePicker1Open: false,
    datePicker2Open: false
  }

  componentWillUnmount() {
    this.clearForm()
    this.props.actions.clearSearchString()
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
    if (!this.state.datePicker1Open && !this.state.datePicker2Open) {
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
    const params = ['name', 'uploadedBy']

    let searchTerms = []
    params.forEach((key, index) => {
      if (this.props.form[key] !== '') {
        let p = this.props.form[key]
        if (checkIfMultiWord(p)) {
          p = `(${p})`
        }
        searchTerms.push(key.concat(':', p))
      }
    })
    if (this.props.form.uploadedDate1 !== null && this.props.form.uploadedDate2 !== null) {
      let dBegin = moment.utc(this.props.form.uploadedDate1).local().format('MM/DD/YYYY')
      let dEnd = moment.utc(this.props.form.uploadedDate2).local().format('MM/DD/YYYY')
      let p= `["${dBegin}","${dEnd}"]`
      searchTerms.push(`uploadedDate:${p}`)
    }

    if (this.props.form.project.id !== null) {
      let z = this.props.form.project.name
      if (checkIfMultiWord(z)) {
        z = `(${z})`
      }
      searchTerms.push(`project:${z}`)
    }

    if (this.props.form.jurisdiction.id !== null) {
      let z = this.props.form.jurisdiction.name
      if (checkIfMultiWord(z)) {
        z = `(${z})`
      }
      searchTerms.push(`jurisdiction:${z}`)
    }

    return searchTerms.join(' | ')
  }

  handleOpenDatePicker2 = () => {
    this.setState({
      datePicker2Open: true
    })
  }

  handleCloseDatePicker2 = () => {
    this.setState({
      datePicker2Open: false
    })
  }

    handleOpenDatePicker1 = () => {
      this.setState({
        datePicker1Open: true
      })
    }

    handleCloseDatePicker1 = () => {
      this.setState({
        datePicker1Open: false
      })
    }
    render() {
      const {
        form: {
          uploadedDate1,
          uploadedBy,
          name,
          uploadedDate2
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

      const formRowFontStyles2 = {
        color: '#5f6368',
        letterSpacing: .2,
        fontWeight: 300,
        // paddingLeft: 5,
        fontSize: 13,
        width: '8%',
        maxWidth: '8%',
        textAlign:'center'
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
                      <FlexGrid container flex type="row" style={formRowStyles} justify="space-between" >
                        <CalendarBlank style={{ fontSize: 18, color: '#757575' }} />
                        <Typography variant="body2" htmlFor="uploaded-within" style={formRowFontStyles}>
                        Uploaded Date
                        </Typography>
                        <FlexGrid container flex type="row" style={{width:'100%'}} justify="space-between">
                          <Typography variant="body2" htmlFor="uploadedDate1Search" style={formRowFontStyles2}>
                            From
                          </Typography>
                          <DatePicker
                            name="uploadedDate1Search"
                            dateFormat="MM/DD/YYYY"
                            onChange={date => this.handleFormValueChange('uploadedDate1', date)}
                            value={uploadedDate1}
                            style={{ marginTop: 0, AlignSelf:'flex-start', paddingLeft:'0'}}
                            containerProps={{ fullWidth: false }}
                            inputProps={inputProps}
                            onOpen={this.handleOpenDatePicker1}
                            onClose={this.handleCloseDatePicker1}
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
                          <FlexGrid style={{width:'10px'}} />
                          <Typography variant="body2" htmlFor="uploadedDate2Search" style={formRowFontStyles2}>
                                To
                          </Typography>
                          <DatePicker
                            name="uploadedDate2Search"
                            dateFormat="MM/DD/YYYY"
                            onChange={date => this.handleFormValueChange('uploadedDate2', date)}
                            value={uploadedDate2}
                            style={{ marginTop: 0, alignSelf:'flex-end', paddingLeft:'30'}}
                            containerProps={{ fullWidth: false }}
                            inputProps={inputProps}
                            onOpen={this.handleOpenDatePicker2}
                            onClose={this.handleCloseDatePicker2}
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