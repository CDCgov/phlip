import makeActionCreator from 'utils/makeActionCreator'

export const types = {
  UPLOAD_DOCUMENTS_REQUEST: 'UPLOAD_DOCUMENTS_REQUEST',
  UPLOAD_DOCUMENTS_SUCCESS: 'UPLOAD_DOCUMENTS_SUCCESS',
  UPLOAD_DOCUMENTS_FAIL: 'UPLOAD_DOCUMENTS_FAIL',
  ADD_SELECTED_DOCS: 'ADD_SELECTED_DOCS',
  UPDATE_DOC_PROPERTY: 'UPDATE_DOC_PROPERTY'
}

export default {
  uploadDocumentsRequest: makeActionCreator(types.UPLOAD_DOCUMENTS_REQUEST, 'selectedDocs'),
  updateDocumentProperty: makeActionCreator(types.UPDATE_DOC_PROPERTY, 'index', 'property', 'value'),
  addSelectedDocs: makeActionCreator(types.ADD_SELECTED_DOCS, 'selectedDocs')
}