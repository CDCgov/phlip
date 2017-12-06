import * as types from './actionTypes'
import { combineReducers } from 'redux'
import newProjectReducer from './scenes/NewProject/reducer'
import { mockUsers } from 'data/mockUsers'
import { sortList, updateById } from 'utils'

const start = new Date(2017, 0, 1)

const INITIAL_STATE = {
  projects: [],
  suggestions: [],
  searchValue: '',
  rowsPerPage: 10,
  page: 0,
  visibleProjects: [],
  sortBy: 'dateLastEdited',
  direction: 'desc',
  sortBookmarked: false,
  errorContent: '',
  error: false
}

// TODO: Just until the data model is complete
const mockUpProject = (project) => {
  const user = mockUsers[Math.floor(Math.random() * mockUsers.length)]
  return {
    ...project,
    dateLastEdited: new Date(start.getTime() + Math.random() * (new Date().getTime() - start.getTime())),
    bookmarked: false,
    lastEditedBy: `${user.firstName} ${user.lastName}`,
  }
}

const sliceProjects = (data, page, rowsPerPage) => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

const sortProjectsByBookmarked = (projects, sortBy, direction) => {
  const bookmarked = sortList(projects.filter(project => project.bookmarked), sortBy, direction)
  const nonBookmarked = sortList(projects.filter(project => !project.bookmarked), sortBy, direction)
  return [...bookmarked, ...nonBookmarked]
}

const anyBookmarks = (projects) => projects.filter(project => project.bookmarked).length > 0

const searchForMatches = (project, searchValue) => {
  let matches = []
  let p = { matchedKeys: [] }
  Object.keys(project).forEach(key => {
    if (['name', 'dateLastEdited', 'lastEditedBy'].includes(key)) {
      p[key] = project[key]
      project[key].toLowerCase().includes(searchValue) && p.matchedKeys.push(key)
    }
  })

  if (p.matchedKeys.length > 0) {
    matches.push(p)
  }
  return matches
}

const getProjectsAndVisibleProjects = (projects, sortBy, direction, page, rowsPerPage, sortBookmarked) => {
  const sortedProjects = sortList(projects, sortBy, direction)
  const baseResult = { projects: sortedProjects, visibleProjects: sliceProjects(sortedProjects, page, rowsPerPage) }
  if (sortBookmarked) {
    if (anyBookmarks(projects)) {
      const sortedByBookmarked = sortProjectsByBookmarked(projects, sortBy, direction)
      return { projects: sortedByBookmarked, visibleProjects: sliceProjects(sortedByBookmarked, page, rowsPerPage) }
    } else {
      return baseResult
    }
  }
  return baseResult
}

function homeReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_PROJECTS_SUCCESS:
      return {
        ...state,
        error: false,
        errorContent: '',
        ...getProjectsAndVisibleProjects(
          action.payload.map(mockUpProject), state.sortBy, state.direction, state.page, state.rowsPerPage, state.sortBookmarked
          // action.payload, state.sortBy, state.direction, state.page, state.rowsPerPage, state.sortBookmarked
        )
      }

    case types.UPDATE_SEARCH_VALUE:
      return {
        ...state,
        searchValue: action.searchValue
      }

    case types.UPDATE_SUGGESTIONS:
      const searchValue = action.search.value.trim().toLowerCase()
      return {
        ...state,
        suggestions: searchValue.length === 0
          ? []
          : state.projects.map(project => ({
              title: project.name,
              matches: searchForMatches({
                ...project,
                dateLastEdited: new Date(project.dateLastEdited).toLocaleDateString()
              }, searchValue)
            })
          ).filter(project => project.matches.length > 0)
      }

    case types.CLEAR_SUGGESTIONS:
      return {
        ...state,
        suggestions: []
      }

    case types.TOGGLE_BOOKMARK:
      return {
        ...state,
        ...getProjectsAndVisibleProjects(
          updateById(action.project, [...state.projects]), state.sortBy, state.direction, state.page, state.rowsPerPage, state.sortBookmarked
        )
      }

    case types.UPDATE_PROJECT_SUCCESS:
      return {
        ...state,
        projects: updateById(action.payload, [...state.projects]),
        visibleProjects: updateById(action.payload, [...state.visibleProjects])
      }

    case types.ADD_PROJECT_SUCCESS:
      const mockedUpProject = { ...mockUpProject(action.payload), dateLastEdited: new Date() }
      //const mockedUpProject = action.payload
      const updated = getProjectsAndVisibleProjects(state.projects, 'dateLastEdited', 'desc', 0, state.rowsPerPage, false)
      if ((updated.visibleProjects.length + 1) > state.rowsPerPage) {
        updated.visibleProjects.pop()
      }
      return {
        ...state,
        sortBy: 'dateLastEdited',
        direction: 'desc',
        sortBookmarked: false,
        page: 0,
        projects: [mockedUpProject, ...updated.projects],
        visibleProjects: [mockedUpProject, ...updated.visibleProjects]
      }

    case types.UPDATE_ROWS:
      return {
        ...state,
        rowsPerPage: action.rowsPerPage,
        visibleProjects: sliceProjects(state.projects, state.page, action.rowsPerPage)
      }

    case types.UPDATE_PAGE:
      return {
        ...state, page: action.page, visibleProjects: sliceProjects(state.projects, action.page, state.rowsPerPage)
      }

    case types.SORT_PROJECTS:
      const dir = state.direction === 'asc' ? 'desc' : 'asc'
      return {
        ...state,
        sortBy: action.sortBy,
        direction: dir,
        ...getProjectsAndVisibleProjects(
          state.projects, action.sortBy, dir, state.page, state.rowsPerPage, state.sortBookmarked
        )
      }

    case types.SORT_BOOKMARKED:
      return {
        ...state,
        sortBookmarked: !state.sortBookmarked,
        ...getProjectsAndVisibleProjects(
          state.projects, state.sortBy, state.direction, state.page, state.rowsPerPage, !state.sortBookmarked
        )
      }

    case types.UPDATE_PROJECT_FAIL:
      return {
        ...state,
        //errorContent: 'We failed to update that project. Please try again later.',
        //error: true
      }

    case types.GET_PROJECTS_FAIL:
      return {
        ...state, errorContent: 'We failed to get the list of projects. Please try again later.', error: true
      }

    case types.GET_PROJECTS_REQUEST:
    case types.UPDATE_PROJECT_REQUEST:
    default:
      return state
  }
}

const homeRootReducer = combineReducers({
  main: homeReducer,
  newProject: newProjectReducer
})

export default homeRootReducer
