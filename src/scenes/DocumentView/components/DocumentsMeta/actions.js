import * as types from './actionTypes'

export { updateEditedFields } from 'scenes/Home/actions'

/** Add jurisdiction */
export const addJurisdiction = (jurisdiction, projectId) => ({
  type: types.ADD_PROJECT_JURISDICTION_REQUEST,
  jurisdiction,
  projectId
})

/** Updating a jurisidction */
export const updateJurisdiction = (jurisdiction, projectId, projectJurisdictionId) => ({
  type: types.UPDATE_PROJECT_JURISDICTION_REQUEST,
  jurisdiction,
  projectId,
  projectJurisdictionId
})

/** Adding preset list of jurisdictions */
export const addPresetJurisdictionRequest = (jurisdiction, projectId) => ({
  type: types.ADD_PRESET_JURISDICTION_REQUEST,
  jurisdiction,
  projectId
})

/** Getting list of all jurisdictions for project */
export const getProjectJurisdictions = projectId => ({ type: types.GET_PROJECT_JURISDICTIONS_REQUEST, projectId })

/** Updating visible jurisdictions list based on searchValue from search bar */
export const updateSearchValue = searchValue => ({ type: types.UPDATE_JURISDICTION_SEARCH_VALUE, searchValue })

/** Autocomplete related actions */
export const clearJurisdictions = () => ({ type: types.CLEAR_JURISDICTIONS })

/** Searching master jurisdiction list */
export const searchJurisdictionList = searchString => ({ type: types.SEARCH_JURISDICTION_LIST, searchString })

/** Updating suggestion value */
export const onSuggestionValueChanged = suggestionValue => ({ type: types.UPDATE_SUGGESTION_VALUE, suggestionValue })

/** Clearing suggested jurisdictions */
export const onClearSuggestions = () => ({ type: types.ON_CLEAR_SUGGESTIONS })

/** Setting jurisdiction selected in form */
export const onJurisdictionSelected = jurisdiction => ({ type: types.ON_JURISDICTION_SELECTED, jurisdiction })

/** Adding jurisdiction to project in state.scenes.home */
export const addJurisdictionToProject = (jurisdiction, projectId) => ({
  type: types.ADD_JURISDICTION_TO_PROJECT,
  jurisdiction,
  projectId
})

/** Updating jurisdiction in project in state.scenes.home */
export const updateJurisdictionInProject = (jurisdiction, projectId) => ({
  type: types.UPDATE_JURISDICTION_IN_PROJECT,
  jurisdiction,
  projectId
})

/** Deleting jurisdiction */
export const deleteJurisdictionRequest = (jurisdictionId, projectId) => ({
  type: types.DELETE_JURISDICTION_REQUEST,
  jurisdictionId,
  projectId
})

/** Clearing alerts and errors */
export const resetFormError = () => ({ type: types.RESET_FORM_ERROR })
export const dismissDeleteErrorAlert = () => ({ type: types.DISMISS_DELETE_ERROR_ALERT })

/** Show jurisdiction loader */
export const showJurisdictionLoader = () => ({ type: types.SHOW_JURISDICTION_LOADER })

/** Initializing, updating, reseting form */
export const initializeFormValues = values => ({ type: types.INITIALIZE_FORM, values })
export const resetToInitial = () => ({ type: types.RESET_FORM_VALUES })
export const setFormValues = (prop, value) => ({ type: types.SET_FORM_VALUES, prop, value })

