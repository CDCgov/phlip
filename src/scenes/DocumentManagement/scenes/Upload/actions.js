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
  EXTRACT_INFO_SUCCESS: 'EXTRACT_INFO_SUCCESS'
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
  extractInfoRequest: makeActionCreator(types.EXTRACT_INFO_REQUEST, 'excelFile')
}