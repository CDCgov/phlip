import { createLogic } from 'redux-logic'
import { types } from './actions'

const getDocumentContentsLogic = createLogic({
  type: types.GET_DOCUMENT_CONTENTS_REQUEST,
  async process({ getState, docApi, action }, dispatch, done) {
    try {
      const content = await docApi.getDocumentContents({}, {}, { docId: action.id })
      dispatch({ type: types.GET_DOCUMENT_CONTENTS_SUCCESS, payload: content })
    } catch (err) {
      dispatch({ type: types.GET_DOCUMENT_CONTENTS_FAIL })
    }
    done()
  }
})

export default [
  getDocumentContentsLogic
]