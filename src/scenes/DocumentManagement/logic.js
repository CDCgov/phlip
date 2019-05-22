import uploadLogic from './scenes/Upload/logic'
import { createLogic } from 'redux-logic'
import { types } from './actions'
import { types as jurisdictionTypes } from 'data/jurisdictions/actions'
import { types as projectTypes } from 'data/projects/actions'
import { searchUtils } from 'utils'

/**
 * Search in an array of objects and then matches docs, used for projects / jurisdictions
 * @param matchesArr
 * @param proJurArr
 * @param property
 * @param searchValue
 * @returns {*}
 */
const searchInProOrJur = (matchesArr, proJurArr, property, searchValue) => {
  const matches = searchUtils.searchForMatches(proJurArr, searchValue, ['name']).map(prop => prop.id)
  return matchesArr.filter(doc => doc[property].some(id => matches.includes(id)))
}

/*
 *  Used to determine the search strings and find matching documents
 */
const resetFilter = (docs, stringSearch, projectFilter, jurisdictionFilter, jurisdictions, projects) => {
  let matches = docs
  let pieces = []
  
  const searchFields = {
    name: 'name',
    uploadedBy: 'uploadedByName',
    uploadedDate: 'uploadedDate',
    project: 'projects',
    jurisdiction: 'jurisdictions'
  }
  
  const regEnd = /\)$/
  const regBegin = /^\(/
  
  // Get the different fields that were set
  const searchParams = stringSearch.split(' | ')
  
  // Handle each field // the search is done with AND and not OR when there are multiple fields set
  searchParams.forEach(searchTerm => {
    const colonIndex = searchTerm.indexOf(':')
    
    // there was a key:value field set and not just one string
    if (colonIndex !== -1 && searchFields.hasOwnProperty(searchTerm.substring(0, colonIndex).trim())) {
      let searchKey = searchTerm.substring(0, colonIndex).trim()
      let searchValue = searchTerm.substring(colonIndex + 1).trim()
      
      // checking if the search value is multi-word beginning with a (
      if (regBegin.test(searchValue)) {
        if (regEnd.test(searchValue)) {
          // the beginning and end of the string are in the same index
          searchValue = searchValue.replace(regBegin, '')
          searchValue = searchValue.replace(regEnd, '')
        } else {
          pieces = searchValue.split(' ')
          if (pieces.length > 1) {
            let foundEnd = false
            for (let i = 1; i < pieces.length; i++) {
              if (foundEnd) break
              if (pieces[i].endsWith(')')) {
                pieces[0] = pieces[0].replace(regBegin, '')
                pieces[i] = pieces[i].replace(regEnd, '')
                const searchStringParams = pieces.splice(0, i + 1)
                searchValue = searchStringParams.join(' ')
                foundEnd = true
              }
            }
          }
        }
      } else {
        // the search term doesn't have parentheses but is multi-worded, use the first word as the search value to
        // search against the search property and then use the remaining words as individual pieces
        if (searchValue.trim().split(' ').length > 1) {
          pieces = searchValue.split(' ')
          searchValue = pieces[0]
          pieces = pieces.splice(1, pieces.length)
        }
      }
      
      const searchProperty = searchFields[searchKey]
      if (searchProperty === 'projects') {
        matches = projectFilter
          ? matches.filter(doc => doc.projects.includes(projectFilter))
          : searchInProOrJur(matches, projects, 'projects', searchValue)
      } else if (searchProperty === 'jurisdictions') {
        matches = jurisdictionFilter
          ? matches.filter(doc => doc.jurisdictions.includes(jurisdictionFilter))
          : searchInProOrJur(matches, jurisdictions, 'jurisdictions', searchValue)
      } else {
        // the search property is something else so search only that property
        matches = searchUtils.searchForMatches(matches, searchValue, [searchProperty])
      }
      pieces.forEach(piece => {
        const m = searchUtils.searchForMatches(matches, piece, ['uploadedByName', 'uploadedDate', 'name'])
        const j = searchInProOrJur(matches, jurisdictions, 'jurisdictions', piece)
        const p = searchInProOrJur(matches, projects, 'projects', piece)
        matches = Array.from(new Set([...m, ...j, ...p]))
      })
    } else {
      // only a string was entered, no colon :
      const m = searchUtils.searchForMatches(matches, searchTerm, ['uploadedByName', 'uploadedDate', 'name'])
      const j = searchInProOrJur(matches, jurisdictions, 'jurisdictions', searchTerm)
      const p = searchInProOrJur(matches, projects, 'projects', searchTerm)
      matches = Array.from(new Set([...m, ...j, ...p]))
    }
  })
  
  return matches
}

/**
 * Determines matching docs
 * @type {Logic<object, undefined, undefined, {}, undefined, string>}
 */
const searchBoxLogic = createLogic({
  type: types.SEARCH_VALUE_CHANGE,
  transform({ getState, action }, next) {
    const projects = Object.values(getState().data.projects.byId)
    const jurisdictions = Object.values(getState().data.jurisdictions.byId)
    const docs = [...Object.values(getState().scenes.docManage.main.documents.byId)]
    const matches = resetFilter(
      docs,
      action.value,
      action.form.project.id,
      action.form.jurisdiction.id,
      jurisdictions,
      projects
    )
    next({
      ...action,
      payload: matches
    })
  }
})

/**
 * Gets documents -- when the user goes to the doc management hone page
 * @type {Logic<object, undefined, undefined, {api?: *, docApi?: *, getState?: *}, undefined, string>}
 */
