import makeActionCreator from 'utils/makeActionCreator'
import { makeAutocompleteActionCreators } from 'data/autocomplete/actions'

export const types = {
  UPLOAD_DOCUMENTS_REQUEST: 'UPLOAD_DOCUMENTS_REQUEST',
  UPLOAD_DOCUMENTS_SUCCESS: 'UPLOAD_DOCUMENTS_SUCCESS',
  UPLOAD_DOCUMENTS_FAIL: 'UPLOAD_DOCUMENTS_FAIL',
  VERIFY_RETURN_DUPLICATE_FILES: 'VERIFY_RETURN_DUPLICATE_FILES',
  ADD_SELECTED_DOCS: 'ADD_SELECTED_DOCS',
  UPDATE_DOC_PROPERTY: 'UPDATE_DOC_PROPERTY',
  CLEAR_SELECTED_FILES: 'CLEAR_SELECTED_FILES',
  REMOVE_DOC: 'REMOVE_DOC',
  REMOVE_DUPLICATE: 'REMOVE_DUPLICATE',
  CLOSE_ALERT: 'CLOSE_ALERT',
  OPEN_ALERT: 'OPEN_ALERT',
  EXTRACT_INFO_REQUEST: 'EXTRACT_INFO_REQUEST',
  EXTRACT_INFO_SUCCESS: 'EXTRACT_INFO_SUCCESS',
  EXTRACT_INFO_FAIL: 'EXTRACT_INFO_FAIL',
  REJECT_NO_PROJECT_SELECTED: 'REJECT_NO_PROJECT_SELECTED',
  RESET_FAILED_UPLOAD_VALIDATION: 'RESET_FAILED_UPLOAD_VALIDATION',
  REJECT_EMPTY_JURISDICTIONS: 'REJECT_EMPTY_JURISDICTIONS',
  TOGGLE_ROW_EDIT_MODE: 'TOGGLE_ROW_EDIT_MODE',
  SEARCH_ROW_SUGGESTIONS_SUCCESS_JURISDICTION: 'SEARCH_ROW_SUGGESTIONS_SUCCESS_JURISDICTION',
  CLEAR_ROW_JURISDICTION_SUGGESTIONS: 'CLEAR_ROW_JURISDICTION_SUGGESTIONS',
  EXTRACT_INFO_SUCCESS_NO_DOCS: 'EXTRACT_INFO_SUCCESS_NO_DOCS',
  MERGE_INFO_WITH_DOCS: 'MERGE_INFO_WITH_DOCS'
}

export default {
  uploadDocumentsRequest: makeActionCreator(types.UPLOAD_DOCUMENTS_REQUEST, 'selectedDocsFormData', 'selectedDocs'),
  updateDocumentProperty: makeActionCreator(types.UPDATE_DOC_PROPERTY, 'index', 'property', 'value'),
  addSelectedDocs: makeActionCreator(types.ADD_SELECTED_DOCS, 'selectedDocs'),
  clearSelectedFiles: makeActionCreator(types.CLEAR_SELECTED_FILES),
  removeDoc: makeActionCreator(types.REMOVE_DOC, 'index'),
  closeAlert: makeActionCreator(types.CLOSE_ALERT),
  openAlert: makeActionCreator(types.OPEN_ALERT, 'text', 'title'),
  removeDuplicate: makeActionCreator(types.REMOVE_DUPLICATE, 'index', 'fileName'),
  extractInfoRequest: makeActionCreator(types.EXTRACT_INFO_REQUEST, 'infoSheetFormData', 'infoSheet'),
  resetFailedUploadValidation: makeActionCreator(types.RESET_FAILED_UPLOAD_VALIDATION),
  toggleRowEditMode: makeActionCreator(types.TOGGLE_ROW_EDIT_MODE, 'index', 'property'),
  clearRowJurisdictionSuggestions: makeActionCreator(types.CLEAR_ROW_JURISDICTION_SUGGESTIONS, 'index'),
  mergeInfoWithDocs: makeActionCreator(types.MERGE_INFO_WITH_DOCS, 'docs')
}

export const projectAutocomplete = {
  ...makeAutocompleteActionCreators('PROJECT', '')
}

export const jurisdictionAutocomplete = {
  ...makeAutocompleteActionCreators('JURISDICTION', '')
}

