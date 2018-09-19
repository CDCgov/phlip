import { combineReducers } from 'redux'
import upload from './scenes/Upload/reducer'
import { types } from './actions'
import { arrayToObject } from 'utils/normalize'
import { sliceTable } from 'utils/commonHelpers'

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
  allSelected: false
}

export const docManagementReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.GET_DOCUMENTS_SUCCESS:
      rows = parseInt(state.rowsPerPage)
      if (state.rowsPerPage === 'All')
        rows = state.documents.allIds.length

      let obj = arrayToObject(action.payload, '_id')
      let allIds = Object.keys(obj)

      return {
        ...state,
        documents: {
          byId: obj,
          allIds,
          visible: sliceTable(allIds, 0, rows),
          checked: state.documents.checked
        }
      }

    case types.ON_PAGE_CHANGE:
      let rows = parseInt(state.rowsPerPage)
      if (state.rowsPerPage === 'All')
        rows = state.documents.allIds.length

      return {
        ...state,
        documents: {
          ...state.documents,
          visible: sliceTable(state.documents.allIds, action.page, rows)
        },
        page: action.page
      }

    case types.ON_ROWS_CHANGE:
      rows = parseInt(action.rowsPerPage)
      if (action.rowsPerPage === 'All')
        rows = state.documents.allIds.length

      return {
        ...state,
        documents: {
          ...state.documents,
          visible: sliceTable(state.documents.allIds, state.page, rows)
        },
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
      obj = arrayToObject(action.payload.docs, '_id')
      allIds = Object.keys(obj)

      return {
        ...state,
        documents: {
          ...state.documents,
          byId: {
            ...state.documents.byId,
            ...obj
          },
          allIds: [...state.documents.allIds, ...allIds]
        }
      }

    default:
      return state
  }
}

const docManageReducer = combineReducers({
  upload,
  main: docManagementReducer
})

export default docManageReducer