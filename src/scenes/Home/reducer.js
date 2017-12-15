import * as types from './actionTypes'
import { combineReducers } from 'redux'
import newProjectReducer from './scenes/NewProject/reducer'
import { mockUsers } from 'data/mockUsers'
import { sortList, updater } from 'utils'

const start = new Date(2017, 0, 1)

const INITIAL_STATE = {
  projects: [],
  matches: [],
  bookmarkList: [],
  searchValue: '',
  rowsPerPage: 10,
  page: 0,
  visibleProjects: [],
  sortBy: 'dateLastEdited',
  direction: 'desc',
  sortBookmarked: false,
  errorContent: '',
  error: false,
  projectCount: 0
}

// TODO: Just until the data model is complete
export const mockUpProject = (project) => {
  const user = mockUsers[Math.floor(Math.random() * mockUsers.length)]
  return {
    ...project,
    dateLastEdited: new Date(start.getTime() + Math.random() * (new Date().getTime() - start.getTime())),
    lastEditedBy: `${user.firstName} ${user.lastName}`
  }
}

const sliceProjects = (data, page, rowsPerPage) => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

const sortProjectsByBookmarked = (projects, bookmarkList, sortBy, direction) => {
  if (projects.length === 0) {
    return []
  }
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

const getProjectArrays = (state) => {
  const { projects, bookmarkList, sortBy, direction, matches, page, rowsPerPage, sortBookmarked, searchValue, visibleProjects, projectCount } = state
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
    visibleProjects: sliceProjects(sortedProjects, page, rowsPerPage),
    projectCount: sortedProjects.length
  }

  if (sortBookmarked) {
    if (anyBookmarks(currentList, bookmarkList)) {
      const sortedByBookmarked = sortProjectsByBookmarked(currentList, bookmarkList, sortBy, direction)
      return {
        ...results,
        projects: sortProjectsByBookmarked(projects, bookmarkList, sortBy, direction),
        matches: searchValue.length === 0 ? [] : sortProjectsByBookmarked(matches, bookmarkList, sortBy, direction),
        visibleProjects: sliceProjects(sortedByBookmarked, page, rowsPerPage),
        projectCount: sortedByBookmarked.length
      }
    } else {
      return baseResult
    }
  }
  return baseResult
}

const homeReducer = (state, action) => {
  const updateHomeState = updater.updateItemsInState(state, action)

  switch (action.type) {
    case types.GET_PROJECTS_SUCCESS:return updateHomeState(['error', 'errorContent', 'bookmarkList', 'projects', 'searchValue'])
    case types.TOGGLE_BOOKMARK:return updateHomeState(['bookmarkList'])
    case types.SORT_BOOKMARKED:return updateHomeState(['sortBookmarked'])
    case types.UPDATE_ROWS:return updateHomeState(['rowsPerPage'])
    case types.UPDATE_PAGE:return updateHomeState(['page'])

    case types.UPDATE_SEARCH_VALUE:
      return {
        ...updateHomeState(['searchValue']),
        matches: searchForMatches([...state.projects], action.payload.searchValue.trim().toLowerCase())
      }

    case types.UPDATE_PROJECT_SUCCESS:
      return {
        ...state,
        projects: updater.updateById(action.payload, [...state.projects], 'id'),
        visibleProjects: updater.updateById(action.payload, [...state.visibleProjects], 'id')
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
      console.log(action)
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

const reducerHome = (state = INITIAL_STATE, action) => {
  return Object.values(types).includes(action.type)
    ? { ...state, ...getProjectArrays({ ...homeReducer(state, action) }) }
    : state
}

const homeRootReducer = combineReducers({
  main: reducerHome,
  newProject: newProjectReducer
})

export default homeRootReducer
