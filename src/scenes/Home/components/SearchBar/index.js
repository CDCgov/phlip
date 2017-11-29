import React from 'react'
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import { withStyles } from 'material-ui/styles'
import Container, { Column, Row } from 'components/Layout'
import Icon from 'components/Icon'
import TextField from 'material-ui/TextField'
import { MenuItem } from 'material-ui/Menu'
import Paper from 'material-ui/Paper'

const renderInput = ({ autoFocus, value, ref, ...other }) => {
  return (
    <TextField
      autoFocus={autoFocus}
      value={value}
      style={{ width: '100%' }}
      inputRef={ref}
      InputProps={{
        ...other
      }}
    />
  )
}

const classes = theme => ({
  suggestionsContainerOpen: {
    width: 500,
    position: 'absolute'
  },
  suggestion: {
    display: 'block'
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none'
  }
})

const renderSuggestionsContainer = (options) => {
  const { containerProps, children } = options

  return (
    <Paper {...containerProps} style={{ zIndex: '10000' }} square>
      {children}
    </Paper>
  )
}

const renderSuggestion = (suggestion, { query, isHighlighted }) => {
  const matches = match(suggestion.name, query)
  const parts = parse(suggestion.name, matches)
  const matchesDate = match(new Date(suggestion.dateLastEdited).toLocaleDateString(), query)
  const partsDate = parse(new Date(suggestion.dateLastEdited).toLocaleDateString(), matchesDate)
  return (
    <MenuItem selected={isHighlighted} component="div">
      {parts.map((part, index) => {
        return part.highlight ? (
          <span key={index} style={{ fontWeight: 500 }}>
            {part.text}
          </span>
        ) : (
          <strong key={index} style={{ fontWeight: 300 }}>
            {part.text}
          </strong>
        )
      })}
    </MenuItem>
  )
}

const getSuggestionValue = suggestion => {
  return suggestion.name
}

const getSectionTitle = section => section.name

const SearchBar = ({ classes, suggestions, searchValue, handleClearSuggestions, handleSuggestionRequest, handleSearchValueChange }) => {
  return (
    <Container style={{ padding: '27px 0' }}>
      <Container alignItems="center" style={{ height: 57, backgroundColor: '#e5e5e5', padding: '0 15px' }}>
        <Column flex xs>
          <Autosuggest
            theme={{
              container: classes.container,
              suggestionsContainerOpen: classes.suggestionsContainerOpen,
              suggestionsList: classes.suggestionsList,
              suggestion: classes.suggestion
            }}
            renderInputComponent={renderInput}
            inputProps={{
              value: searchValue,
              onChange: handleSearchValueChange,
              disableUnderline: true,
              id: 'search-bar',
              type: 'search'
            }}
            suggestions={suggestions}
            onSuggestionsFetchRequested={handleSuggestionRequest}
            onSuggestionsClearRequested={handleClearSuggestions}
            renderSuggestionsContainer={renderSuggestionsContainer}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
          />
        </Column>
        <Column>
          <Icon color="primary">search</Icon>
        </Column>
      </Container>
    </Container>
  )
}

SearchBar.propTypes = {}

export default withStyles(classes)(SearchBar)
