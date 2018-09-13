import { createLogic } from 'redux-logic'
import { types } from './actions'

const uploadRequestLogic = createLogic({
  type: types.UPLOAD_DOCUMENTS_REQUEST,
  async process({ docApi }) {

  }
})

export default [uploadRequestLogic]