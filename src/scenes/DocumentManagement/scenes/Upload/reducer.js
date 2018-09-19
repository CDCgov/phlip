import { types } from './actions'
import { updateItemAtIndex } from 'utils/normalize'

const INITIAL_STATE = {
  selectedDocs: [],
  requestError: null,
  uploadedDocs: [],
  uploading: false,
  goBack: false,
  verifying: true,
  duplicateFiles: [],
  alertTitle: '',
  alertOpen: false,
  alertText: ''
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
        uploadedDocs: action.payload.docs,
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
        alertText: 'There are already documents that exist for some of the files you selected.',
        alertTitle: 'Duplicates Found'
      }

    case types.UPDATE_DOC_PROPERTY:
      let selectedDoc = { ...state.selectedDocs[action.index] }
      let value = action.value

      if (action.property === 'tags') {
        value = action.value.split(',')
      }

      selectedDoc[action.property] = value

      return {
        ...state,
        selectedDocs: updateItemAtIndex([...state.selectedDocs], action.index, selectedDoc)
      }

    case types.ADD_SELECTED_DOCS:
      return {
        ...state,
        selectedDocs: [
          ...state.selectedDocs,
          ...action.selectedDocs
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
        alertTitle: ''
      }

    case types.CLEAR_SELECTED_FILES:
      return INITIAL_STATE

    default:
      return state
  }
}

export default uploadReducer