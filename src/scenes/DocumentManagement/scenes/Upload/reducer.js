import { types } from './actions'
import { updateItemAtIndex } from 'utils/normalize'

export const INITIAL_STATE = {
  selectedDocs: [],
  requestError: null,
  uploading: false,
  goBack: false,
  verifying: true,
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
  noProjectError: false
}

const uploadReducer = (state = INITIAL_STATE, action) => {
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
        alertTitle: 'Duplicates Found'
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
      selectedDoc[action.property] = { ...selectedDoc[action.property], value, error: '' }

      return {
        ...state,
        selectedDocs: updateItemAtIndex([...state.selectedDocs], action.index, selectedDoc)
      }

    case types.ADD_SELECTED_DOCS:
      return {
        ...state,
        selectedDocs: [
          ...state.selectedDocs,
          ...action.selectedDocs.map(doc => {
            let d = {}
            Object.keys(doc).forEach(prop => {
              d[prop] = { editable: true, value: doc[prop], error: '', inEditMode: false }
            })
            return d
          })
        ]
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
        selectedDocs: updateItemAtIndex([...state.selectedDocs], action.index, selectedDoc)
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
      let index = duplicates.findIndex(dup => dup.name === action.fileName)
      duplicates.splice(index, 1)

      return {
        ...state,
        selectedDocs: docs,
        duplicateFiles: duplicates
      }

    case types.SEARCH_PROJECT_LIST_SUCCESS:
      return {
        ...state,
        projectSuggestions: action.payload
      }

    case types.SEARCH_JURISDICTION_LIST_SUCCESS:
      return {
        ...state,
        jurisdictionSuggestions: action.payload
      }

    case types.ROW_SEARCH_JURISDICTION_SUCCESS:
      selectedDoc = { ...state.selectedDocs[action.payload.index] }
      selectedDoc.jurisdictions.value.suggestions = action.payload.suggestions

      return {
        ...state,
        selectedDocs: updateItemAtIndex([...state.selectedDocs], action.payload.index, selectedDoc)
      }

    case types.CLEAR_ROW_JURISDICTION_SUGGESTIONS:
      selectedDoc = { ...state.selectedDocs[action.index] }
      selectedDoc.jurisdictions.value.suggestions = []

      return {
        ...state,
        selectedDocs: updateItemAtIndex([...state.selectedDocs], action.index, selectedDoc)
      }

    case types.CLEAR_SUGGESTIONS:
      return {
        ...state,
        [action.suggestionType]: []
      }

    case types.ON_SEARCH_VALUE_CHANGE:
      const fl = `${action.searchType.slice(0, 1).toUpperCase()}${action.searchType.slice(1)}`
      return {
        ...state,
        [`${action.searchType}SearchValue`]: action.value,
        [`${fl}Suggestions`]: []
      }

    case types.ON_PROJECT_SUGGESTION_SELECTED:
      return {
        ...state,
        projectSearchValue: action.project.name,
        selectedProject: action.project,
        projectSuggestions: [],
        noProjectError: false
      }

    case types.ON_JURISDICTION_SUGGESTION_SELECTED:
      return {
        ...state,
        jurisdictionSearchValue: action.jurisdiction.name,
        selectedJurisdiction: action.jurisdiction,
        jurisdictionSuggestions: []
      }

    case types.REJECT_NO_PROJECT_SELECTED:
      return {
        ...state,
        noProjectError: true,
        alertOpen: true,
        alertText: action.error,
        alertTitle: 'Invalid Project' || ''
      }

    case types.RESET_FAILED_UPLOAD_VALIDATION:
      return {
        ...state,
        noProjectError: false
      }

    case types.REJECT_EMPTY_JURISDICTIONS:
      return {
        ...state,
        selectedDocs: state.selectedDocs.map(doc => {
          if (doc.jurisdictions.value.name.length === 0 ||
            (!doc.jurisdictions.value.hasOwnProperty('id') || !doc.jurisdictions.value.id)) {
            return { ...doc, jurisdictions: { ...doc.jurisdictions, error: true, inEditMode: true } }
          } else {
            return doc
          }
        }),
        alertOpen: true,
        alertText: action.error,
        alertTitle: 'Invalid Jurisdictions' || ''
      }

    case types.CLEAR_SELECTED_FILES:
      return INITIAL_STATE

    case 'FLUSH_STATE':
      return INITIAL_STATE

    /*case types.ADD_TAG:
  selectedDoc = { ...state.selectedDocs[action.index] }
  selectedDoc.tags = [...selectedDoc.tags, action.tag]

  return {
    ...state,
    selectedDocs: updateItemAtIndex([...state.selectedDocs], action.index, selectedDoc)
  }

case types.REMOVE_TAG:
  selectedDoc = { ...state.selectedDocs[action.index] }
  selectedDoc.tags.splice(action.tagIndex, 1)

  return {
    ...state,
    selectedDocs: updateItemAtIndex([...state.selectedDocs], action.index, selectedDoc)
  }*/

    default:
      return state
  }
}

export default uploadReducer