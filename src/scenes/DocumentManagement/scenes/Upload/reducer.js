import { types } from './actions'

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

    case types.ADD_SELECTED_DOCS:
      return {
        ...state,
        selectedDocs: [
          ...state.selectedDocs,
          ...action.selectedDocs
        ]
      }

    default:
      return state
  }
}

export default uploadReducer