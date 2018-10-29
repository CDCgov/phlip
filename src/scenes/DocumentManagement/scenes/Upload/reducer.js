import { types } from './actions'
import { updateItemAtIndex } from 'utils/normalize'

const INITIAL_STATE = {
  selectedDocs: [],
  requestError: null,
  uploading: false,
  goBack: false,
  verifying: true,
  duplicateFiles: [],
  alertTitle: '',
  alertOpen: false,
  alertText: '',
  execelFile: '',
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

    case types.VERIFY_UPLOAD_REQUEST:
      return {
        ...state,
        verifying: true
      }

    case types.VERIFY_UPLOAD_FAIL:
      return {
        ...state,
        requestError: action.payload.error,
        verifying: false
      }

    case types.VERIFY_RETURN_NO_DUPLICATES:
      return {
        ...state,
        verifying: false
      }

    case types.VERIFY_RETURN_DUPLICATE_FILES:
      return {
        ...state,
        verifying: false,
        duplicateFiles: action.payload.duplicates,
        alertOpen: true,
        alertText: 'There are already documents that exist for some of the files you selected. Please remove them from the list below',
        alertTitle: 'Duplicates Found'
      }

    case types.EXTRACT_INFO_REQUEST:
      return {
        ...state,
        excelFile: action.excelFile
      }

    case types.UPDATE_DOC_PROPERTY:
      let selectedDoc = { ...state.selectedDocs[action.index] }
      let value = action.value
      selectedDoc[action.property] = { ...selectedDoc[action.property], value }

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

    case types.ADD_TAG:
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

    case types.CLEAR_SUGGESTIONS:
      return {
        ...state,
        [action.suggestionType]: []
      }

    case types.ON_SEARCH_VALUE_CHANGE:
      return {
        ...state,
        [`${action.searchType}SearchValue`]: action.value
      }

    case types.ON_PROJECT_SUGGESTION_SELECTED:
      return {
        ...state,
        projectSearchValue: action.project.name,
        selectedProject: action.project,
        projectSuggestions: []
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
        alertText: 'You must associate these documents with a project',
        alertTitle: 'No Project Selected' || ''
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
          if (doc.jurisdictions.value.length === 0) {
            return { ...doc, jurisdictions: { ...doc.jurisdictions, error: 'Required' }}
          } else {
            return doc
          }
        }),
        alertOpen: true,
        alertText: 'One or more documents are missing a jurisdiction.',
        alertTitle: 'Missing jurisdictions' || ''
      }

    case types.CLEAR_SELECTED_FILES:
      return INITIAL_STATE

    default:
      return state
  }
}

export default uploadReducer