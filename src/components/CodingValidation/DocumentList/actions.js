import makeActionCreator from 'utils/makeActionCreator'

export const types = {
  GET_APPROVED_DOCUMENTS_REQUEST: 'GET_APPROVED_DOCUMENTS_REQUEST',
  GET_APPROVED_DOCUMENTS_SUCCESS: 'GET_APPROVED_DOCUMENTS_SUCCESS',
  GET_APPROVED_DOCUMENTS_FAIL: 'GET_APPROVED_DOCUMENTS_FAIL'
}

export default {
  getApprovedDocumentsRequest: makeActionCreator(types.GET_APPROVED_DOCUMENTS_REQUEST,
    'projectId',
    'jurisdictionId',
    'page')
}