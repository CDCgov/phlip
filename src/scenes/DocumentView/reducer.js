import { types } from './actions'

export const INITIAL_STATE = {
  document: {
    content: {},
    projects: [],
    jurisdictions: []
  },
  documentForm: {},
  documentRequestInProgress: false,
  documentUpdatingInProgress: false,
  documentUpdateError: null,
  apiErrorOpen: false,
  apiErrorInfo: {
    title: '',
    text: ''
  },
  inEditMode: false
}

const docViewReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.INIT_STATE_WITH_DOC:
      return {
        ...state,
        document: {
          ...action.doc,
          content: {}
        }
      }

    case types.GET_DOCUMENT_CONTENTS_REQUEST:
      return {
        ...state,
        documentRequestInProgress: true
      }

    case types.EDIT_DOCUMENT:
      return {
        ...state,
        documentForm: {
          ...state.document
        },
        inEditMode: true
      }

    case types.CLOSE_EDIT:
      return {
        ...state,
        documentForm: {},
        inEditMode: false
      }

    case types.GET_DOCUMENT_CONTENTS_SUCCESS:
      return {
        ...state,
        document: {
          ...state.document,
          content: action.payload
        },
        documentRequestInProgress: false
      }

    case types.ADD_PRO_JUR:
      let selectedDoc = { ...state.document }
      const foundIdx = selectedDoc[action.property].findIndex(el => el === action.value.id)
      if (foundIdx === -1) {
        selectedDoc[action.property] = [
          ...selectedDoc[action.property], action.value.id
        ]
      }

      return {
        ...state,
        documentForm: selectedDoc
      }

    case types.DELETE_PRO_JUR:
      selectedDoc = { ...state.document }
      const index = selectedDoc[action.property].findIndex(el => el === action.value.id)
      selectedDoc[action.property].splice(index, 1)
      return {
        ...state,
        documentForm: selectedDoc
      }

    case types.UPDATE_DOC_PROPERTY:
      selectedDoc = { ...state.documentForm }
      selectedDoc[action.property] = action.value
      return {
        ...state,
        documentForm: selectedDoc
      }

    case types.UPDATE_DOC_REQUEST:
      return {
        ...state,
        documentUpdatingInProgress: true
      }

    case types.UPDATE_DOC_SUCCESS:
      return {
        ...state,
        documentUpdatingInProgress: false,
        document: state.documentForm,
        documentForm: {},
        inEditMode: false
      }

    case types.CLEAR_DOCUMENT:
      return {
        ...state,
        document: {
          content: {},
          projects: [],
          jurisdictions: []
        },
        documentForm: {},
        inEditMode: false
      }

    case types.UPDATE_DOC_FAIL:
      return {
        ...state,
        apiErrorInfo: {
          title: 'Update error',
          text: 'Failed to update document.'
        },
        apiErrorOpen: true,
        documentUpdatingInProgress: false
      }

    case types.CLOSE_ALERT:
      return {
        ...state,
        apiErrorInfo: {
          title: '',
          text: ''
        },
        apiErrorOpen: false
      }

    default:
      return state
  }
}

export default docViewReducer