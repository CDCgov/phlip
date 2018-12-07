import { createLogic } from 'redux-logic'
import { types } from './actions'

const getApprovedDocumentsLogic = createLogic({
  type: [types.GET_APPROVED_DOCUMENTS_REQUEST],
  async process({ getState, docApi, api, action }, dispatch, done) {
    console.log('here')
    try {
      const docs = await docApi.getDocumentsByProjectJurisdiction({},
        {},
        { projectId: action.projectId, jurisdictionId: action.jurisdictionId })
      dispatch({ type: `${types.GET_APPROVED_DOCUMENTS_SUCCESS}_${action.page.toUpperCase()}`, payload: docs })
      done()
    } catch (err) {
      dispatch({ type: `${types.GET_APPROVED_DOCUMENTS_FAIL}_${action.page.toUpperCase()}` })
      done()
    }
  }
})

export default [
  getApprovedDocumentsLogic
]