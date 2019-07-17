import { combineReducers } from 'redux'
import upload, { COMBINED_INITIAL_STATE as UPLOAD_INITIAL_STATE } from './scenes/Upload/reducer'
import { types as uploadTypes } from './scenes/Upload/actions'
import { types } from './actions'
import { arrayToObject } from 'utils/normalize'
import { sliceTable, sortListOfObjects } from 'utils/commonHelpers'
import searchReducer, { COMBINED_INITIAL_STATE as SEARCH_INITIAL_STATE } from './components/SearchBox/reducer'
import { createAutocompleteReducer, INITIAL_STATE as AUTO_INITIAL_STATE } from 'data/autocomplete/reducer'

export const INITIAL_STATE = {
  documents: {
    byId: {},
    allIds: [],
    visible: [],
    checked: [],
    matches: [],
    userDocs: []
  },
  rowsPerPage: '10',
  page: 0,
  allSelected: false,
  bulkOperationInProgress: false,
  apiErrorOpen: false,
  apiErrorInfo: {
    title: '',
    text: ''
  },
  sortBy: 'uploadedDate',
  sortDirection: 'desc',
  getDocumentsInProgress: false,
  pageError: '',
  count: 0,
  showAll: false
}

/**
 * Handles slicing and sorting an array of objects to be used as the 'visible' objects
 * @param arrToSlice
 * @param page
 * @param rowsPerPage
 * @param sortBy
 * @param sortDirection
 * @param showAll
 * @param userId
 * @returns {Array}
 */
const sortAndSlice = (arrToSlice, page, rowsPerPage, sortBy, sortDirection, showAll, userId) => {
  //const arr = showAll ? arrToSlice.filter(doc => parseInt(doc.uploadedBy.id) === parseInt(userId)) : arrToSlice
  const arr = arrToSlice
  
  if (arr.length === 0) return []
  const sorted = sortListOfObjects(arr, sortBy, sortDirection)
  const ids = sorted.map(m => m._id)
  let rows = parseInt(rowsPerPage)
  if (rowsPerPage === 'All')
    rows = ids.length
  return sliceTable(ids, page, rows)
}

