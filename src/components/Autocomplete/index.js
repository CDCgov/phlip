import React from 'react'
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
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

/**
 * Renders the list container for all of the suggestions
 *
 * @param containerProps
 * @param children
 * @returns {*}
 */
const renderSuggestionsContainer = ({ containerProps, children }) => {
  return (
    <Paper {...containerProps} style={{ zIndex: 20000000 }} square>
      {children}
    </Paper>
  )
}

/**
 * Determines if the suggestions should be rendered. Only renders if the input length >= 3
 * @param value
 * @returns {boolean}
 */
const shouldRenderSuggestions = value => value.trim().length >= 3

/**
 * Autosuggest / Autocomplete input field, renders a list of suggestions based on the input
 * @component
 */
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
  /**
   * List of suggestions to render
   */
  suggestions: PropTypes.array,

  /**
   * Suggestion value (what the user has typed in)
   */
  suggestionValue: PropTypes.string,

  /**
   * List of classes from @material-ui/core theme provider
   */
  classes: PropTypes.object,

  /**
   * Any props you to want to pass to the TextField component
   */
  InputProps: PropTypes.object,

  /**
   * Props to send to the actual input or InputProps component
   */
  inputProps: PropTypes.object,

  /**
   * Handles retrieving suggestions
   */
  handleGetSuggestions: PropTypes.func,

  /**
   * Handles clearing the suggestions array
   */
  handleClearSuggestions: PropTypes.func,

  /**
   * Handles when the user changes their input (suggestion value)
   */
  handleSuggestionValueChange: PropTypes.func,

  /**
   * Handles when a user clicks on a suggestion
   */
  handleSuggestionSelected: PropTypes.func,

  /**
   * Render each suggestion in the list
   */
  renderSuggestion: PropTypes.func,

  /**
   * Returns the suggestion value
   */
  getSuggestionValue: PropTypes.func
}

Autocomplete.defaultProps = {}

export default withStyles(classes)(Autocomplete)