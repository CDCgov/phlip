import { types } from './actions'
import { updateItemAtIndex } from 'utils/normalize'
import { combineReducers } from 'redux'
import { createAutocompleteReducer, INITIAL_STATE as AUTO_INITIAL_STATE } from 'data/autocomplete/reducer'
import { types as autocompleteTypes } from 'data/autocomplete/actions'

export const INITIAL_STATE = {
  selectedDocs: [],
  requestError: null,
  uploading: false,
  goBack: false,
  infoSheet: {},
  infoRequestInProgress: false,
  infoSheetSelected: false,
  extractedInfo: {},
  projectSuggestions: [],
  jurisdictionSuggestions: [],
  projectSearchValue: '',
  jurisdictionSearchValue: '',
  selectedProject: {},
  selectedJurisdiction: {},
  noProjectError: false,
  hasVerified: false,
  invalidFiles: [],
  alert: {
    open: false,
    text: '',
    title: '',
    type: 'basic'
  }
}

export const uploadReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.UPLOAD_DOCUMENTS_REQUEST:
      return {
        ...state,
        uploading: true,
        goBack: false
      }
    
    case types.UPLOAD_DOCUMENTS_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        selectedDocs: [],
        uploading: false,
        goBack: true
      }
    
    case types.UPLOAD_DOCUMENTS_FAIL:
      return {
        ...state,
        requestError: action.payload.error,
        uploading: false
      }
    
    case types.VERIFY_RETURN_DUPLICATE_FILES:
      docs = [...state.selectedDocs]
      docs = docs.map(doc => {
        const isDup = action.payload.findIndex(dup => {
          return dup.name === doc.name.value
        })
        return {
          ...doc,
          isDuplicate: isDup !== -1
        }
      })
      
      return {
        ...state,
        uploading: false,
        selectedDocs: docs,
        alert: {
          open: true,
          text: `The file name, project and jurisdiction properties for one or more of the documents selected for
        upload match a pre-existing document in the system. These documents have been indicated in the file list. You
        can choose to remove them or click the 'Upload' button again to proceed with saving them.`,
          title: 'Duplicates Found',
          type: 'basic'
        },
        hasVerified: true
      }
    
    case types.EXTRACT_INFO_REQUEST:
      return {
        ...state,
        infoSheet: action.infoSheet,
        infoRequestInProgress: true,
        infoSheetSelected: true
      }
    
    case types.EXTRACT_INFO_SUCCESS:
      return {
        ...state,
        infoRequestInProgress: false,
        extractedInfo: action.payload.info,
        selectedDocs: action.payload.merged
      }
    
    case types.MERGE_INFO_WITH_DOCS:
      return {
        ...state,
        selectedDocs: [
          ...state.selectedDocs,
          ...action.payload
        ],
        hasVerified: false
      }
    
    // If the user has selected an excel file but has not selected documents to upload
    case types.EXTRACT_INFO_SUCCESS_NO_DOCS:
      return {
        ...state,
        infoRequestInProgress: false,
        extractedInfo: action.payload
      }
    
    case types.UPDATE_DOC_PROPERTY:
      let selectedDoc = { ...state.selectedDocs[action.index] }
      let value = action.value
      selectedDoc[action.property] = {
        ...selectedDoc[action.property],
        value,
        error: ''
      }
      
      return {
        ...state,
        selectedDocs: updateItemAtIndex(
          [...state.selectedDocs],
          action.index,
          selectedDoc
        )
      }
    
    case types.ADD_SELECTED_DOCS:
      //  let invalidTypeFiles = [...state.invalidTypeFiles]
      return {
        ...state,
        selectedDocs: [
          ...state.selectedDocs,
          ...action.selectedDocs.map((doc) => {
            let d = {}
            Object.keys(doc).forEach((prop) => {
              d[prop] = {
                editable: true,
                value: doc[prop],
                error: '',
                inEditMode: false
              }
            })
            return d
          })
        ],
        hasVerified: false
      }
    
    case types.REMOVE_DOC:
      let docs = [...state.selectedDocs]
      docs.splice(action.index, 1)
      
      return {
        ...state,
        selectedDocs: docs,
        hasVerified: state.hasVerified ? docs.length !== 0 : false
      }
    
    case types.TOGGLE_ROW_EDIT_MODE:
      selectedDoc = { ...state.selectedDocs[action.index] }
      selectedDoc[action.property].inEditMode = true
      
      return {
        ...state,
        selectedDocs: updateItemAtIndex(
          [...state.selectedDocs],
          action.index,
          selectedDoc
        )
      }
    
    case types.CLOSE_ALERT:
      let invalidFiles = [...state.invalidFiles]
      let cleanedDocs = [...state.selectedDocs].filter(
        doc => !invalidFiles.find(badDoc => badDoc.name === doc.name.value)
      )
      
      return {
        ...state,
        selectedDocs: cleanedDocs,
        invalidFiles: [],
        alert: {
          open: false,
          text: '',
          title: '',
          type: 'basic'
        }
      }
    
    case types.OPEN_ALERT:
      return {
        ...state,
        alert: {
          open: true,
          text: action.text,
          title: action.title || '',
          type: action.alertType
        }
      }
    
    case types.SEARCH_ROW_SUGGESTIONS_SUCCESS_JURISDICTION:
      selectedDoc = { ...state.selectedDocs[action.payload.index] }
      selectedDoc.jurisdictions.value.suggestions = action.payload.suggestions
      
      return {
        ...state,
        selectedDocs: updateItemAtIndex(
          [...state.selectedDocs],
          action.payload.index,
          selectedDoc
        )
      }
    
    case types.CLEAR_ROW_JURISDICTION_SUGGESTIONS:
      selectedDoc = { ...state.selectedDocs[action.index] }
      selectedDoc.jurisdictions.value.suggestions = []
      
      return {
        ...state,
        selectedDocs: updateItemAtIndex(
          [...state.selectedDocs],
          action.index,
          selectedDoc
        )
      }
    
    case types.REJECT_NO_PROJECT_SELECTED:
      return {
        ...state,
        noProjectError: true,
        alert: {
          open: true,
          text: action.error,
          title: 'Invalid Project',
          type: 'basic'
        }
      }
    
    case types.RESET_FAILED_UPLOAD_VALIDATION:
      return {
        ...state,
        noProjectError: false
      }
    
    case types.REJECT_EMPTY_JURISDICTIONS:
      return {
        ...state,
        selectedDocs: [...state.selectedDocs].map((doc) => {
          if (doc.jurisdictions.value.name.length === 0 || !doc.jurisdictions.value.hasOwnProperty('id')) {
            return {
              ...doc,
              jurisdictions: {
                ...doc.jurisdictions,
                error: true,
                inEditMode: true
              }
            }
          } else {
            return doc
          }
        }),
        alert: {
          open: true,
          text: action.error,
          title: 'Invalid Jurisdictions',
          type: 'basic'
        }
      }
    
    case types.INVALID_FILES_FOUND:
      return {
        ...state,
        uploading: false,
        invalidFiles: action.invalidFiles,
        alert: {
          open: true,
          text: action.text,
          title: action.title,
          type: 'files'
        },
        hasVerified: false
      }
    
    case `${autocompleteTypes.ON_SUGGESTION_SELECTED}_JURISDICTION`:
      return {
        ...state,
        selectedDocs: state.selectedDocs.map((doc) => {
          return {
            ...doc,
            jurisdictions: {
              ...doc.jurisdictions,
              editable: false,
              inEditMode: false,
              value: action.suggestion
            }
          }
        })
      }
    
    case `${autocompleteTypes.UPDATE_SEARCH_VALUE}_JURISDICTION`:
      if (action.value !== '') {
        return state
      } else {
        return {
          ...state,
          selectedDocs: state.selectedDocs.map((doc) => {
            return {
              ...doc,
              jurisdictions: {
                ...doc.jurisdictions,
                editable: true,
                value: { suggestions: [], searchValue: '', name: '' }
              }
            }
          })
        }
      }
    
    case types.CLEAR_SELECTED_FILES:
    case types.FLUSH_STATE:
      return INITIAL_STATE
    
    default:
      return state
  }
}

export const COMBINED_INITIAL_STATE = {
  list: INITIAL_STATE,
  projectSuggestions: AUTO_INITIAL_STATE,
  jurisdictionSuggestions: AUTO_INITIAL_STATE
}

export default combineReducers({
  list: uploadReducer,
  projectSuggestions: createAutocompleteReducer('PROJECT'),
  jurisdictionSuggestions: createAutocompleteReducer('JURISDICTION')
})
