import React from 'react'
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest'
import Paper from 'material-ui/Paper'
import { withStyles } from 'material-ui/styles'
import SimpleInput from 'components/SimpleInput'

const classes = theme => ({
  suggestionsContainerOpen: {
    width: 520,
    position: 'absolute',
    maxHeight: 500,
    overflow: 'auto',
    '& div:last-child': {
      borderBottom: 'none'
    },
    display: 'block'
  },
  suggestion: {
    display: 'block'
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    maxHeight: 250
  },
  sectionContainer: {
    margin: '0 10px',
    borderBottom: `1px dashed ${theme.palette.primary['600']}`
  }
})

const renderInput = ({ value, onBlur, ref, TextFieldProps, ...other }) => {
  return (
  <SimpleInput
    shrinkLabel
    inputRef={ref}
    value={value}
    {...TextFieldProps}
    multiline={false}
    InputProps={{
      inputProps: other
    }}
  />)
}

const renderSuggestionsContainer = ({ containerProps, children }) => {
  return (
    <Paper {...containerProps} style={{ zIndex: 20000000 }} square>
      {children}
    </Paper>
  )
}

const shouldRenderSuggestions = value => value.trim().length >= 3

export const Autocomplete = props => {
  const {
    suggestions,
    classes,
    InputProps,
    inputProps,
    handleGetSuggestions,
    handleClearSuggestions,
    handleSuggestionSelected,
    renderSuggestion,
    getSuggestionValue
  } = props

  return (
    <Autosuggest
      theme={{
        suggestionsContainerOpen: classes.suggestionsContainerOpen,
        suggestionsList: classes.suggestionsList,
        suggestion: classes.suggestion,
        sectionContainer: classes.sectionContainer
      }}
      suggestions={suggestions}
      onSuggestionsFetchRequested={handleGetSuggestions}
      onSuggestionsClearRequested={handleClearSuggestions}
      renderSuggestionsContainer={renderSuggestionsContainer}
      renderInputComponent={renderInput}
      inputProps={{
        TextFieldProps: InputProps,
        ...inputProps
      }}
      shouldRenderSuggestions={shouldRenderSuggestions}
      onSuggestionSelected={handleSuggestionSelected}
      renderSuggestion={renderSuggestion}
      getSuggestionValue={getSuggestionValue}
    />
  )
}

Autocomplete.propTypes = {
  suggestions: PropTypes.array,
  suggestionValue: PropTypes.string,
  classes: PropTypes.object,
  inputProps: PropTypes.object,
  input: PropTypes.object,
  meta: PropTypes.object,
  handleGetSuggestions: PropTypes.func,
  handleClearSuggestions: PropTypes.func,
  handleSuggestionValueChange: PropTypes.func,
  handleSuggestionSelected: PropTypes.func,
  renderSuggestion: PropTypes.func,
  getSuggestionValue: PropTypes.func
}

Autocomplete.defaultProps = {}

export default withStyles(classes)(Autocomplete)