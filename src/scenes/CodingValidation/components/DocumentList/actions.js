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
  TOGGLE_CODER_ANNOTATIONS: 'TOGGLE_CODER_ANNOTATIONS',
  TOGGLE_ANNOTATION_MODE: 'TOGGLE_ANNOTATION_MODE',
  TOGGLE_VIEW_ANNOTATIONS: 'TOGGLE_VIEW_ANNOTATIONS',
  CHANGE_ANNOTATION_INDEX: 'CHANGE_ANNOTATION_INDEX',
  RESET_SCROLL_TOP: 'RESET_SCROLL_TOP',
  CLEAR_DOC_SELECTED: 'CLEAR_DOC_SELECTED',
  HIDE_ANNO_MODE_ALERT: 'HIDE_ANNO_MODE_ALERT',
  FLUSH_STATE: 'FLUSH_STATE',
  UPDATE_ANNOTATIONS: 'UPDATE_ANNOTATIONS'
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
  toggleCoderAnnotations: makeActionCreator(types.TOGGLE_CODER_ANNOTATIONS, 'userId', 'isUserAnswerSelected'),
  toggleAnnotationMode: makeActionCreator(types.TOGGLE_ANNOTATION_MODE, 'questionId', 'answerId', 'enabled'),
  toggleViewAnnotations: makeActionCreator(types.TOGGLE_VIEW_ANNOTATIONS, 'questionId', 'answerId', 'users'),
  hideAnnoModeAlert: makeActionCreator(types.HIDE_ANNO_MODE_ALERT),
  changeAnnotationIndex: makeActionCreator(types.CHANGE_ANNOTATION_INDEX, 'index'),
  resetScrollTop: makeActionCreator(types.RESET_SCROLL_TOP)
}
