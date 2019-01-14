#### Autocomplete / autosuggest example.

```jsx
suggestionList = ['Florida', 'California', 'Ohio'];
initialState = { suggestions: [], value: '' };

getSuggestions = ({ value }) => {
  const suggestions = suggestionList.filter(name => name.toLowerCase().slice(0, value.length) === value)
  setState({
    suggestions
  })
};

<div style={{ position: 'relative' }}>
  <Autocomplete
    name="name"
    suggestions={state.suggestions}
    handleGetSuggestions={getSuggestions}
    handleClearSuggestions={() => setState({ suggestions: [] })}
    InputProps={{
      label: 'State Name',
      placeholder: 'Type a state in'
    }}
    inputProps={{
      value: state.value,
      onChange: (event, { newValue, method }) => setState({ value: newValue }),
      id: 'name-autocomplete'
    }}
    shouldRenderSuggestions={true}
    renderSuggestion={suggestion => suggestion}
    getSuggestionValue={suggestion => suggestion}
  />
</div>
```