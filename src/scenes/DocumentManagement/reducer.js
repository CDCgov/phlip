import { combineReducers } from 'redux'
import upload from './scenes/Upload/reducer'
import { types } from './actions'
import { arrayToObject } from 'utils/normalize'
import { sliceTable, sortListOfObjects } from 'utils/commonHelpers'
import { createAutocompleteReducer } from 'data/autocomplete/reducer'
import { types as autocompleteTypes } from 'data/autocomplete/actions'
import { searchUtils } from 'utils'

const INITIAL_STATE = {
  documents: {
    byId: {},
    allIds: [],
    visible: [],
    checked: []
  },
  rowsPerPage: '10',
  page: 0,
  searchValue: '',
  allSelected: false,
  searchByProject: null,
  searchByJurisdiction: null
}

const mergeName = docObj => ({
  ...docObj,
  uploadedByName: `${docObj.uploadedBy.firstName} ${docObj.uploadedBy.lastName}`
})

const resetFilter = (docs, stringSearch, projectFilter, jurisdictionFilter) => {
  let matches = docs

  if (stringSearch !== '') {
    matches = searchUtils.searchForMatches(docs, stringSearch, ['name', 'uploadedByName', 'uploadedDate'])
  }

  if (projectFilter !== null) {
    matches = matches.filter(doc => doc.projects.includes(projectFilter))
  }

  if (jurisdictionFilter !== null) {
    matches = matches.filter(doc => doc.jurisdictions.includes(jurisdictionFilter))
  }

  return matches
}

const sortAndSlice = (arr, page, rowsPerPage) => {
  if (arr.length === 0) return []

  const sorted = sortListOfObjects(arr, 'uploadedDate', 'desc')
  const ids = sorted.map(m => m._id)
  let rows = parseInt(rowsPerPage)
  if (rowsPerPage === 'All')
    rows = ids.length

  return sliceTable(ids, page, rows)
}

export const docManagementReducer = (state = INITIAL_STATE, action) => {
  let rows = parseInt(state.rowsPerPage)
  switch (action.type) {
    case types.GET_DOCUMENTS_SUCCESS:
      let docs = action.payload.map(mergeName)
      let obj = arrayToObject(docs, '_id')

      return {
        ...state,
        documents: {
          byId: obj,
          allIds: Object.keys(obj),
          visible: sortAndSlice(Object.values(obj), 0, state.rowsPerPage),
          checked: state.documents.checked
        },
        searchByProject: null,
        searchByJurisdiction: null
      }

    case types.ON_PAGE_CHANGE:
      return {
        ...state,
        documents: {
          ...state.documents,
          visible: sliceTable(state.documents.allIds, action.page, parseInt(state.rowsPerPage))
        },
        page: action.page
      }

    case types.ON_ROWS_CHANGE:
      rows = parseInt(action.rowsPerPage)
      let page = state.page
      if (action.rowsPerPage === 'All') {
        rows = state.documents.allIds.length
        page = 0
      }

      return {
        ...state,
        documents: {
          ...state.documents,
          visible: sliceTable(state.documents.allIds, page, rows)
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
      docs = action.payload.docs.map(mergeName)
      obj = { ...state.documents.byId, ...arrayToObject(docs, '_id') }

      return {
        ...state,
        documents: {
          ...state.documents,
          byId: obj,
          allIds: Object.keys(obj),
          visible: sortAndSlice(Object.values(obj), state.page, state.rowsPerPage)
        }
      }

    case types.ON_SEARCH_FIELD_CHANGE:
      docs = [...Object.values(state.documents.byId)]
      let matches = resetFilter(docs, action.searchValue, state.searchByProject, state.searchByJurisdiction)

      return {
        ...state,
        searchValue: action.searchValue,
        documents: {
          ...state.documents,
          visible: sortAndSlice(matches, state.page, state.rowsPerPage)
        }
      }

    case `${autocompleteTypes.ON_SUGGESTION_SELECTED}_JURISDICTION_MAIN`:
      docs = [...Object.values(state.documents.byId)]
      matches = resetFilter(docs, state.searchValue, state.searchByProject, action.suggestion.id)

      return {
        ...state,
        documents: {
          ...state.documents,
          visible: sortAndSlice(matches, state.page, state.rowsPerPage)
        },
        searchByJurisdiction: action.suggestion.id
      }

    case `${autocompleteTypes.ON_SUGGESTION_SELECTED}_PROJECT_MAIN`:
      docs = [...Object.values(state.documents.byId)]
      matches = resetFilter(docs, state.searchValue, action.suggestion.id, state.searchByJurisdiction)

      return {
        ...state,
        documents: {
          ...state.documents,
          visible: sortAndSlice(matches, state.page, state.rowsPerPage)
        },
        searchByProject: action.suggestion.id
      }

    case `${autocompleteTypes.UPDATE_SEARCH_VALUE}_JURISDICTION_MAIN`:
      if (state.searchByJurisdiction !== null) {
        docs = [...Object.values(state.documents.byId)]
        matches = resetFilter(docs, state.searchValue, state.searchByProject, null)

        return {
          ...state,
          searchByJurisdiction: null,
          documents: {
            ...state.documents,
            visible: sortAndSlice(matches, state.page, state.rowsPerPage)
          }
        }
      } else {
        return state
      }

      case `${autocompleteTypes.UPDATE_SEARCH_VALUE}_PROJECT_MAIN`:
        if (state.searchByProject !== null) {
          docs = [...Object.values(state.documents.byId)]
          matches = resetFilter(docs, state.searchValue, null, state.searchByJurisdiction)

          return {
            ...state,
            searchByProject: null,
            documents: {
              ...state.documents,
              visible: sortAndSlice(matches, state.page, state.rowsPerPage)
            }
          }
        } else {
          return state
        }

    case types.FLUSH_STATE:
      return INITIAL_STATE

    default:
      return state
  }
}

const docManageReducer = combineReducers({
  upload,
  main: docManagementReducer,
  projectSuggestions: createAutocompleteReducer('PROJECT', '_MAIN'),
  jurisdictionSuggestions: createAutocompleteReducer('JURISDICTION', '_MAIN')
})

export default docManageReducer