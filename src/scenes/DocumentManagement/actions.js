import makeActionCreator from 'utils/makeActionCreator'

export const types = {
  GET_DOCUMENTS_REQUEST: 'GET_DOCUMENTS_REQUEST',
  GET_DOCUMENTS_SUCCESS: 'GET_DOCUMENTS_SUCCESS',
  GET_DOCUMENTS_FAIL: 'GET_DOCUMENTS_FAIL',
  ON_SELECT_ALL: 'ON_SELECT_ALL',
  ON_SELECT_ONE_FILE: 'ON_SELECT_ONE_FILE',
  ON_SEARCH_FIELD_CHANGE: 'ON_SEARCH_FIELD_CHANGE',
  ON_PAGE_CHANGE: 'ON_PAGE_CHANGE',
  ON_ROWS_CHANGE: 'ON_ROWS_CHANGE',
  UPLOAD_DOCUMENTS_SUCCESS: 'UPLOAD_DOCUMENTS_SUCCESS',
  FLUSH_STATE: 'FLUSH_STATE'
}

export default {
  getDocumentsRequest: makeActionCreator(types.GET_DOCUMENTS_REQUEST),
  handleSelectAll: makeActionCreator(types.ON_SELECT_ALL),
  handleSearchFieldChange: makeActionCreator(types.ON_SEARCH_FIELD_CHANGE, 'searchValue'),
  handlePageChange: makeActionCreator(types.ON_PAGE_CHANGE, 'page'),
  handleRowsChange: makeActionCreator(types.ON_ROWS_CHANGE, 'rowsPerPage'),
  handleSelectOneFile: makeActionCreator(types.ON_SELECT_ONE_FILE, 'id')
}