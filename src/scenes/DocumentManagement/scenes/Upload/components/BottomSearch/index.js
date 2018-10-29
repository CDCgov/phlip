import React from 'react'
import PropTypes from 'prop-types'
import FlexGrid from 'components/FlexGrid'
import Autocomplete from 'components/Autocomplete'
import Icon from 'components/Icon'

const BottomSearch = props => {
  const {
    projectSuggestions,
    jurisdictionSuggestions,
    projectSearchValue,
    jurisdictionSearchValue,
    onClearSuggestions,
    onGetSuggestions,
    onSearchValueChange,
    onJurisdictionSelected,
    onProjectSelected,
    showProjectError
  } = props

  return (
    <FlexGrid container type="row" align="center" justify="center" style={{ marginTop: 20 }}>
      <FlexGrid container type="row" align="flex-end" style={{ marginRight: 20, minWidth: 250 }}>
        <Icon style={{ paddingRight: 8, paddingBottom: 5 }}>dvr</Icon>
        <Autocomplete
          suggestions={projectSuggestions}
          handleGetSuggestions={val => onGetSuggestions('project', val)}
          handleClearSuggestions={() => onClearSuggestions('projectSuggestions')}
          inputProps={{
            value: projectSearchValue,
            onChange: (e) => onSearchValueChange('project', e.target.value || ''),
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
          handleSuggestionSelected={onProjectSelected}
        />
      </FlexGrid>
      <FlexGrid container type="row" align="flex-end" style={{ marginLeft: 20, minWidth: 250 }}>
        <Icon style={{ paddingRight: 8, paddingBottom: 5 }}>account_balance</Icon>
        <Autocomplete
          suggestions={jurisdictionSuggestions}
          handleGetSuggestions={val => onGetSuggestions('jurisdiction', val)}
          handleClearSuggestions={() => onClearSuggestions('jurisdictionSuggestions')}
          inputProps={{
            value: jurisdictionSearchValue,
            onChange: (e) => onSearchValueChange('jurisdiction', e.target.value || ''),
            id: 'jurisdiction-name'
          }}
          handleSuggestionSelected={onJurisdictionSelected}
          InputProps={{
            label: 'Assign to Jurisdiction',
            placeholder: 'Search jurisdictions',
            fullWidth: true
          }}
        />
      </FlexGrid>
    </FlexGrid>
  )
}

BottomSearch.propTypes = {
  projectSuggestions: PropTypes.array,
  jurisdictionSuggestions: PropTypes.array,
  projectSearchValue: PropTypes.string,
  jurisdictionSearchValue: PropTypes.string,
  onClearSuggestions: PropTypes.func,
  onGetSuggestions: PropTypes.func,
  onSearchValueChange: PropTypes.func,
  onJurisdictionSelected: PropTypes.func,
  onProjectSelected: PropTypes.func,
  showProjectError: PropTypes.bool
}

export default BottomSearch