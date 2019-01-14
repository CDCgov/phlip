import makeActionCreator from 'utils/makeActionCreator'
import { makeAutocompleteActionCreators } from 'data/autocomplete/actions'

export const types = {
  GET_DOCUMENTS_REQUEST: 'GET_DOCUMENTS_REQUEST',
  GET_DOCUMENTS_SUCCESS: 'GET_DOCUMENTS_SUCCESS',
  GET_DOCUMENTS_FAIL: 'GET_DOCUMENTS_FAIL',
  ON_SELECT_ALL: 'ON_SELECT_ALL',
  ON_SELECT_ONE_FILE: 'ON_SELECT_ONE_FILE',
  ON_PAGE_CHANGE: 'ON_PAGE_CHANGE',
  ON_ROWS_CHANGE: 'ON_ROWS_CHANGE',
  UPLOAD_DOCUMENTS_SUCCESS: 'UPLOAD_DOCUMENTS_SUCCESS',
  FLUSH_STATE: 'FLUSH_STATE',
  BULK_UPDATE_REQUEST: 'BULK_UPDATE_REQUEST',
  BULK_UPDATE_SUCCESS: 'BULK_UPDATE_SUCCESS',
  BULK_UPDATE_FAIL: 'BULK_UPDATE_FAIL',
  BULK_DELETE_REQUEST: 'BULK_DELETE_REQUEST',
  BULK_DELETE_SUCCESS: 'BULK_DELETE_SUCCESS',
  BULK_DELETE_FAIL: 'BULK_DELETE_FAIL'
}

export default {
  getDocumentsRequest: makeActionCreator(types.GET_DOCUMENTS_REQUEST),
  handleSelectAll: makeActionCreator(types.ON_SELECT_ALL),
  handlePageChange: makeActionCreator(types.ON_PAGE_CHANGE, 'page'),
  handleRowsChange: makeActionCreator(types.ON_ROWS_CHANGE, 'rowsPerPage'),
  handleSelectOneFile: makeActionCreator(types.ON_SELECT_ONE_FILE, 'id'),
  handleBulkUpdate: makeActionCreator(types.BULK_UPDATE_REQUEST, 'updateData','selectedDocs'),
  handleBulkDelete: makeActionCreator(types.BULK_DELETE_REQUEST),
}

export const projectAutocomplete = {
    ...makeAutocompleteActionCreators('PROJECT', '')
}

export const jurisdictionAutocomplete = {
    ...makeAutocompleteActionCreators('JURISDICTION', '')
}