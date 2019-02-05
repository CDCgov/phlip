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
const bulkUpdateLogic = createLogic({
  type: types.BULK_UPDATE_REQUEST,
  async process({ docApi, action, getState }, dispatch, done) {
    console.log(action.selectedDocs)
    try {
      await docApi.bulkUpdateDoc({meta:action.updateData,docIds: action.selectedDocs})

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
      action.selectedDocs.forEach(function(docToUpdate){
        if(action.updateData.updateType === 'projects') {
          if (existingDocs[docToUpdate].projects.indexOf(action.updateData.updateProJur.id) === -1){
            existingDocs[docToUpdate].projects = [...existingDocs[docToUpdate].projects, action.updateData.updateProJur.id]
          }
          if(existingDocs[docToUpdate].projectList.indexOf(action.updateData.updateProJur.name) === -1) {
            existingDocs[docToUpdate].projectList = existingDocs[docToUpdate].projectList.concat('|', action.updateData.updateProJur.name)
          }
        } else {
          if(existingDocs[docToUpdate].jurisdictions.indexOf(action.updateData.updateProJur.id) ===-1) {
            existingDocs[docToUpdate].jurisdictions = [...existingDocs[docToUpdate].jurisdictions, action.updateData.updateProJur.id]
          }
          if (existingDocs[docToUpdate].jurisdictionList.indexOf(action.updateData.updateProJur.name) === -1) {
            existingDocs[docToUpdate].jurisdictionList = existingDocs[docToUpdate].jurisdictionList.concat('|', action.updateData.updateProJur.name)
          }
        }
      })
      //let updatedDocs = [...Object.values(getState().scenes.docManage.main.documents.byId).filter(doc => action.selectedDocs.includes(doc._id))]

      dispatch({ type: types.BULK_UPDATE_SUCCESS, payload: existingDocs})
      done()
    } catch (err) {
      console.log(err)
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
  async process({ getState, docApi,action }, dispatch, done) {
    // const checkedDocs = getState().scenes.docManage.main.documents.checked
    try {
      const deleteResult = await docApi.bulkDeleteDoc({'docIds': action.selectedDocs})
      console.log(deleteResult)
      dispatch({ type: types.BULK_DELETE_SUCCESS, payload: deleteResult })
      done()
    } catch (e) {
      dispatch({ type: types.BULK_DELETE_FAIL, payload: 'Failed to delete documents' })
    }
    done()
  }
})

export default [
  getDocLogic, bulkUpdateLogic,bulkDeleteLogic,
  ...uploadLogic
]