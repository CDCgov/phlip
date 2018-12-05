import makeActionCreator from 'utils/makeActionCreator'


export const types = {
  INIT_STATE_WITH_DOC: 'INIT_STATE_WITH_DOC',
  GET_DOCUMENT_CONTENTS_REQUEST: 'GET_DOCUMENT_CONTENTS_REQUEST',
  GET_DOCUMENT_CONTENTS_SUCCESS: 'GET_DOCUMENT_CONTENTS_SUCCESS',
  GET_DOCUMENT_CONTENTS_FAIL: 'GET_DOCUMENT_CONTENTS_FAIL',
  UPDATE_DOC_PROPERTY: 'UPDATE_DOC_PROPERTY',
  UPDATE_DOC_FAIL: 'UPDATE_DOC_FAIL',
  UPDATE_DOC_REQUEST: 'UPDATE_DOC_REQUEST',

}

export default {
  initState: makeActionCreator(types.INIT_STATE_WITH_DOC, 'doc'),
  getDocumentContentsRequest: makeActionCreator(types.GET_DOCUMENT_CONTENTS_REQUEST, 'id'),
  //updateDocRequest : makeActionCreator(types.UPDATE_DOC_REQUEST,'doc'),
  //updateDocumentProperty: makeActionCreator(types.UPDATE_DOC_PROPERTY, 'index', 'property', 'value'),
}