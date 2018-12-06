import { createLogic } from 'redux-logic'
import { types } from './actions'
import { types as autocompleteTypes } from 'data/autocomplete/actions'
import { types as projectTypes } from 'data/projects/actions'
import { types as jurisdictionTypes } from 'data/jurisdictions/actions'

const mergeInfoWithDocs = (info, docs, api) => {
  return new Promise(async (resolve, reject) => {
    let merged = [], jurLookup = {}
    for (const doc of docs) {
      if (info.hasOwnProperty(doc.name.value)) {
        let d = { ...doc }, jurs = []
        const docInfo = info[doc.name.value]
        Object.keys(docInfo).map(key => {
          d[key] = {
            ...d[key],
            editable: docInfo[key] === null,
            inEditMode: false,
            value: docInfo[key] === null ? d[key].value : docInfo[key],
            error: ''
          }
        })

        if (docInfo.jurisdictions.name !== null) {
          if (jurLookup.hasOwnProperty(docInfo.jurisdictions.name)) {
            jurs = [jurLookup[docInfo.jurisdictions.name]]
          } else {
            jurs = await api.searchJurisdictionList({}, {
              params: {
                name: docInfo.jurisdictions.name === 'District of Columbia'
                  ? 'Washington, DC (federal district)'
                  : docInfo.jurisdictions.name
              }
            }, {})
            jurLookup[docInfo.jurisdictions.name] = jurs[0]
          }
          d.jurisdictions = { ...d.jurisdictions, value: { ...jurs[0] } }
        } else {
          d.jurisdictions = { ...doc.jurisdictions, editable: true }
        }
        merged = [...merged, d]
      } else {
        merged = [...merged, doc]
      }
    }
    resolve(merged)
  })
}

/**
 * Handles extracting info from an excel spreadsheet and merging if with docs already selected
 */
const extractInfoLogic = createLogic({
  type: types.EXTRACT_INFO_REQUEST,
  async process({ action, getState, docApi, api }, dispatch, done) {
    const state = getState().scenes.docManage.upload.list
    const docs = state.selectedDocs
    try {
      const info = await docApi.extractInfo(action.infoSheetFormData)
      if (docs.length === 0) {
        dispatch({ type: types.EXTRACT_INFO_SUCCESS_NO_DOCS, payload: info })
      } else {
        const merged = await mergeInfoWithDocs(info, docs, api)
        dispatch({ type: types.EXTRACT_INFO_SUCCESS, payload: { info, merged } })
      }
    } catch (err) {
      dispatch({ type: types.EXTRACT_INFO_FAIL })
    }
    done()
  }
})

/**
 * Logic for when the user uploads an excel document before selecting docs
 */
const mergeInfoWithDocsLogic = createLogic({
  type: types.MERGE_INFO_WITH_DOCS,
  async transform({ action, getState, api }, next) {
    const docs = action.docs.map(doc => {
      let d = {}
      Object.keys(doc).forEach(prop => {
        d[prop] = { editable: true, value: doc[prop], error: '', inEditMode: false }
      })
      return d
    })
    const merged = await mergeInfoWithDocs(getState().scenes.docManage.upload.list.extractedInfo, docs, api)
    next({ ...action, payload: merged })
  }
})

/**
 * Logic for handling when the user clicks 'upload' in the modal. Verifies that there are no errors on upload
 */
