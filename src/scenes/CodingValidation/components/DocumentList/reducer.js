import { types } from './actions'
import { types as codingTypes } from 'scenes/CodingValidation/actions'
import { arrayToObject } from 'utils/normalize'
import { sortListOfObjects } from 'utils/commonHelpers'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import storage from 'redux-persist/lib/storage/session'
import { persistReducer } from 'redux-persist'

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
  enabledAnswerId: '',
  enabledUserId: '',
  annotations: [],
  annotationModeEnabled: false,
  isUserAnswerSelected: false,
  showEmptyDocs: false,
  apiErrorOpen: false,
  apiError: {
    title: '',
    text: '',
    open: false
  },
  currentAnnotationIndex: 0,
  shouldShowAnnoModeAlert: true,
  scrollTop: false,
  gettingDocs: false
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
        scrollTop: false,
        showEmptyDocs: action.payload.length === 0,
        ...state.openedDoc._id !== ''
          ? Object.keys(obj).includes(state.openedDoc._id)
            ? { docSelected: true }
            : { docSelected: false, openedDoc: {} }
          : {},
        gettingDocs: false
      }
    
    case types.GET_APPROVED_DOCUMENTS_FAIL:
      return {
        ...state,
        apiError: {
          text: 'Failed to get the list of approved documents.',
          title: 'Request failed',
          open: true
        },
        gettingDocs: false
      }
    
    case types.GET_DOC_CONTENTS_REQUEST:
      return {
        ...state,
        openedDoc: {
          _id: action.id,
          name: state.documents.byId[action.id].name
        },
        scrollTop: false
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
        apiError: {
          title: '',
          text: 'Failed to retrieve document contents.',
          open: true
        }
      }
    
    case types.TOGGLE_ANNOTATION_MODE:
      return action.enabled ? {
        ...state,
        annotationModeEnabled: true,
        enabledAnswerId: action.answerId,
        enabledUserId: '',
        currentAnnotationIndex: 0
      } : {
        ...state,
        annotationModeEnabled: false,
        enabledAnswerId: '',
        enabledUserId: '',
        annotations: [],
        currentAnnotationIndex: 0,
        scrollTop: false
      }
    
    case types.TOGGLE_CODER_ANNOTATIONS:
      if (
        action.answerId === state.enabledAnswerId
        && action.userId === state.enabledUserId
        && state.isUserAnswerSelected === action.isUserAnswerSelected
      ) {
        return {
          ...state,
          annotations: [],
          enabledAnswerId: '',
          enabledUserId: '',
          currentAnnotationIndex: 0,
          annotationModeEnabled: false,
          isUserAnswerSelected: action.isUserAnswerSelected,
          scrollTop: false
        }
      } else {
        return {
          ...state,
          annotations: action.annotations,
          enabledAnswerId: action.answerId,
          enabledUserId: action.userId,
          annotationModeEnabled: false,
          currentAnnotationIndex: 0,
          isUserAnswerSelected: action.isUserAnswerSelected,
          scrollTop: true
        }
      }
    
    case types.CLEAR_DOC_SELECTED:
      return {
        ...state,
        docSelected: false,
        currentAnnotationIndex: 0,
        openedDoc: {},
        apiError: {
          title: '',
          text: '',
          open: false
        }
      }
    
    case types.GET_APPROVED_DOCUMENTS_REQUEST:
      return {
        ...state,
        docSelected: false,
        annotationModeEnabled: false,
        showEmptyDocs: false,
        enabledAnswerId: '',
        enabledUserId: '',
        annotations: [],
        documents: {
          byId: {},
          allIds: [],
          ordered: []
        },
        openedDoc: {
          _id: '',
          content: {}
        },
        gettingDocs: true
      }
    
    case codingTypes.GET_QUESTION_SUCCESS:
      return {
        ...state,
        enabledAnswerId: '',
        enabledUserId: '',
        annotations: [],
        isUserAnswerSelected: false
      }
    
    case types.HIDE_ANNO_MODE_ALERT:
      return {
        ...state,
        shouldShowAnnoModeAlert: false
      }
    
    case types.FLUSH_STATE:
      return {
        ...INITIAL_STATE,
        shouldShowAnnoModeAlert: action.isLogout ? true : state.shouldShowAnnoModeAlert
      }
    
    case types.CHANGE_ANNOTATION_INDEX:
      return {
        ...state,
        currentAnnotationIndex: action.index
      }
    
    case types.RESET_SCROLL_TOP:
      return {
        ...state,
        scrollTop: false
      }
    
    default:
      return state
  }
}

const config = {
  storage,
  stateReconciler: autoMergeLevel2
}

const documentReducer = persistReducer(
  { ...config, key: 'documentList', whitelist: ['shouldShowAnnoModeAlert'] },
  documentListReducer
)

export default documentReducer
