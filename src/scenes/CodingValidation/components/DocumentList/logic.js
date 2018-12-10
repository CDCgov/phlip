import { createLogic } from 'redux-logic'
import { types } from './actions'

const getApprovedDocumentsLogic = createLogic({
  type: [types.GET_APPROVED_DOCUMENTS_REQUEST],
  async process({ getState, docApi, api, action }, dispatch, done) {
    try {
      const docs = await docApi.getDocumentsByProjectJurisdiction({},
        {},
        { projectId: action.projectId, jurisdictionId: action.jurisdictionId })
      dispatch({ type: types.GET_APPROVED_DOCUMENTS_SUCCESS, payload: docs })
      done()
    } catch (err) {
      dispatch({ type: types.GET_APPROVED_DOCUMENTS_FAIL })
      done()
    }
  }
})

export default [
  getApprovedDocumentsLogic
]