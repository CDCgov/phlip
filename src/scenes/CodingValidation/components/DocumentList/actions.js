import makeActionCreator from 'utils/makeActionCreator'

export const types = {
  GET_APPROVED_DOCUMENTS_REQUEST: 'GET_APPROVED_DOCUMENTS_REQUEST',
  GET_APPROVED_DOCUMENTS_SUCCESS: 'GET_APPROVED_DOCUMENTS_SUCCESS',
  GET_APPROVED_DOCUMENTS_FAIL: 'GET_APPROVED_DOCUMENTS_FAIL',
  GET_DOC_CONTENTS_REQUEST: 'GET_DOC_CONTENTS_REQUEST',
  GET_DOC_CONTENTS_FAIL: 'GET_DOC_CONTENTS_FAIL',
  GET_DOC_CONTENTS_SUCCESS: 'GET_DOC_CONTENTS_SUCCESS',
  ON_SAVE_ANNOTATION: 'ON_SAVE_ANNOTATION',
  CLEAR_DOC_SELECTED: 'CLEAR_DOC_SELECTED',
  CLEAR_ALERT: 'CLEAR_ALERT',
  FLUSH_STATE: 'FLUSH_STATE'
}

export default {
  getApprovedDocumentsRequest: makeActionCreator(types.GET_APPROVED_DOCUMENTS_REQUEST,
    'projectId',
    'jurisdictionId',
    'page'
  ),
  clearDocSelected: makeActionCreator(types.CLEAR_DOC_SELECTED),
  getDocumentContentsRequest: makeActionCreator(types.GET_DOC_CONTENTS_REQUEST, 'id'),
  saveAnnotation: makeActionCreator(types.ON_SAVE_ANNOTATION, 'annotation', 'answerId', 'questionId'),
  clearAlert: makeActionCreator(types.CLEAR_ALERT)
}