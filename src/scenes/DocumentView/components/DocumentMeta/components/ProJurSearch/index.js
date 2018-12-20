import React from 'react'
import PropTypes from 'prop-types'
import FlexGrid from 'components/FlexGrid'
import Autocomplete from 'components/Autocomplete'
import Icon from 'components/Icon'

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
    showJurSearch
  } = props

  return (
    <FlexGrid container type="row" align="center" justify="center">
      {!showJurSearch &&
      <FlexGrid container type="row" align="flex-end" style={{ marginRight: 20 }}>
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
            label: 'Assign to Project',
            placeholder: 'Search projects',
            required: true,
            fullWidth: true,
            error: showProjectError
          }}
          handleSuggestionSelected={onSuggestionSelected('project')}
        />
      </FlexGrid>}
      {showJurSearch &&
      <FlexGrid container type="row" align="flex-end" style={{ marginLeft: 20 }}>
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
          handleSuggestionSelected={onSuggestionSelected('jurisdiction')}
          InputProps={{
            label: 'Assign to Jurisdiction',
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
  showJurSearch: PropTypes.bool
}

export default ProJurSearch