export const docManagementReducer = (state = INITIAL_STATE, action) => {
  let rows = parseInt(state.rowsPerPage)
  switch (action.type) {
    case types.GET_DOCUMENTS_REQUEST:
      return {
        ...state,
        getDocumentsInProgress: true,
        allSelected: false,
        bulkOperationInProgress: false
      }
    
    case types.GET_DOCUMENTS_SUCCESS:
      let obj = arrayToObject(action.payload.documents, '_id')
      let userDocs = action.payload.documents.filter(
        doc => parseInt(doc.uploadedBy.id) === parseInt(action.payload.userId)
      )
      let userDocObj = arrayToObject(userDocs, '_id')
      const visible = sortAndSlice(
        userDocs,
        0,
        state.rowsPerPage,
        state.sortBy,
        state.sortDirection
      )
      
      return {
        ...state,
        documents: {
          byId: obj,
          allIds: Object.keys(obj),
          visible,
          checked: [],
          matches: [],
          userDocs: Object.keys(userDocObj)
        },
        getDocumentsInProgress: false,
        pageError: '',
        page: 0,
        count: userDocs.length,
        showAll: false
      }
    
    case types.GET_DOCUMENTS_FAIL:
      return {
        ...state,
        getDocumentsInProgress: false,
        pageError: 'We couldn\'t retrieve the list of documents.'
      }
    
    case types.ON_TOGGLE_ALL_DOCS:
      return {
        ...state,
        showAll: !state.showAll,
        documents: {
          ...state.documents,
          visible: sortAndSlice(
            action.payload,
            0,
            state.rowsPerPage,
            state.sortBy,
            state.sortDirection
          )
        },
        count: action.payload.length,
        page: 0
      }
    
    case types.ON_PAGE_CHANGE:
      return {
        ...state,
        documents: {
          ...state.documents,
          visible: sortAndSlice(
            action.payload,
            action.page,
            state.rowsPerPage,
            state.sortBy,
            state.sortDirection
          )
        },
        page: action.page
      }
    
    case types.ON_ROWS_CHANGE:
      let page = state.page
      if (action.rowsPerPage === 'All') {
        rows = action.payload.length
        page = 0
      } else {
        rows = parseInt(action.rowsPerPage)
      }
      return {
        ...state,
        documents: {
          ...state.documents,
          visible: sortAndSlice(
            action.payload,
            page,
            rows,
            state.sortBy,
            state.sortDirection
          )
        },
        page,
        rowsPerPage: action.rowsPerPage
      }
    
    case types.ON_SELECT_ALL:
      return {
        ...state,
        documents: {
          ...state.documents,
          checked: state.allSelected ? [] : state.documents.visible
        },
        allSelected: !state.allSelected
      }
    
    case types.ON_SELECT_ONE_FILE:
      let updatedChecked = [...state.documents.checked]
      
      if (state.documents.checked.includes(action.id)) {
        const index = state.documents.checked.indexOf(action.id)
        updatedChecked.splice(index, 1)
      } else {
        updatedChecked = [...updatedChecked, action.id]
      }
      
      return {
        ...state,
        documents: {
          ...state.documents,
          checked: updatedChecked
        }
      }
    
    case uploadTypes.UPLOAD_ONE_DOC_COMPLETE:
      if (!action.payload.failed) {
        obj = { ...state.documents.byId, [action.payload.doc._id]: action.payload.doc }
        let userDocs = state.documents.userDocs.map(id => ({ _id: id, ...state.documents.byId[id] }))
        let docArr = state.showAll ? Object.values(obj) : [action.payload.doc, ...userDocs]
        
        return {
          ...state,
          documents: {
            ...state.documents,
            byId: obj,
            allIds: Object.keys(obj),
            visible: sortAndSlice(
              docArr,
              state.page,
              state.rowsPerPage,
              state.sortBy,
              state.sortDirection
            ),
            userDocs: [...state.documents.userDocs, action.payload.doc._id]
          },
          count: docArr.length
        }
      } else {
        return state
      }
    
    case types.SEARCH_VALUE_CHANGE:
      const sorted = sortAndSlice(action.payload, 0, state.rowsPerPage, state.sortBy, state.sortDirection)
      
      return {
        ...state,
        documents: {
          ...state.documents,
          visible: sorted,
          matches: action.payload
        },
        page: 0,
        count: action.payload.length
      }
    
    case types.BULK_DELETE_REQUEST:
      return {
        ...state,
        bulkOperationInProgress: true
      }
    
    case types.BULK_DELETE_SUCCESS:
      let updatedDocs = { ...state.documents.byId }
      state.documents.checked.forEach(docId => {
        const { [docId]: removed, ...docs } = updatedDocs
        updatedDocs = docs
      })
      
      userDocs = Object.values(updatedDocs)
        .filter(doc => parseInt(doc.uploadedBy.id) === parseInt(action.payload.userId))
      let docArr = state.showAll ? Object.values(updatedDocs) : userDocs
      
      return {
        ...state,
        documents: {
          ...state.documents,
          byId: updatedDocs,
          allIds: Object.keys(updatedDocs),
          visible: sortAndSlice(
            docArr,
            state.page,
            state.rowsPerPage,
            state.sortBy,
            state.sortDirection
          ),
          checked: [],
          matches: [],
          userDocs: userDocs.map(doc => doc._id)
        },
        count: docArr.length,
        bulkOperationInProgress: false,
        allSelected: false
      }
    
    case types.BULK_UPDATE_REQUEST:
    case types.BULK_REMOVE_PROJECT_REQUEST:
      return {
        ...state,
        bulkOperationInProgress: true
      }
    
    case types.BULK_UPDATE_SUCCESS:
      obj = action.payload.docs
      docArr = state.showAll
        ? Object.values(obj)
        : state.documents.userDocs.map(id => ({ _id: id, ...obj[id] }))
      
      return {
        ...state,
        documents: {
          ...state.documents,
          byId: obj,
          allIds: Object.keys(obj),
          visible: sortAndSlice(
            docArr,
            state.page,
            state.rowsPerPage,
            state.sortBy,
            state.sortDirection
          ),
          checked: []
        },
        bulkOperationInProgress: false,
        apiErrorOpen: false,
        allSelected: false
      }
    
    case types.BULK_DELETE_FAIL:
    case types.CLEAN_PROJECT_LIST_FAIL:
    case types.BULK_UPDATE_FAIL:
      return {
        ...state,
        bulkOperationInProgress: false,
        cleanProjectOperationInProgress: false,
        apiErrorInfo: {
          title: '',
          text: action.payload.error
        },
        apiErrorOpen: true
      }
    
    case types.CLEAN_PROJECT_LIST_REQUEST:
      return {
        ...state,
        cleanProjectOperationInProgress: true,
        apiErrorOpen: false
      }
    
    case types.CLEAN_PROJECT_LIST_SUCCESS:
      obj = action.payload
      return {
        ...state,
        documents: {
          ...state.documents,
          byId: obj
        },
        cleanProjectOperationInProgress: false,
        apiErrorOpen: false
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
    
    case types.SORT_DOCUMENTS:
      const currentSortField = state.sortBy
      const currentSortDirection = state.sortDirection
      let sortDirection = 'desc'
      if (action.sortDirection === undefined) {
        if (currentSortField !== action.sortBy) {
          // if sort field changed,  set sort direct to asc
          sortDirection = 'asc'
        } else {
          sortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc'
        }
      } else {
        sortDirection = action.sortDirection
      }
      
      return {
        ...state,
        sortBy: action.sortBy,
        sortDirection: sortDirection,
        documents: {
          ...state.documents,
          visible: sortAndSlice(action.payload, state.page, state.rowsPerPage, action.sortBy, sortDirection)
        }
      }
    
    case types.ON_DELETE_ONE_FILE:
      updatedChecked = [...state.documents.checked]
      
      if (state.documents.checked.includes(action.id)) {
        const index = state.documents.checked.indexOf(action.id)
        updatedChecked.splice(index, 1)
      }
      return {
        ...state,
        documents: {
          ...state.documents,
          checked: updatedChecked
        }
      }
    
    case types.FLUSH_STATE:
      return INITIAL_STATE
    
    default:
      return state
  }
}

const MAIN_COMBINED_STATE = {
  list: INITIAL_STATE,
  projectSuggestions: AUTO_INITIAL_STATE,
  jurisdictionSuggestions: AUTO_INITIAL_STATE
}

const COMBINED_INITIAL_STATE = {
  upload: UPLOAD_INITIAL_STATE,
  main: MAIN_COMBINED_STATE,
  search: SEARCH_INITIAL_STATE
}

const docManage = combineReducers({
  list: docManagementReducer,
  projectSuggestions: createAutocompleteReducer('PROJECT', '_BULK'),
  jurisdictionSuggestions: createAutocompleteReducer('JURISDICTION', '_BULK')
})

const docManageReducer = (state = COMBINED_INITIAL_STATE, action) => {
  return {
    upload: upload(state.upload, action),
    main: docManage(state.main, action),
    search: searchReducer(state.search, action)
  }
}

export default docManageReducer
