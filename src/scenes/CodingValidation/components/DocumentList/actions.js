import makeActionCreator from 'utils/makeActionCreator'

export const types = {
  GET_APPROVED_DOCUMENTS_REQUEST: 'GET_APPROVED_DOCUMENTS_REQUEST',
  GET_APPROVED_DOCUMENTS_SUCCESS: 'GET_APPROVED_DOCUMENTS_SUCCESS',
  GET_APPROVED_DOCUMENTS_FAIL: 'GET_APPROVED_DOCUMENTS_FAIL',
  GET_DOC_CONTENTS_REQUEST: 'GET_DOC_CONTENTS_REQUEST',
  GET_DOC_CONTENTS_FAIL: 'GET_DOC_CONTENTS_FAIL',
  GET_DOC_CONTENTS_SUCCESS: 'GET_DOC_CONTENTS_SUCCESS',
  ENABLE_ANNOTATION_MODE: 'ENABLE_ANNOTATION_MODE',
  DISABLE_ANNOTATION_MODE: 'DISABLE_ANNOTATION_MODE',
  ON_SAVE_ANNOTATION: 'ON_SAVE_ANNOTATION',
  CLEAR_DOC_SELECTED: 'CLEAR_DOC_SELECTED'
}

export default {
  getApprovedDocumentsRequest: makeActionCreator(types.GET_APPROVED_DOCUMENTS_REQUEST,
    'projectId',
    'jurisdictionId',
    'page'
  ),
  clearDocSelected: makeActionCreator(types.CLEAR_DOC_SELECTED),
  getDocumentContentsRequest: makeActionCreator(types.GET_DOC_CONTENTS_REQUEST, 'id'),
  enableAnnotationMode: makeActionCreator(types.ENABLE_ANNOTATION_MODE),
  disableAnnotationMode: makeActionCreator(types.DISABLE_ANNOTATION_MODE),
  saveAnnotation: makeActionCreator(types.ON_SAVE_ANNOTATION, 'annotation')
}