import makeActionCreator from 'utils/makeActionCreator'

export const types = {
  GET_APPROVED_DOCUMENTS_REQUEST: 'GET_APPROVED_DOCUMENTS_REQUEST',
  GET_APPROVED_DOCUMENTS_SUCCESS: 'GET_APPROVED_DOCUMENTS_SUCCESS',
  GET_APPROVED_DOCUMENTS_FAIL: 'GET_APPROVED_DOCUMENTS_FAIL',
  GET_DOC_CONTENTS_REQUEST: 'GET_DOC_CONTENTS_REQUEST',
  GET_DOC_CONTENTS_FAIL: 'GET_DOC_CONTENTS_FAIL',
  GET_DOC_CONTENTS_SUCCESS: 'GET_DOC_CONTENTS_SUCCESS',
  ON_SAVE_ANNOTATION: 'ON_SAVE_ANNOTATION',
  ON_REMOVE_ANNOTATION: 'ON_REMOVE_ANNOTATION',
  SHOW_CODER_ANNOTATIONS: 'SHOW_CODER_ANNOTATIONS',
  SHOW_ALL_ANNOTATIONS: 'SHOW_ALL_ANNOTATIONS',
  SHOW_VALIDATOR_ANNOTATIONS: 'SHOW_VALIDATOR_ANNOTATIONS',
  TOGGLE_ANNOTATION_MODE: 'TOGGLE_ANNOTATION_MODE',
  CLEAR_DOC_SELECTED: 'CLEAR_DOC_SELECTED',
  FLUSH_STATE: 'FLUSH_STATE'
}

export default {
  getApprovedDocumentsRequest: makeActionCreator(
    types.GET_APPROVED_DOCUMENTS_REQUEST,
    'projectId',
    'jurisdictionId',
    'page'
  ),
  clearDocSelected: makeActionCreator(types.CLEAR_DOC_SELECTED),
  getDocumentContentsRequest: makeActionCreator(types.GET_DOC_CONTENTS_REQUEST, 'id'),
  saveAnnotation: makeActionCreator(types.ON_SAVE_ANNOTATION, 'annotation', 'answerId', 'questionId'),
  removeAnnotation: makeActionCreator(types.ON_REMOVE_ANNOTATION, 'index', 'answerId', 'questionId'),
  showCoderAnnotations: makeActionCreator(types.SHOW_CODER_ANNOTATIONS, 'userId', 'questionId', 'answerId'),
  showValAnnotations: makeActionCreator(types.SHOW_VALIDATOR_ANNOTATIONS, 'userId', 'questionId', 'answerId'),
  showAllAnnotations: makeActionCreator(types.SHOW_ALL_ANNOTATIONS, 'questionId', 'answerId'),
  toggleAnnotationMode: makeActionCreator(types.TOGGLE_ANNOTATION_MODE, 'questionId', 'answerId', 'enabled')
}
