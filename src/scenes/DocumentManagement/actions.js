import makeActionCreator from 'utils/makeActionCreator'
import { makeAutocompleteActionCreators } from 'data/autocomplete/actions'
import {
  default as searchActions,
  types as searchTypes
} from './components/SearchBox/actions'
import { types as uploadTypes } from './scenes/Upload/actions'

export const types = {
  GET_DOCUMENTS_REQUEST: 'GET_DOCUMENTS_REQUEST',
  GET_DOCUMENTS_SUCCESS: 'GET_DOCUMENTS_SUCCESS',
  GET_DOCUMENTS_FAIL: 'GET_DOCUMENTS_FAIL',
  ON_SELECT_ALL: 'ON_SELECT_ALL',
  ON_SELECT_ONE_FILE: 'ON_SELECT_ONE_FILE',
  ON_PAGE_CHANGE: 'ON_PAGE_CHANGE',
  ON_ROWS_CHANGE: 'ON_ROWS_CHANGE',
  FLUSH_STATE: 'FLUSH_STATE',
  BULK_UPDATE_REQUEST: 'BULK_UPDATE_REQUEST',
  BULK_UPDATE_SUCCESS: 'BULK_UPDATE_SUCCESS',
  BULK_UPDATE_FAIL: 'BULK_UPDATE_FAIL',
  BULK_DELETE_REQUEST: 'BULK_DELETE_REQUEST',
  BULK_DELETE_SUCCESS: 'BULK_DELETE_SUCCESS',
  BULK_DELETE_FAIL: 'BULK_DELETE_FAIL',
  CLOSE_ALERT: 'CLOSE_ALERT',
  SORT_DOCUMENTS: 'SORT_DOCUMENTS',
  FORM_VALUE_CHANGE: searchTypes.FORM_VALUE_CHANGE,
  SEARCH_VALUE_CHANGE: searchTypes.SEARCH_VALUE_CHANGE,
  CLEAN_PROJECT_LIST_REQUEST: 'CLEAN_PROJECT_LIST_REQUEST',
  CLEAN_PROJECT_LIST_SUCCESS: 'CLEAN_PROJECT_LIST_SUCCESS',
  CLEAN_PROJECT_LIST_FAIL: 'CLEAN_PROJECT_LIST_FAIL',
  ON_DELETE_ONE_FILE: 'ON_DELETE_ONE_FILE',
  BULK_REMOVE_PROJECT_REQUEST: 'BULK_REMOVE_PROJECT_REQUEST',
  ON_TOGGLE_ALL_DOCS: 'ON_TOGGLE_ALL_DOCS',
  ...searchTypes,
  ...uploadTypes
}

export default {
  getDocumentsRequest: makeActionCreator(types.GET_DOCUMENTS_REQUEST),
  handleSelectAll: makeActionCreator(types.ON_SELECT_ALL),
  handlePageChange: makeActionCreator(types.ON_PAGE_CHANGE, 'page'),
  handleRowsChange: makeActionCreator(types.ON_ROWS_CHANGE, 'rowsPerPage'),
  handleSelectOneFile: makeActionCreator(types.ON_SELECT_ONE_FILE, 'id'),
  handleBulkUpdate: makeActionCreator(types.BULK_UPDATE_REQUEST, 'updateData', 'selectedDocs'),
  handleBulkDelete: makeActionCreator(types.BULK_DELETE_REQUEST, 'selectedDocs'),
  closeAlert: makeActionCreator(types.CLOSE_ALERT),
  handleSortRequest: makeActionCreator(types.SORT_DOCUMENTS, 'sortBy', 'sortDirection'),
  handleSearchValueChange: searchActions.updateSearchValue,
  handleFormValueChange: searchActions.updateFormValue,
  cleanDocProjectList: makeActionCreator(types.CLEAN_PROJECT_LIST_REQUEST, 'projectMeta'),
  handleDeleteOneFile: makeActionCreator(types.ON_DELETE_ONE_FILE, 'id'),
  handleBulkProjectRemove: makeActionCreator(types.BULK_REMOVE_PROJECT_REQUEST, 'projectMeta', 'selectedDocs'),
  toggleAllDocs: makeActionCreator(types.ON_TOGGLE_ALL_DOCS)
}

export const projectAutocomplete = {
  ...makeAutocompleteActionCreators('PROJECT', '_BULK')
}

export const jurisdictionAutocomplete = {
  ...makeAutocompleteActionCreators('JURISDICTION', '_BULK')
}
