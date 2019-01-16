import { createLogic } from 'redux-logic'
import { types } from './actions'

const saveAnnotationTransformLogic = createLogic({
  type: types.ON_SAVE_ANNOTATION,
  transform({ getState, action }, next) {
    next({
      ...action,
      isCategoryQuestion: getState().scenes.codingValidation.coding.question.isCategoryQuestion,
      selectedCategoryId: getState().scenes.codingValidation.coding.selectedCategoryId
    })
  }
})

const getApprovedDocumentsLogic = createLogic({
  type: [types.GET_APPROVED_DOCUMENTS_REQUEST],
  async process({ docApi, action }, dispatch, done) {
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
  getApprovedDocumentsLogic,
  saveAnnotationTransformLogic
]