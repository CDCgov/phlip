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
        let tmpProList = []
        let tmpJurList = []
        doc.projectList = []
        doc.jurisdictionList = []
        doc.uploadedByName = `${doc.uploadedBy.firstName} ${doc.uploadedBy.lastName}`
        doc.projects.forEach(projectId => {
          if (!projects.includes(projectId)) {
            dispatch({ type: projectTypes.GET_PROJECT_REQUEST, projectId })
            projects.push(projectId)
          }
          try {
            if (getState().data.projects.byId[projectId] === undefined) {
              tmpProList.push('project not found')
            } else {
              tmpProList.push(getState().data.projects.byId[projectId].name)
            }
          } catch (e) {
            tmpProList.push('project not found')
          }
        })
        doc.jurisdictions.forEach(jurisdictionId => {
          if (!jurisdictions.includes(jurisdictionId)) {
            dispatch({ type: jurisdictionTypes.GET_JURISDICTION_REQUEST, jurisdictionId })
            jurisdictions.push(jurisdictionId)
          }
          try {
            if (getState().data.jurisdictions.byId[jurisdictionId] === undefined) {
              tmpJurList.push('jurisdiction not found')
            } else {
              tmpJurList.push(getState().data.jurisdictions.byId[jurisdictionId].name)
            }
          } catch (e) {
            tmpJurList.push('jurisdiction not found')
          }
        })
        doc.projectList = tmpProList.join('|')
        doc.jurisdictionList = tmpJurList.join('|')
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