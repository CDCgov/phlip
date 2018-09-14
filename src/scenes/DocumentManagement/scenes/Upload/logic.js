import { createLogic } from 'redux-logic'
import { types } from './actions'

const uploadRequestLogic = createLogic({
  type: types.UPLOAD_DOCUMENTS_REQUEST,
  async process({ docApi, action }, dispatch, done) {
    try {
      const docs = await docApi.upload(action.selectedDocs)
      dispatch({ type: types.UPLOAD_DOCUMENTS_SUCCESS, payload: { docs } })
    } catch (err) {
      dispatch({ type: types.UPLOAD_DOCUMENTS_FAIL, payload: { error: `Failed to upload docs, ${err}` } })
    }
    done()
  }
})

export default [uploadRequestLogic]