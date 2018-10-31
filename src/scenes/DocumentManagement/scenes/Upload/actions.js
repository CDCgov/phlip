import makeActionCreator from 'utils/makeActionCreator'

export const types = {
  UPLOAD_DOCUMENTS_REQUEST: 'UPLOAD_DOCUMENTS_REQUEST',
  UPLOAD_DOCUMENTS_SUCCESS: 'UPLOAD_DOCUMENTS_SUCCESS',
  UPLOAD_DOCUMENTS_FAIL: 'UPLOAD_DOCUMENTS_FAIL',
  VERIFY_UPLOAD_REQUEST: 'VERIFY_UPLOAD_REQUEST',
  VERIFY_RETURN_DUPLICATE_FILES: 'VERIFY_RETURN_DUPLICATE_FILES',
  VERIFY_RETURN_NO_DUPLICATES: 'VERIFY_RETURN_NO_DUPLICATES',
  VERIFY_UPLOAD_FAIL: 'VERIFY_UPLOAD_FAIL',
  ADD_SELECTED_DOCS: 'ADD_SELECTED_DOCS',
  UPDATE_DOC_PROPERTY: 'UPDATE_DOC_PROPERTY',
  CLEAR_SELECTED_FILES: 'CLEAR_SELECTED_FILES',
  REMOVE_TAG: 'REMOVE_TAG',
  ADD_TAG: 'ADD_TAG',
  REMOVE_DOC: 'REMOVE_DOC',
  REMOVE_DUPLICATE: 'REMOVE_DUPLICATE',
  CLOSE_ALERT: 'CLOSE_ALERT',
  OPEN_ALERT: 'OPEN_ALERT',
  EXTRACT_INFO_REQUEST: 'EXTRACT_INFO_REQUEST',
  EXTRACT_INFO_SUCCESS: 'EXTRACT_INFO_SUCCESS',
  EXTRACT_INFO_FAIL: 'EXTRACT_INFO_FAIL',
  SEARCH_JURISDICTION_LIST_REQUEST: 'SEARCH_JURISDICTION_LIST_REQUEST',
  SEARCH_JURISDICTION_LIST_SUCCESS: 'SEARCH_JURISDICTION_LIST_SUCCESS',
  SEARCH_JURISDICTION_LIST_FAIL: 'SEARCH_JURISDICTION_LIST_FAIL',
  SEARCH_PROJECT_LIST_REQUEST: 'SEARCH_PROJECT_LIST_REQUEST',
  SEARCH_PROJECT_LIST_SUCCESS: 'SEARCH_PROJECT_LIST_SUCCESS',
  SEARCH_PROJECT_LIST_FAIL: 'SEARCH_PROJECT_LIST_FAIL',
  ON_SEARCH_VALUE_CHANGE: 'ON_SEARCH_VALUE_CHANGE',
  ON_PROJECT_SUGGESTION_SELECTED: 'ON_PROJECT_SUGGESTION_SELECTED',
  ON_JURISDICTION_SUGGESTION_SELECTED: 'ON_JURISDICTION_SUGGESTION_SELECTED',
  CLEAR_SUGGESTIONS: 'CLEAR_SUGGESTIONS',
  REJECT_NO_PROJECT_SELECTED: 'REJECT_NO_PROJECT_SELECTED',
  RESET_FAILED_UPLOAD_VALIDATION: 'RESET_FAILED_UPLOAD_VALIDATION',
  REJECT_EMPTY_JURISDICTIONS: 'REJECT_EMPTY_JURISDICTIONS',
  TOGGLE_ROW_EDIT_MODE: 'TOGGLE_ROW_EDIT_MODE',
  ROW_SEARCH_JURISDICTION_SUCCESS: 'ROW_SEARCH_JURISDICTION_SUCCESS',
  CLEAR_ROW_JURISDICTION_SUGGESTIONS: 'CLEAR_ROW_JURISDICTION_SUGGESTIONS',
  EXTRACT_INFO_SUCCESS_NO_DOCS: 'EXTRACT_INFO_SUCCESS_NO_DOCS',
  MERGE_INFO_WITH_DOCS: 'MERGE_INFO_WITH_DOCS'
}

export default {
  uploadDocumentsRequest: makeActionCreator(types.UPLOAD_DOCUMENTS_REQUEST, 'selectedDocs'),
  verifyUploadRequest: makeActionCreator(types.VERIFY_UPLOAD_REQUEST, 'selectedDocs' ),
  updateDocumentProperty: makeActionCreator(types.UPDATE_DOC_PROPERTY, 'index', 'property', 'value'),
  addSelectedDocs: makeActionCreator(types.ADD_SELECTED_DOCS, 'selectedDocs'),
  clearSelectedFiles: makeActionCreator(types.CLEAR_SELECTED_FILES),
  removeDoc: makeActionCreator(types.REMOVE_DOC, 'index'),
  removeTag: makeActionCreator(types.REMOVE_TAG, 'index', 'tag', 'tagIndex'),
  addTag: makeActionCreator(types.ADD_TAG, 'index', 'tag'),
  closeAlert: makeActionCreator(types.CLOSE_ALERT),
  openAlert: makeActionCreator(types.OPEN_ALERT, 'text', 'title'),
  removeDuplicate: makeActionCreator(types.REMOVE_DUPLICATE, 'index', 'fileName'),
  extractInfoRequest: makeActionCreator(types.EXTRACT_INFO_REQUEST, 'infoSheetFormData', 'infoSheet'),
  searchJurisdictionListRequest: makeActionCreator(types.SEARCH_JURISDICTION_LIST_REQUEST, 'searchString', 'index'),
  searchProjectListRequest: makeActionCreator(types.SEARCH_PROJECT_LIST_REQUEST, 'searchString'),
  onProjectSuggestionSelected: makeActionCreator(types.ON_PROJECT_SUGGESTION_SELECTED, 'project'),
  onJurisdictionSuggestionSelected: makeActionCreator(types.ON_JURISDICTION_SUGGESTION_SELECTED, 'jurisdiction'),
  onSearchValueChange: makeActionCreator(types.ON_SEARCH_VALUE_CHANGE, 'searchType', 'value'),
  clearSuggestions: makeActionCreator(types.CLEAR_SUGGESTIONS, 'suggestionType'),
  resetFailedUploadValidation: makeActionCreator(types.RESET_FAILED_UPLOAD_VALIDATION),
  toggleRowEditMode: makeActionCreator(types.TOGGLE_ROW_EDIT_MODE, 'index', 'property'),
  clearRowJurisdictionSuggestions: makeActionCreator(types.CLEAR_ROW_JURISDICTION_SUGGESTIONS, 'index'),
  mergeInfoWithDocs: makeActionCreator(types.MERGE_INFO_WITH_DOCS, 'docs')
}