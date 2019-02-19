import uploadLogic from './scenes/Upload/logic'
import { createLogic } from 'redux-logic'
import { types } from './actions'
import { types as jurisdictionTypes } from 'data/jurisdictions/actions'
import { types as projectTypes } from 'data/projects/actions'

const getDocLogic = createLogic({
  type: types.GET_DOCUMENTS_REQUEST,
  async process({ getState, docApi, api }, dispatch, done) {
    try {
      let documents = await docApi.getDocs()
      let projects = getState().data.projects.byId
      let jurisdictions = getState().data.jurisdictions.byId

      const docs = documents.map(doc => {
        return new Promise(async resolve => {
          doc.projectList = []
          doc.jurisdictionList = []
          doc.uploadedByName = `${doc.uploadedBy.firstName} ${doc.uploadedBy.lastName}`

          for (let i=0; i<doc.projects.length; i++) {
            const projectId = doc.projects[i]
            let project = projects[projectId]
            if (!projects[projectId]) {
              try {
                project = await api.getProject({}, {}, { projectId: projectId })
                projects[projectId] = project
                dispatch({ type: projectTypes.ADD_PROJECT, payload: project })
              } catch (err) {
                console.log('failed to get project')
              }
            }
            doc.projectList.push(project.name)
          }

          await Promise.all(doc.projectList)

          for (let i=0; i<doc.jurisdictions.length; i++) {
            const jurisdictionId = doc.jurisdictions[i]
            let jurisdiction = jurisdictions[jurisdictionId]
            if (!jurisdictions[jurisdictionId]) {
              try {
                jurisdiction = await api.getJurisdiction({}, {}, { jurisdictionId: jurisdictionId })
                jurisdictions[jurisdictionId] = jurisdiction
                dispatch({ type: jurisdictionTypes.ADD_JURISDICTION, payload: jurisdiction })
              } catch (err) {
                console.log('failed to get jurisdiction')
              }
            }
            doc.jurisdictionList.push(jurisdiction.name)
          }

          await Promise.all(doc.jurisdictionList)

          doc.projectList = doc.projectList.join('|')
          doc.jurisdictionList = doc.jurisdictionList.join('|')
          resolve(doc)
        })
      })

      Promise.all(docs).then(() => {
        dispatch({ type: types.GET_DOCUMENTS_SUCCESS, payload: documents })
        done()
      })
    } catch (e) {
      dispatch({ type: types.GET_DOCUMENTS_FAIL, payload: 'Failed to get documents' })
      done()
    }
  }
})

const bulkUpdateLogic = createLogic({
  type: types.BULK_UPDATE_REQUEST,
  async process({ docApi, action, getState }, dispatch, done) {
    try {
      await docApi.bulkUpdateDoc({ meta: action.updateData, docIds: action.selectedDocs })
      if (action.updateData.updateType !== null && action.updateData.updateType === 'jurisdictions') {
        dispatch({
          type: jurisdictionTypes.ADD_JURISDICTION,
          payload: action.updateData.updateProJur
        })
      }

      if (action.updateData.updateType !== null && action.updateData.updateType === 'projects') {
        dispatch({
          type: projectTypes.ADD_PROJECT,
          payload: action.updateData.updateProJur
        })
      }
      // update doc meta data

      let existingDocs = getState().scenes.docManage.main.documents.byId
      action.selectedDocs.forEach(function (docToUpdate) {
        if (action.updateData.updateType === 'projects') {
          if (existingDocs[docToUpdate].projects.indexOf(action.updateData.updateProJur.id) === -1) {
            existingDocs[docToUpdate].projects = [
              ...existingDocs[docToUpdate].projects, action.updateData.updateProJur.id
            ]
          }
          if (existingDocs[docToUpdate].projectList.indexOf(action.updateData.updateProJur.name) === -1) {
            existingDocs[docToUpdate].projectList = existingDocs[docToUpdate].projectList.concat('|', action.updateData.updateProJur.name)
          }
        } else {
          if (existingDocs[docToUpdate].jurisdictions.indexOf(action.updateData.updateProJur.id) === -1) {
            existingDocs[docToUpdate].jurisdictions = [
              ...existingDocs[docToUpdate].jurisdictions, action.updateData.updateProJur.id
            ]
          }
          if (existingDocs[docToUpdate].jurisdictionList.indexOf(action.updateData.updateProJur.name) === -1) {
            existingDocs[docToUpdate].jurisdictionList = existingDocs[docToUpdate].jurisdictionList.concat('|', action.updateData.updateProJur.name)
          }
        }
      })
      //let updatedDocs = [...Object.values(getState().scenes.docManage.main.documents.byId).filter(doc =>
      // action.selectedDocs.includes(doc._id))]

      dispatch({ type: types.BULK_UPDATE_SUCCESS, payload: existingDocs })
      done()
    } catch (err) {
      dispatch({
        type: types.BULK_UPDATE_FAIL,
        payload: { error: 'Failed to update documents, please try again.' }
      })
      done()
    }
  }
})
const bulkDeleteLogic = createLogic({
  type: types.BULK_DELETE_REQUEST,
  async process({ getState, docApi, action }, dispatch, done) {
    // const checkedDocs = getState().scenes.docManage.main.documents.checked
    try {
      const deleteResult = await docApi.bulkDeleteDoc({ 'docIds': action.selectedDocs })
      dispatch({ type: types.BULK_DELETE_SUCCESS, payload: deleteResult })
      done()
    } catch (e) {
      dispatch({ type: types.BULK_DELETE_FAIL, payload: 'Failed to delete documents' })
    }
    done()
  }
})

// const getJurisdictionName = (getState,jurisdictionId) => {
//     var promise = new Promise(function(resolve, reject) {
//         window.setTimeout(function() {
//             resolve('done!');
//         });
//     });
//     return promise;
//
//     if (getState().data.jurisdictions.byId[jurisdictionId] !== undefined) {
//         return getState().data.jurisdictions.byId[jurisdictionId].name
//     }
// }

export default [
  getDocLogic,
  bulkUpdateLogic,
  bulkDeleteLogic,
  ...uploadLogic
]