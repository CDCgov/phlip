import { types } from './actions'
import { types as codingTypes } from 'scenes/CodingValidation/actions'
import { arrayToObject } from 'utils/normalize'
import { sortListOfObjects } from 'utils/commonHelpers'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import storage from 'redux-persist/lib/storage/session'
import { persistReducer } from 'redux-persist'

const filterAnnotations = (annotations, userId, isValidatorSelected) => {
  return annotations.filter(anno => {
    return anno.userId === userId && anno.isValidatorAnswer === isValidatorSelected
  })
}

const annotationsForDocument = (annotations, docId) => {
  return annotations.filter(anno => {
    return anno.docId === docId
  })
}

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
  annotations: {
    all: [],
    filtered: []
  },
  annotationUsers: {
    all: [],
    filtered: []
  },
  annotationModeEnabled: false,
  isUserAnswerSelected: false,
  showEmptyDocs: false,
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
      const annosForDoc = annotationsForDocument(state.annotations.all, state.openedDoc._id)
      let users = []
      annosForDoc.forEach(anno => {
        if (!users.find(user => user.userId === anno.userId && user.isValidator === anno.isValidatorAnswer)) {
          users.push({ userId: anno.userId, isValidator: anno.isValidatorAnswer })
        }
      })
      
      return {
        ...state,
        docSelected: true,
        openedDoc: {
          ...state.openedDoc,
          content: action.payload
        },
        annotations: {
          ...state.annotations,
          filtered: annosForDoc
        },
        annotationUsers: {
          ...state.annotationUsers,
          filtered: users
        },
        scrollTop: false
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
    
    case types.UPDATE_ANNOTATIONS:
      return {
        ...state,
        annotations: {
          all: action.annotations,
          filtered: annotationsForDocument(action.annotations, state.openedDoc._id)
        },
        annotationUsers: {
          all: action.users,
          filtered: action.users
        }
      }
    
    case types.TOGGLE_ANNOTATION_MODE:
      return {
        ...state,
        annotationModeEnabled: action.enabled,
        enabledAnswerId: action.enabled ? action.answerId : '',
        enabledUserId: '',
        currentAnnotationIndex: 0,
        annotations: {
          all: action.annotations,
          filtered: state.docSelected
            ? annotationsForDocument(action.annotations, state.openedDoc._id)
            : action.annotations
        },
        annotationUsers: {
          all: action.users,
          filtered: action.users
        }
      }
    
    case types.TOGGLE_CODER_ANNOTATIONS:
      const toggleOff = (action.userId === state.enabledUserId) &&
        (action.isUserAnswerSelected === state.isUserAnswerSelected)
      const isUserAnswerSelected = action.isUserAnswerSelected
        ? !toggleOff
        : false
      
      const filtered = filterAnnotations(state.annotations.all, action.userId, action.isUserAnswerSelected)
      
      return {
        ...state,
        enabledUserId: toggleOff ? '' : action.userId,
        scrollTop: !toggleOff,
        isUserAnswerSelected,
        annotations: {
          all: state.annotations.all,
          filtered: toggleOff
            ? annotationsForDocument(state.annotations.all, state.openedDoc._id)
            : annotationsForDocument(filtered, state.openedDoc._id)
        },
        annotationUsers: {
          all: state.annotationUsers.all,
          filtered: state.annotationUsers.filtered.map(user => {
            return {
              ...user,
              enabled: toggleOff
                ? false
                : (user.userId === action.userId && user.isValidator === isUserAnswerSelected)
            }
          })
        }
      }
    
    case types.TOGGLE_VIEW_ANNOTATIONS:
      const turnOff = action.answerId === state.enabledAnswerId
      const annotationsForDoc = annotationsForDocument(action.annotations, state.openedDoc._id)
      let usersForDoc = []
      annotationsForDoc.forEach(anno => {
        if (!usersForDoc.find(user => user.userId === anno.userId && user.isValidator === anno.isValidatorAnswer)) {
          usersForDoc.push({ userId: anno.userId, isValidator: anno.isValidatorAnswer })
        }
      })
      
      return {
        ...state,
        annotationModeEnabled: false,
        enabledAnswerId: turnOff ? '' : action.answerId,
        enabledUserId: turnOff ? '' : 'All',
        annotations: {
          all: turnOff ? [] : action.annotations,
          filtered: turnOff
            ? []
            : state.docSelected
              ? annotationsForDoc
              : action.annotations
        },
        annotationUsers: {
          all: turnOff ? [] : action.users,
          filtered: turnOff
            ? []
            : state.docSelected
              ? usersForDoc
              : action.users
        },
        currentAnnotationIndex: 0,
        scrollTop: !turnOff
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
        },
        annotations: {
          ...state.annotations,
          filtered: state.annotations.all
        },
        annotationUsers: {
          ...state.annotationUsers,
          filtered: state.annotationUsers.all
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
        annotations: {
          all: [],
          filtered: []
        },
        annotationUsers: {
          all: [],
          filtered: []
        },
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
        annotations: {
          all: [],
          filtered: []
        },
        annotationUsers: {
          all: [],
          filtered: []
        },
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
