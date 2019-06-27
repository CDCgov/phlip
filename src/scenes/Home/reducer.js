import { types } from './actions'
import { types as projectTypes } from 'data/projects/actions'
import { combineReducers } from 'redux'
import addEditJurisdictions from './scenes/AddEditJurisdictions/reducer'
import addEditProject from './scenes/AddEditProject/reducer'
import { updater } from 'utils'

export const INITIAL_STATE = {
  projects: {
    visible: [],
    matches: []
  },
  bookmarkList: [],
  searchValue: '',
  rowsPerPage: '10',
  page: 0,
  sortBy: 'dateLastEdited',
  direction: 'desc',
  sortBookmarked: false,
  errorContent: '',
  error: false,
  projectCount: 0,
  projectToExport: { text: '' },
  exportError: '',
  openProject: 0
}

/**
 * This is the main reducer for the Home scene
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
export const mainReducer = (state = INITIAL_STATE, action) => {
  const updateHomeState = updater.updateItemsInState(state, action)
  
  switch (action.type) {
    case projectTypes.SET_PROJECTS:
      return {
        ...updateHomeState(['error', 'errorContent', 'bookmarkList', 'searchValue', 'projectCount']),
        projects: action.payload.projects
      }
    
    case types.TOGGLE_BOOKMARK_SUCCESS:
      return updateHomeState(['bookmarkList'])
    
    case types.SORT_PROJECTS:
    case types.SORT_BOOKMARKED:
    case types.UPDATE_ROWS:
    case types.UPDATE_PAGE:
    case types.UPDATE_SEARCH_VALUE:
    case types.UPDATE_VISIBLE_PROJECTS:
    case types.REMOVE_PROJECT:
      return {
        ...state,
        ...action.payload
      }
    
    case types.DELETE_PROJECT_FAIL:
      return {
        ...state, errorContent: 'We couldn\'t delete the project. Please try again later.', error: true
      }
    
    case types.GET_PROJECTS_FAIL:
      return {
        ...state, errorContent: 'We couldn\'t retrieve the project list. Please try again later.', error: true
      }
    
    case types.EXPORT_DATA_REQUEST:
      return {
        ...state,
        projectToExport: {
          ...action.project,
          exportType: action.exportType,
          text: ''
        }
      }
    
    case types.EXPORT_DATA_SUCCESS:
      return {
        ...state,
        projectToExport: {
          ...state.projectToExport,
          text: action.payload
        }
      }
    
    case types.EXPORT_DATA_FAIL:
      return {
        ...state,
        exportError: 'We couldn\'t export the project.'
      }
    
    case types.DISMISS_API_ERROR:
      return {
        ...state,
        [action.errorName]: ''
      }
    
    case types.CLEAR_PROJECT_TO_EXPORT:
      return {
        ...state,
        projectToExport: {
          text: ''
        }
      }
      
    case types.TOGGLE_PROJECT:
      return {
        ...state,
        openProject: action.projectId === state.openProject ? 0 : action.projectId
      }
    
    case types.FLUSH_STATE:
      return { ...INITIAL_STATE, rowsPerPage: state.rowsPerPage, openProject: state.openProject }
    
    case types.GET_PROJECTS_SUCCESS:
    case types.GET_PROJECTS_REQUEST:
    default:
      return state
  }
}

/**
 * Combines the reducers from ./scenes/AddEditProject and ./scenes/AddEditJurisdiction
 */
const homeRootReducer = combineReducers({
  main: mainReducer,
  addEditProject,
  addEditJurisdictions
})

export default homeRootReducer
