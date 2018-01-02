import React from 'react'
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest'
import Paper from 'material-ui/Paper'
import { withStyles } from 'material-ui/styles'
import { MenuItem } from 'material-ui/Menu'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
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
    handleGetSuggestions,
    handleClearSuggestions,
    handleSuggestionValueChange,
    handleSuggestionSelected,
    renderSuggestion,
    getSuggestionValue,
    classes,
    inputProps
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
        ...inputProps
      }}
      onSuggestionSelected={handleSuggestionSelected}
      renderSuggestion={renderSuggestion}
      getSuggestionValue={getSuggestionValue}
    />
  )
}

Autocomplete.propTypes = {}

Autocomplete.defaultProps = {
}

export default withStyles(classes)(Autocomplete)