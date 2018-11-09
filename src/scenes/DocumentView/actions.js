import makeActionCreator from 'utils/makeActionCreator'

export const types = {
  INIT_STATE_WITH_DOC: 'INIT_STATE_WITH_DOC',
  GET_DOCUMENT_CONTENTS_REQUEST: 'GET_DOCUMENT_CONTENTS_REQUEST',
  GET_DOCUMENT_CONTENTS_SUCCESS: 'GET_DOCUMENT_CONTENTS_SUCCESS',
  GET_DOCUMENT_CONTENTS_FAIL: 'GET_DOCUMENT_CONTENTS_FAIL'
}

export default {
  initState: makeActionCreator(types.INIT_STATE_WITH_DOC, 'doc'),
  getDocumentContentsRequest: makeActionCreator(types.GET_DOCUMENT_CONTENTS_REQUEST, 'id')
}