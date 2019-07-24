import React from 'react'
import PropTypes from 'prop-types'
import { FlexGrid, Icon } from 'components'
import Autosuggest from 'react-autosuggest'

/**
 * Renders the project and jurisdiction autocomplete search fields
 */
const ProJurSearch = props => {
  const {
    projectAutocompleteProps,
    jurisdictionAutocompleteProps,
    showJurSearch,
    onMouseDown,
    showProjectError
  } = props
  
  return (
    <FlexGrid container type="row" align="center" justify="center" onMouseDown={onMouseDown} id="upload-panel">
      <FlexGrid container type="row" align="flex-end" style={{ marginRight: 20, minWidth: 250 }}>
        <Icon style={{ paddingRight: 8, paddingBottom: 5 }}>dvr</Icon>
        <Autosuggest
          {...projectAutocompleteProps}
          inputProps={{
            ...projectAutocompleteProps.inputProps,
            TextFieldProps: {
              ...projectAutocompleteProps.inputProps.TextFieldProps,
              label: 'Project',
              required: true,
              error: showProjectError
            },
            InputProps: {
              ...projectAutocompleteProps.inputProps.InputProps,
              error: showProjectError
            }
          }}
        />
      </FlexGrid>
      {showJurSearch &&
      <FlexGrid container type="row" align="flex-end" style={{ marginLeft: 20, minWidth: 250 }}>
        <Icon style={{ paddingRight: 8, paddingBottom: 5 }}>account_balance</Icon>
        <Autosuggest
          {...jurisdictionAutocompleteProps}
          inputProps={{
            ...jurisdictionAutocompleteProps.inputProps,
            TextFieldProps: {
              ...jurisdictionAutocompleteProps.inputProps.TextFieldProps,
              label: 'Jurisdiction'
            }
          }}
        />
      </FlexGrid>}
    </FlexGrid>
  )
}

ProJurSearch.propTypes = {
  /**
   * If there's an error for the project input
   */
  showProjectError: PropTypes.bool,
  /**
   * If the jurisdiction search should be shown
   */
  showJurSearch: PropTypes.bool,
  /**
   * Handles mouse down
   */
  onMouseDown: PropTypes.func,
  /**
   * Props to pass to the autocomplete search for project
   */
  projectAutocompleteProps: PropTypes.object,
  /**
   * Props to pass to the autocomplete search for jurisdiction
   */
  jurisdictionAutocompleteProps: PropTypes.object
}

export default ProJurSearch
