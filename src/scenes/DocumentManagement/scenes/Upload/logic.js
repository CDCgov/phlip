import { createLogic } from 'redux-logic'
import { types } from './actions'
import { types as autocompleteTypes } from 'data/autocomplete/actions'
import { types as projectTypes } from 'data/projects/actions'
import { types as jurisdictionTypes } from 'data/jurisdictions/actions'

const stateLookup = {
  'AL': 'Alabama',
  'AK': 'Alaska',
  'AZ': 'Arizona',
  'AR': 'Arkansas',
  'CA': 'California',
  'CO': 'Colorado',
  'CT': 'Connecticut',
  'DE': 'Delaware',
  'FL': 'Florida',
  'GA': 'Georgia',
  'HI': 'Hawaii',
  'ID': 'Idaho',
  'IL': 'Illinois',
  'IN': 'Indiana',
  'IA': 'Iowa',
  'KS': 'Kansas',
  'KY': 'Kentucky',
  'LA': 'Louisiana',
  'ME': 'Maine',
  'MD': 'Maryland',
  'MA': 'Massachusetts',
  'MI': 'Michigan',
  'MN': 'Minnesota',
  'MS': 'Mississippi',
  'MO': 'Missouri',
  'MT': 'Montana',
  'NE': 'Nebraska',
  'NV': 'Nevada',
  'NH': 'New Hampshire',
  'NJ': 'New Jersey',
  'NM': 'New Mexico',
  'NY': 'New York',
  'NC': 'North Carolina',
  'ND': 'North Dakota',
  'OH': 'Ohio',
  'OK': 'Oklahoma',
  'OR': 'Oregon',
  'PA': 'Pennsylvania',
  'RI': 'Rhode Island',
  'SC': 'South Carolina',
  'SD': 'South Dakota',
  'TN': 'Tennessee',
  'TX': 'Texas',
  'UT': 'Utah',
  'VT': 'Vermont',
  'VA': 'Virginia',
  'WA': 'Washington',
  'WV': 'West Virginia',
  'WI': 'Wisconsin',
  'WY': 'Wyoming'
}

const DCStrings = ['DC', 'District of Columbia', 'Washington, DC', 'Washington, DC (federal district)']

const valueDefaults = {
  jurisdictions: { searchValue: '', suggestions: [], name: '' },
  citation: '',
  effectiveDate: ''
}

const reg = input => {
  return new RegExp(input, 'g')
}

