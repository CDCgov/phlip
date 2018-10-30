import { createLogic } from 'redux-logic'
import { types } from './actions'
import { updateItemAtIndex } from 'utils/normalize'

const verifyUploadLogic = createLogic({
  type: types.VERIFY_UPLOAD_REQUEST,
  async process({ docApi, action }, dispatch, done) {
    try {
      const response = await docApi.verifyUpload(action.selectedDocs)
      if (response.duplicates.length > 0) {
        dispatch({ type: types.VERIFY_RETURN_DUPLICATE_FILES, payload: { duplicates: response.duplicates } })
      } else {
        dispatch({ type: types.VERIFY_RETURN_NO_DUPLICATES })
      }
    } catch (error) {
      dispatch({ type: types.VERIFY_UPLOAD_FAIL, payload: { error: 'Failed to verify upload, please try again.' } })
    }
    done()
  }
})

/**
 * Handles extracting info from an excel spreadsheet
 */
const extractInfoLogic = createLogic({
  type: types.EXTRACT_INFO_REQUEST,
  async process({ action, getState, docApi }, dispatch, done) {
    const state = getState().scenes.docManage.upload
    const docs = state.selectedDocs
    try {
      const info = await docApi.extractInfo(action.infoSheet)
      if (docs.length === 0) {
        dispatch({ type: types.EXTRACT_INFO_SUCCESS_NO_DOCS, payload: info })
      } else {
        const merged = docs.map(doc => {
          if (info.hasOwnProperty(doc.name.value)) {
            const docInfo = info[doc.name.value]
            let d = { ...doc }
            Object.keys(docInfo).map(key => {
              d[key] = { ...d, editable: false, inEditMode: false, value: docInfo[key], error: '' }
            })
            return d
          } else {
            return doc
          }
        })
        dispatch({ type: types.EXTRACT_INFO_SUCCESS, payload: { info, merged }})
      }
    } catch (err) {
      dispatch({ type: types.EXTRACT_INFO_FAIL })
    }
    done()
  }
})

/**
 * Logic for handling when the user clicks 'upload' in the modal. Verifies that there are no errors on upload
 */
const uploadRequestLogic = createLogic({
  type: types.UPLOAD_DOCUMENTS_REQUEST,
  validate({ getState, action }, allow, reject) {
    const state = getState().scenes.docManage.upload
    if (Object.keys(state.selectedProject).length === 0) {
      reject({ type: types.REJECT_NO_PROJECT_SELECTED })
    }

    if (Object.keys(state.selectedJurisdiction).length === 0) {
      const noJurs = state.selectedDocs.filter(doc => {
        return doc.jurisdictions.value.length === 0
      })
      if (noJurs.length === 0) {
        allow(action)
      } else {
        reject({ type: types.REJECT_EMPTY_JURISDICTIONS })
      }
    } else {
      allow(action)
    }
  },
  async process({ docApi, action }, dispatch, done) {
    try {
      const docs = await docApi.upload(action.selectedDocs)
      docs.files.map(doc => {
        const { content, ...otherDocProps } = doc
        return otherDocProps
      })
      dispatch({ type: types.UPLOAD_DOCUMENTS_SUCCESS, payload: { docs: docs.files } })
    } catch (err) {
      dispatch({
        type: types.UPLOAD_DOCUMENTS_FAIL,
        payload: { error: 'Failed to upload documents, please try again.' }
      })
    }
    done()
  }
})

/**
 * Logic for handling searching of thr project list
 */
const searchProjectListLogic = createLogic({
  type: types.SEARCH_PROJECT_LIST_REQUEST,
  validate({ getState, action }, allow, reject) {
    const selectedProject = getState().scenes.docManage.upload.selectedProject
    if (Object.keys(selectedProject).length === 0) {
      allow(action)
    } else {
      if (selectedProject.name !== action.searchString) {
        allow(action)
      } else {
        reject()
      }
    }
  },
  async process({ api, action }, dispatch, done) {
    try {
      let projects = await api.getProjects({}, {}, {})
      const searchString = action.searchString.toLowerCase()
      projects = projects.filter(project => {
        return project.name.toLowerCase().startsWith(searchString)
      })
      dispatch({ type: types.SEARCH_PROJECT_LIST_SUCCESS, payload: projects })
    } catch (err) {
      dispatch({ type: types.SEARCH_PROJECT_LIST_FAIL })
    }
    done()
  }
})

/**
 * Logic for handling searching of the jurisdiction list
 */
const searchJurisdictionListLogic = createLogic({
  type: types.SEARCH_JURISDICTION_LIST_REQUEST,
  validate({ getState, action }, allow, reject) {
    const selectedJurisdiction = getState().scenes.docManage.upload.selectedJurisdiction
    if (Object.keys(selectedJurisdiction).length === 0) {
      allow(action)
    } else {
      if (selectedJurisdiction.name !== action.searchString) {
        allow(action)
      } else {
        reject()
      }
    }
  },
  async process({ action, api }, dispatch, done) {
    try {
      const jurisdictions = await api.searchJurisdictionList({}, {
        params: {
          name: action.searchString
        }
      }, {})
      if (action.index !== null) {
        dispatch({
          type: types.ROW_SEARCH_JURISDICTION_SUCCESS,
          payload: { suggestions: jurisdictions, index: action.index }
        })
      } else {
        dispatch({ type: types.SEARCH_JURISDICTION_LIST_SUCCESS, payload: jurisdictions })
      }
    } catch (err) {
      dispatch({ type: types.SEARCH_JURISDICTION_LIST_FAIL })
    }
    done()
  }
})

export default [
  verifyUploadLogic, uploadRequestLogic, extractInfoLogic, searchProjectListLogic, searchJurisdictionListLogic
]