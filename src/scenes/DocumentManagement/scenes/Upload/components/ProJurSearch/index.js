import React from 'react'
import PropTypes from 'prop-types'
import { FlexGrid, Autocomplete, Icon } from 'components'

const ProJurSearch = props => {
  const {
    projectSuggestions,
    jurisdictionSuggestions,
    projectSearchValue,
    jurisdictionSearchValue,
    onClearSuggestions,
    onGetSuggestions,
    onSearchValueChange,
    onSuggestionSelected,
    showProjectError,
    showJurSearch,
    onMouseDown,
    searchingProjects,
    searchingJurisdictions
  } = props

  return (
    <FlexGrid container type="row" align="center" justify="center" onMouseDown={onMouseDown} id="upload-panel">
      <FlexGrid container type="row" align="flex-end" style={{ marginRight: 20, minWidth: 250 }} >
        <Icon style={{ paddingRight: 8, paddingBottom: 5 }}>dvr</Icon>
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
          style={{ width: '100%' }}
          InputProps={{
            label: 'Project',
            placeholder: 'Search projects',
            required: true,
            fullWidth: true,
            error: showProjectError
          }}
          isSearching={searchingProjects}
          handleSuggestionSelected={onSuggestionSelected('project')}
          suggestionType='project'
        />
      </FlexGrid>
      {showJurSearch &&
      <FlexGrid container type="row" align="flex-end" style={{ marginLeft: 20, minWidth: 250 }}>
        <Icon style={{ paddingRight: 8, paddingBottom: 5 }}>account_balance</Icon>
        <Autocomplete
          suggestions={jurisdictionSuggestions}
          handleGetSuggestions={val => onGetSuggestions('jurisdiction', val)}
          handleClearSuggestions={() => onClearSuggestions('jurisdiction')}
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
          isSearching={searchingJurisdictions}
          handleSuggestionSelected={onSuggestionSelected('jurisdiction')}
          InputProps={{
            label: 'Jurisdiction',
            placeholder: 'Search jurisdictions',
            fullWidth: true
          }}
        />
      </FlexGrid>}
    </FlexGrid>
  )
}

ProJurSearch.propTypes = {
  projectSuggestions: PropTypes.array,
  jurisdictionSuggestions: PropTypes.array,
  projectSearchValue: PropTypes.string,
  jurisdictionSearchValue: PropTypes.string,
  onClearSuggestions: PropTypes.func,
  onGetSuggestions: PropTypes.func,
  onSearchValueChange: PropTypes.func,
  onJurisdictionSelected: PropTypes.func,
  onProjectSelected: PropTypes.func,
  showProjectError: PropTypes.bool,
  onSuggestionSelected: PropTypes.func,
  showJurSearch: PropTypes.bool,
  onMouseDown: PropTypes.func,
  /**
   * Whether or not the app is searching projects
   */
  searchingProjects: PropTypes.bool,
  /**
   * Whether or not the app is searching jurisdictions
   */
  searchingJurisdictions: PropTypes.bool
}

export default ProJurSearch
