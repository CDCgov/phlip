import { types } from './actions'
import { combineReducers } from 'redux'
import addEditJurisdictions from './scenes/AddEditJurisdictions/reducer'
import addEditProject from './scenes/AddEditProject/reducer'
import { updater, commonHelpers, searchUtils, normalize } from 'utils'

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
  exportError: ''
}

/**
 * Sorts the list of projects by bookmarked. Bookmarked projects are sorted first, and then non-bookmark projects are
 * sorted second.
 *
 * @param {Array} projects
 * @param {Array} bookmarkList
 * @param {String} sortBy
 * @param {String} direction
 * @returns {Array}
 */
const sortProjectsByBookmarked = (projects, bookmarkList, sortBy, direction) => {
  const bookmarked = commonHelpers.sortListOfObjects(projects.filter(project => bookmarkList.includes(project.id)), sortBy, direction)
  const nonBookmarked = commonHelpers.sortListOfObjects(projects.filter(project => !bookmarkList.includes(project.id)), sortBy, direction)
  return [...bookmarked, ...nonBookmarked]
}

/**
 * Determines how the list of project should be sorted, by bookmarked, or just by sortBy and direction
 *
 * @param {Array} arr
 * @param {Object} state
 * @returns {Array}
 */
const sortArray = (arr, state) => {
  const { bookmarkList, sortBy, direction, sortBookmarked } = state

  return sortBookmarked
    ? arr.some(x => bookmarkList.includes(x.id))
      ? sortProjectsByBookmarked(arr, bookmarkList, sortBy, direction)
      : commonHelpers.sortListOfObjects(arr, sortBy, direction)
    : commonHelpers.sortListOfObjects(arr, sortBy, direction)
}

/**
 * Updates the projects object in state and determines the how to slice the project array
 *
 * @param {Array} updatedProjects
 * @returns {function(updatedArr: Array, page: Number, rowsPerPage: String): {projects: {byId: {}, allIds: Array},
 *   visibleProjects: Array, projectCount: Number, page: Number}}
 */
const setProjectValues = updatedProjects => (updatedArr, page, rowsPerPage) => {
  const rows = rowsPerPage === 'All' ? updatedArr.length : parseInt(rowsPerPage)
  return {
    projects: {
      byId: normalize.arrayToObject(updatedProjects),
      allIds: normalize.mapArray(updatedProjects)
    },
    visibleProjects: normalize.mapArray(commonHelpers.sliceTable(updatedArr, page, rows)),
    projectCount: updatedArr.length,
    page
  }
}

/**
 * After every redux action, the state is passed to this function. It makes sure the visibleProject state property is
 * sorted correctly, as well as the rowsPerPage and page.
 *
 * @param {Object} state
 * @returns {Object}
 */
const getProjectArrays = state => {
  const { projects, searchValue, page, rowsPerPage } = state
  let matches = searchUtils.searchForMatches(Object.values(state.projects.byId), searchValue, [
    'name', 'dateLastEdited', 'lastEditedBy'
  ])
  let curPage = page
  const updatedProjects = sortArray(Object.values(state.projects.byId), state)
  const setArrays = setProjectValues(updatedProjects)

  if (rowsPerPage === 'All') curPage = 0

  if (projects.length === 0) return state

  if (searchValue !== undefined && searchValue.length > 0) {
    if (matches.length === 0) {
      return { ...state, matches: [], visibleProjects: [], projectCount: 0 }
    } else {
      const updatedMatches = sortArray(matches, state)
      return {
        ...state,
        ...setArrays(updatedMatches, curPage, rowsPerPage),
        matches: [...normalize.mapArray(updatedMatches)]
      }
    }
  } else {
    return {
      ...state,
      ...setArrays(updatedProjects, curPage, rowsPerPage),
      matches: []
    }
  }
}

/**
 * This is the main reducer for the Home scene
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
export const mainReducer = (state, action) => {
  const updateHomeState = updater.updateItemsInState(state, action)

  switch (action.type) {
    case types.GET_PROJECTS_SUCCESS:
      return {
        ...updateHomeState(['error', 'errorContent', 'bookmarkList', 'searchValue']),
        projects: action.payload.projects
      }
  
    case types.DELETE_PROJECT_SUCCESS: // updating redux to match with backend
      let updatedById = state.projects.byId
      const updatedAllIds = state.projects.allIds.filter(value => value !== action.project)
      delete updatedById[action.project] // remove the project from project list "byId"
      return {
        ...state,
        projects: {
          byId: {
            ...updatedById
          },
          allIds: updatedAllIds
        }
      }
      
    case types.TOGGLE_BOOKMARK_SUCCESS:
      return updateHomeState(['bookmarkList'])
      
    case types.SORT_PROJECTS:
    case types.SORT_BOOKMARKED:
    case types.UPDATE_ROWS:
    case types.UPDATE_PAGE:
    case types.UPDATE_SEARCH_VALUE:
    case types.UPDATE_VISIBLE_PROJECTS:
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

    case types.ADD_JURISDICTION_TO_PROJECT:
      let updatedProject = state.projects.byId[action.payload.projectId]
      return {
        ...state,
        projects: {
          byId: {
            ...state.projects.byId,
            [updatedProject.id]: {
              ...updatedProject,
              projectJurisdictions: commonHelpers.sortListOfObjects([
                ...updatedProject.projectJurisdictions, action.payload.jurisdiction
              ], 'name', 'asc')
            }
          }
        }
      }

    case types.ADD_PRESET_JURISDICTION_TO_PROJECT:
      let updated = state.projects.byId[action.payload.projectId]
      return {
        ...state,
        projects: {
          byId: {
            ...state.projects.byId,
            [updated.id]: {
              ...updated,
              projectJurisdictions: commonHelpers.sortListOfObjects([
                ...updated.projectJurisdictions, ...action.payload.jurisdictions
              ], 'name', 'asc')
            }
          }
        }
      }

    case types.UPDATE_JURISDICTION_IN_PROJECT:
      return {
        ...state,
        projects: {
          byId: {
            ...state.projects.byId,
            [action.payload.projectId]: {
              ...state.projects.byId[action.payload.projectId],
              projectJurisdictions: updater.updateByProperty(action.payload.jurisdiction, state.projects.byId[action.payload.projectId].projectJurisdictions, 'id')
            }
          }
        }
      }

    case types.DELETE_JURISDICTION_FROM_PROJECT:
      const currentJurisdictions = [...state.projects.byId[action.payload.projectId].projectJurisdictions]
      const updatedJurisdictions = currentJurisdictions.filter(value => value.id !== action.payload.jurisdictionId)

      return {
        ...state,
        projects: {
          byId: {
            ...state.projects.byId,
            [action.payload.projectId]: {
              ...state.projects.byId[action.payload.projectId],
              projectJurisdictions: updatedJurisdictions
            }
          }
        }
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
  
    case types.FLUSH_STATE:
      return { ...INITIAL_STATE, rowsPerPage: state.rowsPerPage }

    case types.GET_PROJECTS_REQUEST:
    default:
      return state
  }
}

/**
 * Wrapper for the main reducer, after every action, the setProjectArrays function
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object} - Updated state
 */
export const homeReducer = (state = INITIAL_STATE, action) => {
  return Object.values(types).includes(action.type)
    ? { ...state, ...mainReducer(state, action) }
    : state
}

/**
 * Combines the reducers from ./scenes/AddEditProject and ./scenes/AddEditJurisdiction
 */
const homeRootReducer = combineReducers({
  main: homeReducer,
  addEditProject,
  addEditJurisdictions
})

export default homeRootReducer
