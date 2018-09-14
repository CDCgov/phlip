import makeActionCreator from 'utils/makeActionCreator'

export const types = {
  GET_DOCUMENTS_REQUEST: 'GET_DOCUMENTS_REQUEST',
  GET_DOCUMENTS_SUCCESS: 'GET_DOCUMENTS_SUCCESS',
  GET_DOCUMENTS_FAIL: 'GET_DOCUMENTS_FAIL',
  ON_SELECT_ALL: 'ON_SELECT_ALL',
  ON_SEARCH_FIELD_CHANGE: 'ON_SEARCH_FIELD_CHANGE'
}

export default {
  getDocumentsRequest: makeActionCreator(types.GET_DOCUMENTS_REQUEST),
  onSelectAll: makeActionCreator(types.ON_SELECT_ALL),
  onSearchFieldChange: makeActionCreator(types.ON_SEARCH_FIELD_CHANGE, 'searchValue')
}