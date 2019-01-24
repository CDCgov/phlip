import makeActionCreator from 'utils/makeActionCreator'

export const types = {
  UPDATE_SEARCH_VALUE: 'UPDATE_SEARCH_VALUE',
  SEARCH_FOR_SUGGESTIONS_REQUEST: 'SEARCH_FOR_SUGGESTIONS_REQUEST',
  SEARCH_FOR_SUGGESTIONS_SUCCESS: 'SEARCH_FOR_SUGGESTIONS_SUCCESS',
  SEARCH_FOR_SUGGESTIONS_FAIL: 'SEARCH_FOR_SUGGESTIONS_FAIL',
  SEARCH_ROW_SUGGESTIONS_SUCCESS: 'SEARCH_ROW_SUGGESTIONS_SUCCESS',
  ON_SUGGESTION_SELECTED: 'ON_SUGGESTION_SELECTED',
  CLEAR_SUGGESTIONS: 'CLEAR_SUGGESTIONS',
  CLEAR_ALL: 'CLEAR_ALL'
}

export const makeAutocompleteActionCreators = (searchName, suffix = '') => {
  return {
    updateSearchValue: makeActionCreator(`${types.UPDATE_SEARCH_VALUE}_${searchName}${suffix}`, 'value'),
    searchForSuggestionsRequest: makeActionCreator(`${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_${searchName}`, 'searchString', 'suffix', 'index'),
    clearSuggestions: makeActionCreator(`${types.CLEAR_SUGGESTIONS}_${searchName}${suffix}`),
    onSuggestionSelected: makeActionCreator(`${types.ON_SUGGESTION_SELECTED}_${searchName}${suffix}`, 'suggestion'),
    clearAll: makeActionCreator(`${types.CLEAR_ALL}_${searchName}${suffix}`)
  }
}