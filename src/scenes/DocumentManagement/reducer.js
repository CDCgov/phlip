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
  allSelected: false
}

const mergeName = docObj => ({
  ...docObj,
  uploadedByName: `${docObj.uploadedBy.firstName} ${docObj.uploadedBy.lastName}`
})

const resetFilter = (docs, stringSearch, projectFilter, jurisdictionFilter) => {
  console.log(docs)
  console.log(jurisdictionFilter, projectFilter)
  let matches = docs

  const searchFields = ['name', 'uploadedBy', 'uploadedDate', 'project', 'jurisdiction']
  const regEnclose = RegExp('^(.*.)$')

  const searchParams = stringSearch.split(' | ')
  searchParams.forEach(searchTerm => {
    let searchTermPieces = searchTerm.split(':')
    if (searchTermPieces.length > 1) {
      let searchProperty = searchTermPieces[0]
      let searchValue = searchTermPieces[1]

      if (searchFields.includes(searchProperty)) {
        if (searchProperty === 'project' && projectFilter !== null) {
          matches = matches.filter(doc => doc.projects.includes(projectFilter))
        } else if (searchProperty === 'jurisdiction' && jurisdictionFilter !== null) {
          matches = matches.filter(doc => doc.jurisdictions.includes(jurisdictionFilter))
        } else {
          switch (searchProperty) {
            case 'project':
              searchProperty = 'projectList'
              break
            case 'jurisdiction':
              searchProperty = 'jurisdictionList'
              break
            case 'uploadedBy':
              searchProperty = 'uploadedByName'
              break
          }

          if (regEnclose.test(searchValue)) {
            searchValue = searchValue.toString().replace('(', '').replace(')', '').trim()
          }

          matches = searchUtils.searchForMatches(matches, searchValue, [searchProperty])
        }
      } else {
        matches = searchUtils.searchForMatches(matches, searchTerm, [
          'name', 'uploadedByName', 'uploadedDate', 'projectList', 'jurisdictionList'
        ])
      }
    } else {
      matches = searchUtils.searchForMatches(matches, searchTerm, [
        'name', 'uploadedByName', 'uploadedDate', 'projectList', 'jurisdictionList'
      ])
    }
  })

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

    case searchTypes.SEARCH_VALUE_CHANGE:
      docs = [...Object.values(state.documents.byId)]
      let matches = resetFilter(docs, action.value, action.form.project.id, action.form.jurisdiction.id)

      return {
        ...state,
        documents: {
          ...state.documents,
          visible: sortAndSlice(matches, state.page, state.rowsPerPage)
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