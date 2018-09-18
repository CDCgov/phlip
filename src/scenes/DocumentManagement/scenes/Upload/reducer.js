import { types } from './actions'
import { updateItemAtIndex } from 'utils/normalize'

const INITIAL_STATE = {
  selectedDocs: [],
  uploadError: {},
  uploadedDocs: [],
  uploading: false
}

const uploadReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.UPLOAD_DOCUMENTS_REQUEST:
      return {
        ...state,
        uploading: true
      }

    case types.UPLOAD_DOCUMENTS_SUCCESS:
      return {
        ...state,
        selectedDocs: [],
        uploadedDocs: action.payload.docs,
        uploading: false
      }

    case types.UPLOAD_DOCUMENTS_FAIL:
      return {
        ...state,
        uploadError: action.payload.error,
        uploading: false
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

    case types.CLEAR_SELECTED_FILES:
      return INITIAL_STATE

    default:
      return state
  }
}

export default uploadReducer