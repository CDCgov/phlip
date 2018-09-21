import { createLogic } from 'redux-logic'
import { types } from './actions'

const verifyUploadLogic = createLogic({
  type: types.VERIFY_UPLOAD_REQUEST,
  async process({ docApi, action }, dispatch, done) {
    try {
      const response = await docApi.verifyUpload(action.selectedDocs)
      if (response.duplicates.length > 0) {
        dispatch({ type: types.VERIFY_RETURN_DUPLICATE_FILES, payload: { duplicates: response.duplicates } })
      } else {
        dispatch({ type: types.VERIFY_RETURN_NO_DUPLICATES })
      }
    } catch (error) {
      dispatch({ type: types.VERIFY_UPLOAD_FAIL, payload: { error: 'Failed to verify upload, please try again.' } })
    }
    done()
  }
})

const uploadRequestLogic = createLogic({
  type: types.UPLOAD_DOCUMENTS_REQUEST,
  async process({ docApi, action }, dispatch, done) {
    try {
      const docs = await docApi.upload(action.selectedDocs)
      docs.files.map(doc => {
        const { content, ...otherDocProps } = doc
        return otherDocProps
      })
      dispatch({ type: types.UPLOAD_DOCUMENTS_SUCCESS, payload: { docs: docs.files } })
    } catch (err) {
      dispatch({ type: types.UPLOAD_DOCUMENTS_FAIL, payload: { error: 'Failed to upload documents, please try again.' } })
    }
    done()
  }
})

export default [verifyUploadLogic, uploadRequestLogic]