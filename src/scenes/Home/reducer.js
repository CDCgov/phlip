import * as types from './actionTypes'
import { combineReducers } from 'redux'
import newProjectReducer from './scenes/NewProject/reducer'
import { sortList, updater, tableUtils, searchUtils } from 'utils'

const INITIAL_STATE = {
  projects: [],
  matches: [],
  bookmarkList: [],
  visibleProjects: [],
  normalizedVisible: [],
  normalizedMatches: [],
  normalizedProjects: {},
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

const normalizeArrayToObject = (arr, key) => ({
  ...arr.reduce((obj, item) => ({
    ...obj,
    [item[key]]: item
  }), {})
})

const sortProjectsByBookmarked = (projects, bookmarkList, sortBy, direction) => {
  const bookmarked = sortList(projects.filter(project => bookmarkList.includes(project.id)), sortBy, direction)
  const nonBookmarked = sortList(projects.filter(project => !bookmarkList.includes(project.id)), sortBy, direction)
  return [...bookmarked, ...nonBookmarked]
}

const anyBookmarks = (projects, bookmarkList) => projects.filter(project => bookmarkList.includes(project.id)).length >
  0

const isMatch = (value, search) => value.toLowerCase().includes(search)

const searchForMatches = (projects, searchValue) => {
  return projects.filter(project => {
    return isMatch(project.name, searchValue)
      || isMatch(project.lastEditedBy, searchValue)
      || isMatch(new Date(project.dateLastEdited).toLocaleDateString(), searchValue)
  })
}

const mapProjects = (arr, sortBy, direction) => {
  return arr.map(p => p.id)
}

const getArrays = (arr, arrName, state) => {
  const { projects, bookmarkList, sortBy, direction, matches, page, rowsPerPage, sortBookmarked } = state

  return {
    [arrName]: sortBookmarked
      ? anyBookmarks(arr, bookmarkList)
        ? sortProjectsByBookmarked(arr, bookmarkList, sortBy, direction)
        : sortList(arr, sortBy, direction)
      : sortList(arr, sortBy, direction)
  }
}

const getPArrays = state => {
  const { projects, searchValue } = state
  let matches = []

  if (projects.length === 0) return state

  if (searchValue !== undefined && searchValue.length > 0) {
    matches = searchUtils.searchForMatches(Object.values(state.normalizedProjects), searchValue, [
      'name', 'dateLastEdited', 'lastEditedBy'
    ])

    if (matches.length === 0) {
      return { ...state, matches: [], visibleProjects: [], projectCount: 0 }
    } else {
      return {
        ...state,
        matches: getArrays(matches, 'matches', state)
      }
    }
  } else {
    return {
      ...state,
      ...getArrays(state.normalizedProjects)
    }
  }
}

const getProjectArrays = state => {
  const {
    projects, bookmarkList, sortBy, direction, matches, page, rowsPerPage,
    sortBookmarked, searchValue, visibleProjects, projectCount
  } = state

  if (projects.length === 0) return state

  let currentList = [...projects]
  let results = { ...state }

  if (searchValue !== undefined && searchValue.length > 0) {
    if (matches.length === 0) {
      return { ...results, projects, visibleProjects: [], projectCount: 0, matches: [] }
    } else {
      currentList = [...matches]
    }
  }

  const sortedProjects = sortList(currentList, sortBy, direction)
  const baseResult = {
    ...results,
    projects: sortList(projects, sortBy, direction),
    matches: searchValue.length === 0 ? [] : sortList(matches, sortBy, direction),
    visibleProjects: tableUtils.sliceTable(sortedProjects, page, rowsPerPage),
    projectCount: sortedProjects.length
  }

  if (sortBookmarked) {
    if (anyBookmarks(currentList, bookmarkList)) {
      const sortedByBookmarked = sortProjectsByBookmarked(currentList, bookmarkList, sortBy, direction)
      return {
        ...results,
        projects: sortProjectsByBookmarked(projects, bookmarkList, sortBy, direction),
        matches: searchValue.length === 0 ? [] : sortProjectsByBookmarked(matches, bookmarkList, sortBy, direction),
        visibleProjects: tableUtils.sliceTable(sortedByBookmarked, page, rowsPerPage),
        projectCount: sortedByBookmarked.length
      }
    } else {
      return baseResult
    }
  }
  return baseResult
}

const mainReducer = (state, action) => {
  const updateHomeState = updater.updateItemsInState(state, action)

  switch (action.type) {
    case types.GET_PROJECTS_SUCCESS:
      return {
        ...updateHomeState(['error', 'errorContent', 'bookmarkList', 'projects', 'searchValue']),
        normalizedProjects: normalizeArrayToObject(action.payload.projects, 'id')
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
      console.log(searchUtils.searchForMatches(state.projects, action.payload.searchValue, [
        'name', 'dateLastEdited', 'lastEditedBy'
      ]))
      return {
        ...updateHomeState(['searchValue']),
        matches: searchForMatches([...state.projects], action.payload.searchValue.trim().toLowerCase()),
        normalizedMatches: searchUtils.searchForMatches(
          Object.values(state.normalizedProjects), action.payload.searchValue, [
            'name', 'dateLastEdited', 'lastEditedBy'
          ]
        )
      }

    case types.UPDATE_PROJECT_SUCCESS:
      return {
        ...state,
        projects: updater.updateByProperty(action.payload, [...state.projects], 'id'),
        visibleProjects: updater.updateByProperty(action.payload, [...state.visibleProjects], 'id')
      }

    case types.ADD_PROJECT_SUCCESS:
      return {
        ...INITIAL_STATE,
        bookmarkList: state.bookmarkList,
        projects: [action.payload, ...state.projects]
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
