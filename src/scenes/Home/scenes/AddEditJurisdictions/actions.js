import * as types from './actionTypes'

export { updateEditedFields } from 'scenes/Home/actions'

export const addJurisdiction = (jurisdiction, projectId) => ({
  type: types.ADD_PROJECT_JURISDICTION_REQUEST,
  jurisdiction,
  projectId
})

export const updateJurisdiction = (jurisdiction, projectId) => ({
  type: types.UPDATE_PROJECT_JURISDICTION_REQUEST,
  jurisdiction,
  projectId
})

export const getProjectJurisdictions = projectId => ({ type: types.GET_PROJECT_JURISDICTIONS_REQUEST, projectId })

export const updateSearchValue = searchValue => ({ type: types.UPDATE_JURISDICTION_SEARCH_VALUE, searchValue })

export const clearJurisdictions = () => ({ type: types.CLEAR_JURISDICTIONS })

export const searchJurisdictionList = searchString => ({ type: types.SEARCH_JURISDICTION_LIST, searchString })

export const onSuggestionValueChanged = suggestionValue => ({ type: types.UPDATE_SUGGESTION_VALUE, suggestionValue })

export const onClearSuggestions = () => ({ type: types.ON_CLEAR_SUGGESTIONS })

export const onJurisdictionSelected = jurisdiction => ({ type: types.ON_JURISDICTION_SELECTED, jurisdiction })

export const addJurisdictionToProject = (jurisdiction, projectId) => ({
  type: types.ADD_JURISDICTION_TO_PROJECT,
  jurisdiction,
  projectId
})

export const updateJurisdictionInProject = (jurisdiction, projectId) => ({
  type: types.UPDATE_JURISDICTION_IN_PROJECT,
  jurisdiction,
  projectId
})

export const addPresetJurisdictionRequest = (jurisdiction, projectId) => ({
  type: types.ADD_PRESET_JURISDICTION_REQUEST,
  jurisdiction,
  projectId
})

export const resetFormError = () => ({
  type: types.RESET_FORM_ERROR
})