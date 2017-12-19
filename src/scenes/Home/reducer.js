import * as types from './actionTypes'
import { combineReducers } from 'redux'
import newProjectReducer from './scenes/NewProject/reducer'
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
  rowsPerPage: 10,
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
  return {
    projects: {
      byId: normalize.arrayToObject(updatedProjects),
      allIds: normalize.mapArray(updatedProjects)
    },
    visibleProjects: normalize.mapArray(tableUtils.sliceTable(updatedArr, page, rowsPerPage)),
    projectCount: updatedArr.length
  }
}

const getProjectArrays = state => {
  const { projects, searchValue, page, rowsPerPage } = state
  let matches = []
  const updatedProjects = sortArray(Object.values(state.projects.byId), state)
  const setArrays = setProjectValues(updatedProjects)

  if (projects.length === 0) return state

  if (searchValue !== undefined && searchValue.length > 0) {
    matches = searchUtils.searchForMatches(Object.values(state.projects.byId), searchValue, [
      'name', 'dateLastEdited', 'lastEditedBy'
    ])

    if (matches.length === 0) {
      return { ...state, matches: [], visibleProjects: [], allIds: [], projectCount: 0 }
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
      ...setArrays(updatedProjects, page, rowsPerPage)
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

    case types.TOGGLE_BOOKMARK:
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
          ...state.projects,
          byId: {
            ...state.projects.byId,
            [action.payload.id]: action.payload
          },
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

    case types.UPDATE_PROJECT_FAIL:
    case types.GET_PROJECTS_REQUEST:
    case types.UPDATE_PROJECT_REQUEST:
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
  newProject: newProjectReducer
})

export default homeRootReducer