const getDocLogic = createLogic({
  type: types.GET_DOCUMENTS_REQUEST,
  async process({ getState, docApi, api }, dispatch, done) {
    try {
      let documents = await docApi.getDocs()
      documents = documents.map(document => ({
        ...document,
        uploadedByName: `${document.uploadedBy.firstName} ${document.uploadedBy.lastName}`
      }))
      dispatch({ type: types.GET_DOCUMENTS_SUCCESS, payload: documents })
      
      let projects = { ...getState().data.projects.byId }
      let jurisdictions = { ...getState().data.jurisdictions.byId }
      
      for (let doc of documents) {
        for (let projectId of doc.projects) {
          if (!projects.hasOwnProperty(projectId)) {
            try {
              const project = await api.getProject({}, {}, { projectId: projectId })
              projects[projectId] = project
              dispatch({ type: projectTypes.ADD_PROJECT, payload: project })
            } catch (err) {
              console.log('Failed to get project')
            }
          }
        }
        
        for (let jurisdictionId of doc.jurisdictions) {
          if (!jurisdictions.hasOwnProperty(jurisdictionId)) {
            try {
              const jurisdiction = await api.getJurisdiction({}, {}, { jurisdictionId: jurisdictionId })
              jurisdictions[jurisdictionId] = jurisdiction
              dispatch({ type: jurisdictionTypes.ADD_JURISDICTION, payload: jurisdiction })
            } catch (err) {
              console.log('Failed to get jurisdiction')
            }
          }
        }
      }
      done()
    } catch (e) {
      dispatch({ type: types.GET_DOCUMENTS_FAIL, payload: 'Failed to get documents' })
      done()
    }
  }
})

/**
 * Bulk updating documents
 * @type {Logic<object, undefined, undefined, {getState?: *, action?: *, docApi?: *}, undefined, string>}
 */
const bulkUpdateLogic = createLogic({
  type: types.BULK_UPDATE_REQUEST,
  async process({ docApi, action, getState }, dispatch, done) {
    try {
      await docApi.bulkUpdateDoc({ meta: action.updateData, docIds: action.selectedDocs })
      if (['projects', 'jurisdictions'].includes(action.updateData.updateType)) {
        dispatch({
          type: action.updateData.updateType === 'jurisdictions'
            ? jurisdictionTypes.ADD_JURISDICTION
            : projectTypes.ADD_PROJECT,
          payload: action.updateData.updateProJur
        })
      }
      
      let existingDocs = getState().scenes.docManage.main.documents.byId
      action.selectedDocs.forEach(docToUpdate => {
        if (action.updateData.updateType === 'status') {
          existingDocs[docToUpdate].status = 'Approved'
        } else {
          const { updateType, updateProJur } = action.updateData
          if (existingDocs[docToUpdate][updateType].indexOf(updateProJur.id) === -1) {
            existingDocs[docToUpdate][updateType] = [
              ...existingDocs[docToUpdate][updateType],
              updateProJur.id
            ]
          }
        }
      })
      
      dispatch({ type: types.BULK_UPDATE_SUCCESS, payload: existingDocs })
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

/**
 * Bulk deleting documents
 * @type {Logic<object, undefined, undefined, {api?: *, docApi?: *, action?: *, getState?: *}, undefined, string>}
 */
const bulkDeleteLogic = createLogic({
  type: types.BULK_DELETE_REQUEST,
  async process({ getState, docApi, action, api }, dispatch, done) {
    try {
      const deleteResult = await docApi.bulkDeleteDoc({ 'docIds': action.selectedDocs })
      action.selectedDocs.map(doc => {
        try {
          api.cleanAnnotations({}, {}, { docId: doc })
        } catch (err) {
          console.log(`failed to remove annotations for doc: ${doc}`)
        }
      })
      dispatch({ type: types.BULK_DELETE_SUCCESS, payload: deleteResult })
      done()
    } catch (e) {
      dispatch({ type: types.BULK_DELETE_FAIL, payload: 'Failed to delete documents' })
    }
    done()
  }
})

/**
 * Send request to the doc-manage-backend to remove the projectId from all documents
 * when succeed, remove all references to project id from redux store
 */
const cleanDocProjectLogic = createLogic({
  type: types.CLEAN_PROJECT_LIST_REQUEST,
  async process({ getState, docApi, action }, dispatch, done) {
    let projectMeta = action.projectMeta
    try {
      await docApi.cleanProject({}, {}, { 'projectId': projectMeta.id })
      let cleannedDocs = getState().scenes.docManage.main.documents.byId
      Object.keys(cleannedDocs).map(docKey => {
        const index = cleannedDocs[docKey].projects.findIndex(el => el === projectMeta.id)
        if (index !== -1) { // found matching projectId
          cleannedDocs[docKey].projects.splice(index, 1) // remove the projectId from array
        }
      })
      dispatch({ type: types.CLEAN_PROJECT_LIST_SUCCESS, payload: cleannedDocs })
      done()
    } catch (e) {
      dispatch({ type: types.CLEAN_PROJECT_LIST_FAIL, payload: 'Failed to remove projectId from documents' })
    }
    done()
  }
})

export default [
  getDocLogic,
  searchBoxLogic,
  bulkUpdateLogic,
  bulkDeleteLogic,
  cleanDocProjectLogic,
  ...uploadLogic
]
