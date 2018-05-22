import { createLogic } from 'redux-logic'
import * as types from './actionTypes'

export const downloadPdfLogic = createLogic({
  type: types.DOWNLOAD_PDF_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.DOWNLOAD_PDF_SUCCESS,
    failType: types.DOWNLOAD_PDF_FAIL
  },
  async process({ action, getState, api }) {
    return await api.getHelpPdf({}, { responseType: 'arraybuffer' }, {})
  }
})

export default [downloadPdfLogic]