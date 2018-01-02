import React from 'react'
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest'
import Paper from 'material-ui/Paper'
import { withStyles } from 'material-ui/styles'
import TextInput from 'components/TextInput'

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

const renderInput = ({ autoFocus, value, ref, ...other }) => (
  <TextInput autoFocus={autoFocus} inputRef={ref} value={value} {...other} />
)

const renderSuggestionsContainer = (options) => {
  const { containerProps, children } = options

  return (
    <Paper {...containerProps} style={{ zIndex: '10000' }} square>
      {children}
    </Paper>
  )
}

export const Autocomplete = props => {
  const {
    suggestions,
    suggestionValue,
    classes,
    inputProps,
    input,
    meta,
    handleGetSuggestions,
    handleClearSuggestions,
    handleSuggestionValueChange,
    handleSuggestionSelected,
    renderSuggestion,
    getSuggestionValue
  } = props

  return (
    <Autosuggest
      theme={{
        container: classes.container,
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
        value: suggestionValue,
        onChange: handleSuggestionValueChange,
        meta,
        ...input,
        ...inputProps
      }}
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
  getSuggestionValue: PropTypes.func,
}

Autocomplete.defaultProps = {
}

export default withStyles(classes)(Autocomplete)