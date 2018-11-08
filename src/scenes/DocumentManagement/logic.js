import uploadLogic from './scenes/Upload/logic'
import { createLogic } from 'redux-logic'
import { types } from './actions'
import { types as jurisdictionTypes } from 'data/jurisdictions/actions'
import { types as projectTypes } from 'data/projects/actions'

const getDocLogic = createLogic({
  type: types.GET_DOCUMENTS_REQUEST,
  async process({ getState, docApi }, dispatch, done) {
    try {
      const documents = await docApi.getDocs()
      let jurisdictions = [], projects = []

      documents.forEach((doc, i) => {
        doc.projects.forEach(projectId => {
          if (!projects.includes(projectId)) {
            dispatch({ type: projectTypes.GET_PROJECT_REQUEST, projectId })
            projects.push(projectId)
          }
        })
        doc.jurisdictions.forEach(jurisdictionId => {
          if (!jurisdictions.includes(jurisdictionId)) {
            dispatch({ type: jurisdictionTypes.GET_JURISDICTION_REQUEST, jurisdictionId })
            jurisdictions.push(jurisdictionId)
          }
        })
      })
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