const uploadRequestLogic = createLogic({
  type: types.UPLOAD_DOCUMENTS_REQUEST,
  validate({ getState, action }, allow, reject) {
    const state = getState().scenes.docManage.upload
    const selectedProject = state.projectSuggestions.selectedSuggestion
    const selectedJurisdiction = state.jurisdictionSuggestions.selectedSuggestion
    let jurs = {}

    if (Object.keys(selectedProject).length === 0) {
      reject({ type: types.REJECT_NO_PROJECT_SELECTED, error: 'You must associate these documents with a project.' })
    } else if (!selectedProject.hasOwnProperty('id')) {
      reject({
        type: types.REJECT_NO_PROJECT_SELECTED,
        error: 'You must select a valid project from the autocomplete list.'
      })
    } else if (Object.keys(selectedJurisdiction).length === 0) {
      const noJurs = state.list.selectedDocs.filter(doc => {
        if (!jurs.hasOwnProperty(doc.jurisdictions.value.id)) {
          jurs[doc.jurisdictions.value.id] = doc.jurisdictions.value
        }
        return doc.jurisdictions.value.name.length === 0
      })
      const noJurIds = state.list.selectedDocs.filter(doc => !doc.jurisdictions.value.hasOwnProperty('id') ||
        !doc.jurisdictions.value.id)
      if (noJurs.length === 0 && noJurIds.length === 0) {
      allow({ ...action, jurisdictions: Object.values(jurs) })
      } else {
        reject({
          type: types.REJECT_EMPTY_JURISDICTIONS,
          error: noJurs.length > 0
            ? 'One or more documents are missing a valid jurisdiction.'
            : 'You must select a jurisdiction from the autocomplete list for each document.',
          invalidDocs: noJurs.length > 0 ? noJurs : noJurIds
        })
      }
    } else {
      allow({ ...action, jurisdictions: [selectedJurisdiction] })
    }
  },
  async process({ docApi, action, getState }, dispatch, done) {
    const state = getState().scenes.docManage.upload
    let anyDuplicates = false
    try {
      if (getState().scenes.docManage.upload.list.hasVerified === false) {
        anyDuplicates = await docApi.verifyUpload(action.selectedDocs)
        if (anyDuplicates.length > 0) {
          dispatch({
            type: types.VERIFY_RETURN_DUPLICATE_FILES,
            payload: anyDuplicates
          })
          done()
        }
      }
      const docs = await docApi.upload(action.selectedDocsFormData)
      docs.files.map(doc => {
        const { content, ...otherDocProps } = doc
        return otherDocProps
      })
      action.jurisdictions.forEach(jur => {
        dispatch({ type: jurisdictionTypes.ADD_JURISDICTION, payload: jur })
      })
      dispatch({ type: projectTypes.ADD_PROJECT, payload: { ...state.projectSuggestions.selectedSuggestion } })
      dispatch({ type: types.UPLOAD_DOCUMENTS_SUCCESS, payload: { docs: docs.files } })
      done()
    } catch (err) {
      dispatch({
        type: types.UPLOAD_DOCUMENTS_FAIL,
        payload: { error: 'Failed to upload documents, please try again.' }
      })
      done()
    }
  }
})

/**
 * Logic for handling searching of thr project list
 */
const searchProjectListLogic = createLogic({
  type: `${autocompleteTypes.SEARCH_FOR_SUGGESTIONS_REQUEST}_PROJECT`,
  validate({ getState, action }, allow, reject) {
    const selectedProject = getState().scenes.docManage.upload.projectSuggestions.selectedSuggestion
    if (Object.keys(selectedProject).length === 0) {
      allow(action)
    } else {
      if (selectedProject.name !== action.searchString) {
        allow(action)
      } else {
        reject()
      }
    }
  }
})

/**
 * Logic for handling searching of the jurisdiction list
 */
const searchJurisdictionListLogic = createLogic({
  type: `${autocompleteTypes.SEARCH_FOR_SUGGESTIONS_REQUEST}_JURISDICTION`,
  validate({ getState, action }, allow, reject) {
    const selectedJurisdiction = getState().scenes.docManage.upload.jurisdictionSuggestions.selectedSuggestion
    if (Object.keys(selectedJurisdiction).length === 0) {
      allow(action)
    } else {
      if (selectedJurisdiction.name !== action.searchString) {
        allow(action)
      } else {
        reject()
      }
    }
  }
})

export default [
  uploadRequestLogic,
  extractInfoLogic,
  searchProjectListLogic,
  searchJurisdictionListLogic,
  mergeInfoWithDocsLogic
]