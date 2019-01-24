import { types } from './actions'
import { arrayToObject } from 'utils/normalize'
import { sortListOfObjects } from 'utils/commonHelpers'

export const INITIAL_STATE = {
  documents: {
    byId: {},
    allIds: [],
    ordered: []
  },
  docSelected: false,
  openedDoc: {
    _id: '',
    content: {}
  },
  annotationModeEnabled: false,
  showEmptyDocs: false,
  apiErrorOpen: false,
  apiErrorInfo: {
    title: '',
    text: ''
  }
}

const mergeName = docObj => ({
  ...docObj,
  uploadedByName: `${docObj.uploadedBy.firstName} ${docObj.uploadedBy.lastName}`
})

const documentListReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.GET_APPROVED_DOCUMENTS_SUCCESS:
      let docs = action.payload.map(mergeName)
      let obj = arrayToObject(docs, '_id')
      return {
        ...state,
        documents: {
          byId: obj,
          allIds: Object.keys(obj),
          ordered: sortListOfObjects(Object.values(obj), 'uploadedDate', 'desc').map(obj => obj._id)
        },
        showEmptyDocs: action.payload.length === 0,
        ...state.openedDoc._id !== ''
          ? Object.keys(obj).includes(state.openedDoc._id)
            ? { docSelected: true }
            : { docSelected: false, openedDoc: {} }
          : {}
      }

    case types.GET_DOC_CONTENTS_REQUEST:
      return {
        ...state,
        openedDoc: {
          _id: action.id,
          name: state.documents.byId[action.id].name
        }
      }

    case types.GET_DOC_CONTENTS_SUCCESS:
      return {
        ...state,
        docSelected: true,
        openedDoc: {
          ...state.openedDoc,
          content: action.payload
        }
      }

    case types.GET_DOC_CONTENTS_FAIL:
      return {
        ...state,
        docSelected: true,
        apiErrorInfo: {
          title: '',
          text: 'Failed to retrieve document contents.'
        },
        apiErrorOpen: true
      }

    case types.CLEAR_DOC_SELECTED:
      return {
        ...state,
        docSelected: false,
        openedDoc: {},
        apiErrorInfo: {
          title: '',
          text: ''
        },
        apiErrorOpen: false
      }

    case types.GET_APPROVED_DOCUMENTS_FAIL:
      return {
        ...state,
        apiErrorInfo: {
          text: 'Failed to get the list of approved documents.',
          title: 'Request failed'
        },
        apiErrorOpen: true
      }

    case types.FLUSH_STATE:
      return INITIAL_STATE

    case types.GET_APPROVED_DOCUMENTS_REQUEST:
      return {
        ...state,
        docSelected: false
      }

    default:
      return state
  }
}

export default documentListReducer