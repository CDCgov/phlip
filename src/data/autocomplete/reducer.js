import { types } from './actions'

export const INITIAL_STATE = {
  searchValue: '',
  suggestions: [],
  selectedSuggestion: {}
}

export const createAutocompleteReducer = (searchName, suffix = '') => {
  return function(state = INITIAL_STATE, action) {
    switch (action.type) {
      case `${types.UPDATE_SEARCH_VALUE}_${searchName}${suffix}`:
        return {
          ...state,
          searchValue: action.value,
          suggestions: action.value === '' ? [] : state.suggestions,
          selectedSuggestion: action.value === '' ? {} : state.selectedSuggestion
        }

      case `${types.SEARCH_FOR_SUGGESTIONS_SUCCESS}_${searchName}${suffix}`:
        return {
          ...state,
          suggestions: action.payload
        }

      case `${types.ON_SUGGESTION_SELECTED}_${searchName}${suffix}`:
        return {
          ...state,
          selectedSuggestion: action.suggestion,
          searchValue: action.suggestion.name,
          suggestions: []
        }

      case `${types.CLEAR_SUGGESTIONS}_${searchName}${suffix}`:
        return {
          ...state,
          suggestions: []
        }

      case `${types.CLEAR_ALL}_${searchName}${suffix}`:
      case 'FLUSH_STATE':
        return INITIAL_STATE

      default:
        return state
    }
  }
}