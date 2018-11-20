import { types } from './actions'
import { updateItemAtIndex } from 'utils/normalize'
import { combineReducers } from 'redux'
import { createAutocompleteReducer } from 'data/autocomplete/reducer'
import { types as autocompleteTypes } from 'data/autocomplete/actions'

export const INITIAL_STATE = {
  selectedDocs: [],
  requestError: null,
  uploading: false,
  goBack: false,
  duplicateFiles: [],
  alertTitle: '',
  alertOpen: false,
  alertText: '',
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
  hasVerified: false
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
      return {
        ...state,
        uploading: false,
        duplicateFiles: action.payload,
        alertOpen: true,
        alertText: `The file name, project and jurisdiction properties for one or more of the documents selected for
        upload match a pre-existing document in the system. These documents have been indicated in the file list. You
        can choose to remove them or click the 'Upload' button again to proceed with saving them.`,
        alertTitle: 'Duplicates Found',
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
        selectedDocs: action.payload
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
        selectedDocs: docs
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
      return {
        ...state,
        alertOpen: false,
        alertText: '',
        alertTitle: ''
      }

    case types.OPEN_ALERT:
      return {
        ...state,
        alertOpen: true,
        alertText: action.text,
        alertTitle: action.title || ''
      }

    case types.REMOVE_DUPLICATE:
      docs = [...state.selectedDocs]
      docs.splice(action.index, 1)
      let duplicates = [...state.duplicateFiles]
      let index = duplicates.findIndex((dup) => dup.name === action.fileName)
      duplicates.splice(index, 1)

      return {
        ...state,
        selectedDocs: docs,
        duplicateFiles: duplicates
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

    case 'RESET_NO_PROJECT_ERROR':
      return {
        ...state,
        noProjectError: false
      }

    case types.REJECT_NO_PROJECT_SELECTED:
      return {
        ...state,
        noProjectError: true,
        alertOpen: true,
        alertText: action.error,
        alertTitle: 'Invalid Project'
      }

    case types.RESET_FAILED_UPLOAD_VALIDATION:
      return {
        ...state,
        noProjectError: false
      }

    case types.REJECT_EMPTY_JURISDICTIONS:
      return {
        ...state,
        selectedDocs: state.selectedDocs.map((doc) => {
          if (
            doc.jurisdictions.value.name.length === 0 ||
            !doc.jurisdictions.value.hasOwnProperty('id')
          ) {
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
        alertOpen: true,
        alertText: action.error,
        alertTitle: 'Invalid Jurisdictions' || ''
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
    case 'FLUSH_STATE':
      return INITIAL_STATE

    default:
      return state
  }
}

export default combineReducers({
  list: uploadReducer,
  projectSuggestions: createAutocompleteReducer('PROJECT'),
  jurisdictionSuggestions: createAutocompleteReducer('JURISDICTION')
})
