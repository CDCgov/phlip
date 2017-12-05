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
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper'

const suggestionLabels = {
  name: 'Name',
  lastEditedBy: 'Last Edited By',
  dateLastEdited: 'Date Last Edited'
}

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
    width: 800,
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
    borderBottom: `1px dashed ${theme.palette.primary[ '600' ]}`,
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

const highlightLetters = (property, query) => {
  const matches = match(property, query)
  const parts = parse(property, matches)
  return parts.map((part, index) => (
    <span key={index} style={{ fontWeight: part.highlight ? 300 : 700 }}>{part.text}</span>
  ))
}

const renderSuggestion = (suggestion, { query, isHighlighted }) => {
  const matched = [ ...suggestion.matchedKeys ]
  const highlightedStyles = {
    cursor: 'pointer',
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    padding: '5px 10px 5px 10px'
  }

  return (
    <div style={isHighlighted ? {...highlightedStyles} : {padding: '5px 10px 5px 10px'}}>
      {Object.keys(suggestion).map((key, index) => (
        ['matchedKeys','name'].includes(key)
          ? ''
          : <Typography component="div" key={`${index}-${key}`} type="caption" style={{ fontSize: '.75rem', paddingBottom: '4px' }}>
              <span>{suggestionLabels[ key ]}:   </span>
              {matched.includes(key)
                ? highlightLetters(suggestion[key], query)
                : <span>{suggestion[key]}</span>}
            </Typography>
      ))}
    </div>
  )
}

const renderSectionTitle = section => {
  return (
    <div style={{ padding: '10px 0 0 0' }}>
      <Typography type="caption" style={{ fontWeight: 'bold', fontSize: '.80rem' }}>{section.title}</Typography>
    </div>
  )
}

const getSuggestionValue = suggestion => {
  return suggestion
}

const getSectionSuggestions = section => {
  return section.matches
}

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
              suggestion: classes.suggestion,
              sectionContainer: classes.sectionContainer
            }}
            renderInputComponent={renderInput}
            inputProps={{
              value: searchValue,
              onChange: handleSearchValueChange,
              disableUnderline: true,
              id: 'search-bar',
            }}
            suggestions={suggestions}
            onSuggestionsFetchRequested={handleSuggestionRequest}
            onSuggestionsClearRequested={handleClearSuggestions}
            renderSuggestionsContainer={renderSuggestionsContainer}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            multiSection={true}
            renderSectionTitle={renderSectionTitle}
            getSectionSuggestions={getSectionSuggestions}
            alwaysRenderSuggestions={true}
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