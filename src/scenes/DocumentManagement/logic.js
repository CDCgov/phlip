import uploadLogic from './scenes/Upload/logic'
import { createLogic } from 'redux-logic'
import { types } from './actions'

const getDocLogic = createLogic({
  type: types.GET_DOCUMENTS_REQUEST,
  async process({ getState, docApi }, dispatch, done) {
    try {
      const documents = await docApi.getDocs()
      dispatch({ type: types.GET_DOCUMENTS_SUCCESS, payload: documents })
    } catch (e) {
      dispatch({ type: types.GET_DOCUMENTS_FAIL, payload: 'Failed to get documents' })
    }
    done()
  }
})

export default [
  getDocLogic,
  ...uploadLogic
]