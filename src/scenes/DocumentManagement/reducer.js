import upload, { COMBINED_INITIAL_STATE as UPLOAD_INITIAL_STATE } from './scenes/Upload/reducer'
import { types } from './actions'
import { arrayToObject } from 'utils/normalize'
import { sliceTable, sortListOfObjects } from 'utils/commonHelpers'
import { searchUtils } from 'utils'
import searchReducer, { COMBINED_INITIAL_STATE as SEARCH_INITIAL_STATE } from './components/SearchBox/reducer'
import { types as searchTypes } from './components/SearchBox/actions'

const INITIAL_STATE = {
  documents: {
    byId: {},
    allIds: [],
    visible: [],
    checked: []
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
  matchedDocs : []
}

const mergeName = docObj => ({
  ...docObj,
  uploadedByName: `${docObj.uploadedBy.firstName} ${docObj.uploadedBy.lastName}`
})

const resetFilter = (docs, stringSearch, projectFilter, jurisdictionFilter) => {
  let matches = docs
  let pieces = []

  const searchFields = {
    name: 'name',
    uploadedBy: 'uploadedByName',
    uploadedDate: 'uploadedDate',
    project: 'projectList',
    jurisdiction: 'jurisdictionList'
  }

  const regEnd = /\)$/
  const regBegin = /^\(/

  const searchParams = stringSearch.split(' | ')
  searchParams.forEach(searchTerm => {
    const searchTermPieces = searchTerm.split(':')
    if (searchTermPieces.length > 1) {
      let searchValue = searchTermPieces[1].trim()
      if (Object.keys(searchFields).includes(searchTermPieces[0])) {
        const searchProperty = searchFields[searchTermPieces[0]]
        if (searchProperty === 'projectList' && projectFilter) {
          matches = matches.filter(doc => doc.projects.includes(projectFilter))
        } else if (searchProperty === 'jurisdictionList' && jurisdictionFilter) {
          matches = matches.filter(doc => doc.jurisdictions.includes(jurisdictionFilter))
        } else {
          // Checking if the search string if multi-worded
          if (regBegin.test(searchValue)) {
            if (regEnd.test(searchValue)) {
              searchValue = searchValue.replace(regBegin, '')
              searchValue = searchValue.replace(regEnd, '')
            } else {
              pieces = searchValue.split(' ')
              if (pieces.length > 1) {
                let foundEnd = false
                for (let i = 1; i < pieces.length; i++) {
                  if (foundEnd) break
                  if (pieces[i].endsWith(')')) {
                    pieces[0] = pieces[0].replace(regBegin, '')
                    pieces[i] = pieces[i].replace(regEnd, '')
                    const searchStringParams = pieces.splice(0, i + 1)
                    searchValue = searchStringParams.join(' ')
                    foundEnd = true
                  }
                }
              }
            }
          } else {
            if (searchValue.trim().split(' ').length > 1) {
              pieces = searchValue.split(' ')
              searchValue = pieces[0]
              pieces = pieces.splice(1, 2)
            }
          }
          pieces.forEach(piece => matches = searchUtils.searchForMatches(matches, piece, Object.values(searchFields)))
          matches = searchUtils.searchForMatches(matches, searchValue, [searchProperty])
        }
      } else {
        matches = searchUtils.searchForMatches(matches, searchTerm, Object.values(searchFields))
      }
    } else {
      matches = searchUtils.searchForMatches(matches, searchTerm, Object.values(searchFields))
    }
  })

  return matches
}

const removeContent = (document, index) => {
  const { content, ...doc } = document
  return doc
}

const sortAndSlice = (arr, page, rowsPerPage, sortBy, sortDirection) => {
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
        getDocumentsInProgress: true
      }

    case types.GET_DOCUMENTS_SUCCESS:
      let docs = action.payload.map(mergeName)
      let obj = arrayToObject(docs, '_id')
      return {
        ...state,
        documents: {
          byId: obj,
          allIds: Object.keys(obj),
          visible: sortAndSlice(Object.values(obj), 0, state.rowsPerPage, state.sortBy, state.sortDirection),
          checked: state.documents.checked
        },
        getDocumentsInProgress: false,
        matchedDocs: []
      }

    case types.ON_PAGE_CHANGE:
      let updatedArr = state.matchedDocs.length!==0?state.matchedDocs:state.documents.byId
      return {
        ...state,
        documents: {
          ...state.documents,
          visible: sortAndSlice(Object.values(updatedArr), action.page, state.rowsPerPage, state.sortBy, state.sortDirection)
        },
        page: action.page
      }
    case types.ON_ROWS_CHANGE:
      updatedArr = Object.values(state.matchedDocs.length!==0?state.matchedDocs:state.documents.byId)
      if (action.rowsPerPage === 'All') {
        rows = updatedArr.length
        page = 0
      } else {
        rows = parseInt(action.rowsPerPage)
      }
      let page = state.page
      return {
        ...state,
        documents: {
          ...state.documents,
          visible: sortAndSlice(updatedArr, page, rows, state.sortBy, state.sortDirection)
        },
        page,
        rowsPerPage: action.rowsPerPage
      }

    case types.ON_SELECT_ALL:
      return {
        ...state,
        documents: {
          ...state.documents,
          checked: state.allSelected ? [] : state.documents.allIds
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

    case types.UPLOAD_DOCUMENTS_SUCCESS:
      docs = action.payload.docs.map(mergeName).map(removeContent)
      obj = { ...state.documents.byId, ...arrayToObject(docs, '_id') }

      return {
        ...state,
        documents: {
          ...state.documents,
          byId: obj,
          allIds: Object.keys(obj),
          visible: sortAndSlice(Object.values(obj), state.page, state.rowsPerPage, state.sortBy, state.sortDirection)
        }
      }

    case searchTypes.SEARCH_VALUE_CHANGE:
      docs = [...Object.values(state.documents.byId)]
      let matches = resetFilter(docs, action.value, action.form.project.id, action.form.jurisdiction.id)
      return {
        ...state,
        documents: {
          ...state.documents,
          visible: sortAndSlice(matches, state.page, state.rowsPerPage, state.sortBy, state.sortDirection)
        },
        matchedDocs:matches
      }

    case types.BULK_DELETE_REQUEST:
      return {
        ...state,
        bulkOperationInProgress: true
      }

    case types.BULK_DELETE_SUCCESS:
      state.documents.checked.forEach(docId => {
        delete state.documents.byId[docId]
      })
      obj = state.documents.byId
      return {
        ...state,
        documents: {
          ...state.documents,
          byId: obj,
          allIds: Object.keys(obj),
          visible: sortAndSlice(Object.values(obj), state.page, state.rowsPerPage, state.sortBy, state.sortDirection),
          checked: []
        },
        bulkOperationInProgress: false
      }

    case types.BULK_DELETE_FAIL:
      return {
        ...state,
        bulkOperationInProgress: false,
        apiErrorInfo: {
          title: 'Bulk delete error',
          text: 'Failed to delete documents.'
        },
        apiErrorOpen: true
      }

    case types.BULK_UPDATE_REQUEST:
      return {
        ...state,
        bulkOperationInProgress: true
      }

    case types.BULK_UPDATE_SUCCESS:
      obj = action.payload
      return {
        ...state,
        documents: {
          ...state.documents,
          byId: obj,
          allIds: Object.keys(obj),
          visible: sortAndSlice(Object.values(obj), state.page, state.rowsPerPage, state.sortBy, state.sortDirection),
          checked: []
        },
        bulkOperationInProgress: false,
        apiErrorOpen: false,
        allSelected: false
      }

    case types.BULK_UPDATE_FAIL:
      return {
        ...state,
        bulkOperationInProgress: false,
        apiErrorInfo: {
          title: 'Bulk update error',
          text: 'Failed to update documents.'
        },
        apiErrorOpen: true
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
      updatedArr = state.matchedDocs.length!==0?state.matchedDocs:state.documents.byId
      return {
        ...state,
        sortBy: action.sortBy,
        sortDirection: sortDirection,
        documents: {
          ...state.documents,
          visible: sortAndSlice(Object.values(updatedArr), state.page, state.rowsPerPage, action.sortBy, sortDirection)
        }
      }

    case types.FLUSH_STATE:
      return INITIAL_STATE

    default:
      return state
  }
}

const COMBINED_INITIAL_STATE = {
  upload: UPLOAD_INITIAL_STATE,
  main: INITIAL_STATE,
  search: SEARCH_INITIAL_STATE
}

const docManageReducer = (state = COMBINED_INITIAL_STATE, action) => {
  return {
    upload: upload(state.upload, action),
    main: docManagementReducer(state.main, action),
    search: searchReducer(state.search, action)
  }
}

export default docManageReducer
