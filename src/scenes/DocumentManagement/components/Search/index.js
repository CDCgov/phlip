import React from 'react'
import PropTypes from 'prop-types'
import FlexGrid from 'components/FlexGrid'
import SearchBar from 'components/SearchBar'
import Autocomplete from 'components/Autocomplete'

export const Search = props => {
  const {
    onSearchDocs,
    searchValue,
    projectSuggestions,
    jurisdictionSuggestions,
    projectSearchValue,
    jurisdictionSearchValue,
    onClearSuggestions,
    onGetSuggestions,
    onSearchValueChange,
    onSuggestionSelected
  } = props

  return (
    <FlexGrid type="row" container align="center" justify="space-between" padding="25px 20px 20px 20px">
      <FlexGrid></FlexGrid>
      <FlexGrid container type="row" align="flex-end">
        <SearchBar
          placeholder="Search"
          style={{ marginRight: 15 }}
          fullWidth
          searchValue={searchValue}
          handleSearchValueChange={onSearchDocs}
        />
        <Autocomplete
          suggestions={projectSuggestions}
          handleGetSuggestions={val => onGetSuggestions('project', val)}
          handleClearSuggestions={() => onClearSuggestions('project')}
          inputProps={{
            value: projectSearchValue,
            onChange: (e, { newValue }) => {
              if (e.target.value === undefined) {
                onSearchValueChange('project', newValue.name)
              } else {
                onSearchValueChange('project', e.target.value)
              }
            },
            id: 'project-name'
          }}
          style={{ width: '100%', marginRight: 15 }}
          InputProps={{
            label: 'Filter by',
            placeholder: 'Projects'
          }}
          showSearchIcon
          handleSuggestionSelected={onSuggestionSelected('project')}
        />
        <FlexGrid container type="row" align="flex-end" style={{ marginLeft: 15 }}>
          <Autocomplete
            suggestions={jurisdictionSuggestions}
            handleGetSuggestions={val => onGetSuggestions('jurisdiction', val)}
            handleClearSuggestions={() => onClearSuggestions('jurisdiction')}
            showSearchIcon
            inputProps={{
              value: jurisdictionSearchValue,
              onChange: (e, { newValue }) => {
                if (e.target.value === undefined) {
                  onSearchValueChange('jurisdiction', newValue.name)
                } else {
                  onSearchValueChange('jurisdiction', e.target.value)
                }
              },
              id: 'jurisdiction-name'
            }}
            handleSuggestionSelected={onSuggestionSelected('jurisdiction')}
            InputProps={{
              label: 'Filter by',
              placeholder: 'Jurisdictions'
            }}
          />
        </FlexGrid>
      </FlexGrid>
    </FlexGrid>
  )
}

export default Search