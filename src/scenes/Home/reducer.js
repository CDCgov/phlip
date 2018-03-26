import * as types from './actionTypes'
import { combineReducers } from 'redux'
import addEditJurisdictions from './scenes/AddEditJurisdictions/reducer'
import addEditProject from './scenes/AddEditProject/reducer'
import { sortList, updater, tableUtils, searchUtils, normalize } from 'utils'

const INITIAL_STATE = {
  projects: {
    byId: {},
    allIds: []
  },
  matches: [],
  bookmarkList: [],
  visibleProjects: [],
  searchValue: '',
  rowsPerPage: '10',
  page: 0,
  sortBy: 'dateLastEdited',
  direction: 'desc',
  sortBookmarked: false,
  errorContent: '',
  error: false,
  projectCount: 0
}

const sortProjectsByBookmarked = (projects, bookmarkList, sortBy, direction) => {
  const bookmarked = sortList(projects.filter(project => bookmarkList.includes(project.id)), sortBy, direction)
  const nonBookmarked = sortList(projects.filter(project => !bookmarkList.includes(project.id)), sortBy, direction)
  return [...bookmarked, ...nonBookmarked]
}

const sortArray = (arr, state) => {
  const { bookmarkList, sortBy, direction, sortBookmarked } = state

  return sortBookmarked
    ? arr.some(x => bookmarkList.includes(x.id))
      ? sortProjectsByBookmarked(arr, bookmarkList, sortBy, direction)
      : sortList(arr, sortBy, direction)
    : sortList(arr, sortBy, direction)
}

const setProjectValues = updatedProjects => (updatedArr, page, rowsPerPage) => {
  const rows = rowsPerPage === 'All' ? updatedArr.length : parseInt(rowsPerPage)
  return {
    projects: {
      byId: normalize.arrayToObject(updatedProjects),
      allIds: normalize.mapArray(updatedProjects)
    },
    visibleProjects: normalize.mapArray(tableUtils.sliceTable(updatedArr, page, rows)),
    projectCount: updatedArr.length
  }
}

const getProjectArrays = state => {
  const { projects, searchValue, page, rowsPerPage } = state
  let matches = searchUtils.searchForMatches(Object.values(state.projects.byId), searchValue, [
    'name', 'dateLastEdited', 'lastEditedBy'
  ])
  const updatedProjects = sortArray(Object.values(state.projects.byId), state)
  const setArrays = setProjectValues(updatedProjects)

  if (projects.length === 0) return state

  if (searchValue !== undefined && searchValue.length > 0) {
    if (matches.length === 0) {
      return { ...state, matches: [], visibleProjects: [], projectCount: 0 }
    } else {
      const updatedMatches = sortArray(matches, state)
      return {
        ...state,
        ...setArrays(updatedMatches, page, rowsPerPage),
        matches: [...normalize.mapArray(updatedMatches)],
      }
    }
  } else {
    return {
      ...state,
      ...setArrays(updatedProjects, page, rowsPerPage),
      matches: []
    }
  }
}

const mainReducer = (state, action) => {
  const updateHomeState = updater.updateItemsInState(state, action)

  switch (action.type) {
    case types.GET_PROJECTS_SUCCESS:
      return {
        ...updateHomeState(['error', 'errorContent', 'bookmarkList', 'searchValue']),
        projects: {
          byId: normalize.arrayToObject(action.payload.projects),
          allIds: normalize.mapArray(action.payload.projects)
        }
      }

    case types.TOGGLE_BOOKMARK_SUCCESS:
      return updateHomeState(['bookmarkList'])

    case types.SORT_BOOKMARKED:
      return updateHomeState(['sortBookmarked'])

    case types.UPDATE_ROWS:
      return updateHomeState(['rowsPerPage'])

    case types.UPDATE_PAGE:
      return updateHomeState(['page'])

    case types.UPDATE_SEARCH_VALUE:
      return updateHomeState(['searchValue'])

    case types.UPDATE_PROJECT_SUCCESS:
      return {
        ...state,
        projects: {
          byId: {
            ...state.projects.byId,
            [action.payload.id]: action.payload
          },
          allIds: state.projects.allIds
        }
      }

    case types.ADD_PROJECT_SUCCESS:
      return {
        ...INITIAL_STATE,
        bookmarkList: state.bookmarkList,
        projects: {
          byId: { [action.payload.id]: action.payload, ...state.projects.byId},
          allIds: [action.payload.id, ...state.projects.allIds]
        }
      }

    case types.SORT_PROJECTS:
      return {
        ...updateHomeState(['sortBy']),
        direction: state.direction === 'asc' ? 'desc' : 'asc'
      }

    case types.GET_PROJECTS_FAIL:
      return {
        ...state, errorContent: 'We failed to get the list of projects. Please try again later.', error: true
      }

    case types.FLUSH_STATE:
      return { ...INITIAL_STATE, rowsPerPage: state.rowsPerPage }

    case types.UPDATE_EDITED_FIELDS:
      let project = state.projects.byId[action.projectId]
      return {
        ...state,
        projects: {
          byId: {
            ...state.projects.byId,
            [project.id]: {
              ...project,
              lastEditedBy: action.user,
              dateLastEdited: new Date().toISOString()
            }
          },
          allIds: state.projects.allIds
        }
      }

    case types.ADD_JURISDICTION_TO_PROJECT:
      let updatedProject = state.projects.byId[action.projectId]
      return {
        ...state,
        projects: {
          byId: {
            ...state.projects.byId,
            [updatedProject.id]: {
              ...updatedProject,
              projectJurisdictions: [ ...updatedProject.projectJurisdictions, action.jurisdiction ]
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
            [action.projectId]: {
              ...state.projects.byId[action.projectId],
              projectJurisdictions: updater.updateByProperty(action.jurisdiction, state.projects.byId[action.projectId].projectJurisdictions, 'id' )
            }
          }
        }
      }

    case types.GET_PROJECTS_REQUEST:
    default:
      return state
  }
}

const homeReducer = (state = INITIAL_STATE, action) => {
  return Object.values(types).includes(action.type)
    ? { ...state, ...getProjectArrays({ ...mainReducer(state, action) }) }
    : state
}

const homeRootReducer = combineReducers({
  main: homeReducer,
  addEditProject,
  addEditJurisdictions
})

export default homeRootReducer