const upload = (docApi, action, dispatch, state) => {
  return new Promise(async (resolve, reject) => {
    try {
      const docs = await docApi.upload(action.selectedDocsFormData)
      let jurList = ''
      action.jurisdictions.forEach(jur => {
        jurList = `${jurList}|${jur.name}`
        dispatch({ type: jurisdictionTypes.ADD_JURISDICTION, payload: jur })
      })
      
      const documents = docs.files.map(doc => {
        const { content, ...otherDocProps } = doc
        return {
          ...otherDocProps,
          projectList: `${state.projectSuggestions.selectedSuggestion.name}`,
          jurisdictionList: jurList
        }
      })
      
      dispatch({ type: projectTypes.ADD_PROJECT, payload: { ...state.projectSuggestions.selectedSuggestion } })
      dispatch({ type: types.UPLOAD_DOCUMENTS_SUCCESS, payload: { docs: documents } })
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

const determineSearchString = jurisdictionName => {
  let searchString = jurisdictionName, isState = true
  
  if (DCStrings.includes(jurisdictionName)) {
    searchString = 'Washington, DC (federal district)'
  } else if (stateLookup[jurisdictionName] !== undefined) {
    searchString = `${stateLookup[jurisdictionName]} (state)`
  } else {
    const jur = Object.values(stateLookup).find(state => {
      const regex = reg(`(${state})\\s?(\\(state\\))?`)
      const match = jurisdictionName.search(regex)
      return match !== -1
    })
    if (jur !== undefined) {
      searchString = `${jur} (state)`
    } else {
      isState = false
    }
  }
  
  return { isState, searchString }
}

export const mergeInfoWithDocs = (info, docs, api) => {
  return new Promise(async (resolve, reject) => {
    let merged = [], jurLookup = {}
    for (const doc of docs) {
      if (info.hasOwnProperty(doc.name.value)) {
        let d = { ...doc }, jurs = []
        const docInfo = info[doc.name.value]
        Object.keys(valueDefaults).map(key => {
          d[key] = {
            ...d[key],
            editable: docInfo[key] === null,
            inEditMode: false,
            value: docInfo[key] === null ? valueDefaults[key] : docInfo[key],
            error: ''
          }
        })
        
        if (docInfo.jurisdictions.name !== null) {
          if (jurLookup.hasOwnProperty(docInfo.jurisdictions.name)) {
            jurs = [jurLookup[docInfo.jurisdictions.name]]
            d.jurisdictions = { ...d.jurisdictions, value: { ...jurs[0] } }
          } else {
            const { searchString, isState } = determineSearchString(docInfo.jurisdictions.name)
            jurs = await api.searchJurisdictionList({}, { params: { name: searchString } }, {})
            if (!isState) {
              d.jurisdictions = {
                inEditMode: true,
                error: '',
                value: { ...valueDefaults['jurisdictions'], searchValue: docInfo.jurisdictions.name },
                editable: true
              }
            } else {
              jurLookup[docInfo.jurisdictions.name] = jurs[0]
              d.jurisdictions = { ...d.jurisdictions, value: { ...jurs[0] } }
            }
          }
        } else {
          d.jurisdictions = { inEditMode: false, error: '', value: valueDefaults['jurisdictions'], editable: true }
        }
        merged = [...merged, d]
      } else {
        merged = [...merged, doc]
      }
    }
    resolve(merged)
  })
}

export const getFileType = doc => {
  return new Promise(async (resolve, reject) => {
    const validMimeTypes = [
      {
        mime: 'pdf',
        pattern: '25504446'
      },
      {
        mime: 'doc',
        pattern: '7B5C7274'
      },
      {
        mime: 'docx',
        pattern: '504B34'
      }
    ]
    let matchedOne = {}
    const filereader = new FileReader()
    filereader.onload = evt => {
      if (evt.target.readyState === FileReader.DONE) {
        const uint = new Uint8Array(evt.target.result)
        let bytes = []
        uint.forEach((byte) => {
          bytes.push(byte.toString(16))
        })
        const hex = bytes.join('').toUpperCase()
        matchedOne = validMimeTypes.find(oneType => {
          return oneType.pattern === hex
        })
        resolve({ doc: doc, docHex: hex, docType: matchedOne || undefined, size: doc.file.size })
      }
    }
    
    const blob = doc.file.slice(0, 4)
    filereader.readAsArrayBuffer(blob)
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
        d[prop] = { editable: prop !== 'name', value: doc[prop], error: '', inEditMode: false }
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
        } else {
          await upload(docApi, action, dispatch, state)
        }
        done()
      } else {
        await upload(docApi, action, dispatch, state)
        done()
      }
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

/**
 * Logic for handling file type verification
 */
const verifyFileContentLogic = createLogic({
  type: types.VERIFY_VALID_FILES,
  async validate({ getState, action }, reject, allow) {
    let promises = []
    let invalidFiles = []
    let invalidType = false, invalidSize = false
    action.docs.map(doc => {
      promises.push(getFileType(doc))
    })
    
    Promise.all(promises).then(results => {
      results.map(result => {
        let file = { ...result.doc }
        if (result.docType === undefined) {
          file.badType = true
          invalidType = true
        }
        if (result.size > 16000000) {
          file.badSize = true
          invalidSize = true
        }
        if (file.badSize || file.badType) invalidFiles.push(file)
      })
      
      if (invalidType || invalidSize) {
        reject({
          type: types.INVALID_FILES_FOUND,
          text: invalidSize
            ? invalidType
              ? 'The files listed below do not have a valid file type or they exceed the maximum size of 16 MB. These files will be removed from the list.'
              : 'The files listed below exceed the maximum allowed size of 16 MB.'
            : 'The files listed below do not have a valid file type.',
          invalidFiles,
          title: invalidSize
            ? invalidType
              ? 'Invalid Files Found'
              : 'Maximum File Size Exceeded'
            : 'Invalid File Types'
        })
      } else {
        allow({ type: types.ALL_FILES_VALID })
      }
    })
  }
})

export default [
  uploadRequestLogic,
  extractInfoLogic,
  searchProjectListLogic,
  searchJurisdictionListLogic,
  mergeInfoWithDocsLogic,
  verifyFileContentLogic
]
