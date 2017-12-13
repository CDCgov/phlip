import * as types from './actionTypes'
import { combineReducers } from 'redux'
import newProjectReducer from './scenes/NewProject/reducer'
import { mockUsers } from 'data/mockUsers'
import { sortList, updateById } from 'utils'

const start = new Date(2017, 0, 1)

const INITIAL_STATE = {
  projects: [],
  matches: [],
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
  if (projects.length === 0) {
    return []
  }
  const bookmarked = sortList(projects.filter(project => project.bookmarked), sortBy, direction)
  const nonBookmarked = sortList(projects.filter(project => !project.bookmarked), sortBy, direction)
  return [...bookmarked, ...nonBookmarked]
}

const anyBookmarks = (projects) => projects.filter(project => project.bookmarked).length > 0

const isMatch = (value, search) => value.toLowerCase().includes(search)

const searchForMatches = (projects, searchValue) => {
  return projects.filter(project => {
    return isMatch(project.name, searchValue)
      || isMatch(project.lastEditedBy, searchValue)
      || isMatch(new Date(project.dateLastEdited).toLocaleDateString(), searchValue)
  })
}

const updateAllArrays = (state, updated) => {
  const { matches, projects } = state
  return { matches: matches.length > 0 ? updateById(updated, matches) : [], projects: updateById(updated, projects) }
}

const getProjectArrays = (state) => {
  const { projects, sortBy, direction, matches, page, rowsPerPage, sortBookmarked, searchValue } = state
  let currentList = [...projects]

  if (searchValue !== undefined && searchValue.length > 0) {
    if (matches.length === 0) {
      return { projects, visibleProjects: [], projectCount: 0, matches: [] }
    } else {
      currentList = [...matches]
    }
  }

  const sortedProjects = sortList(currentList, sortBy, direction)
  const baseResult = {
    projects: sortList(projects, sortBy, direction),
    matches: searchValue.length === 0 ? [] : sortList(matches, sortBy, direction),
    visibleProjects: sliceProjects(sortedProjects, page, rowsPerPage),
    projectCount: sortedProjects.length
  }

  if (sortBookmarked) {
    if (anyBookmarks(currentList)) {
      const sortedByBookmarked = sortProjectsByBookmarked(currentList, sortBy, direction)
      return {
        projects: sortProjectsByBookmarked(projects, sortBy, direction),
        matches: searchValue.length === 0 ? [] : sortProjectsByBookmarked(matches, sortBy, direction),
        visibleProjects: sliceProjects(sortedByBookmarked, page, rowsPerPage),
        projectCount: sortedByBookmarked.length
      }
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
        ...getProjectArrays({ ...state, matches: [], searchValue: '', projects: action.payload.map(mockUpProject) })
        // ..getProjectArrays({ ...state, matches: [], searchValue: '', projects: action.payload })
      }

    case types.UPDATE_SEARCH_VALUE:
      const searchValue = action.searchValue.trim().toLowerCase()
      const matches = searchForMatches([...state.projects], searchValue)

      return {
        ...state,
        searchValue: action.searchValue,
        ...getProjectArrays({ ...state, matches, searchValue })
      }

    case types.TOGGLE_BOOKMARK:
      return {
        ...state,
        ...getProjectArrays({ ...state, ...updateAllArrays(state, action.project) })
      }

    case types.UPDATE_PROJECT_SUCCESS:
      return {
        ...state,
        projects: updateById(action.payload, [...state.projects]),
        visibleProjects: updateById(action.payload, [...state.visibleProjects])
      }

    case types.ADD_PROJECT_SUCCESS:
      const mockedUpProject = { ...mockUpProject(action.payload), dateLastEdited: new Date(), lastEditedBy: action.payload.lastEditedBy }
      // const mockedUpProject = action.payload
      const updated = getProjectArrays({
        ...INITIAL_STATE,
        projects: state.projects,
        visibleProjects: state.visibleProjects
      })

      if ((updated.visibleProjects.length + 1) > state.rowsPerPage) {
        updated.visibleProjects.pop()
      }

      return {
        ...state,
        ...INITIAL_STATE,
        projects: [mockedUpProject, ...updated.projects],
        visibleProjects: [mockedUpProject, ...updated.visibleProjects],
        projectCount: updated.projectCount
      }

    case types.UPDATE_ROWS:
      return {
        ...state,
        rowsPerPage: action.rowsPerPage,
        ...getProjectArrays({ ...state, rowsPerPage: action.rowsPerPage })
      }

    case types.UPDATE_PAGE:
      return {
        ...state,
        page: action.page,
        ...getProjectArrays({ ...state, page: action.page })
      }

    case types.SORT_PROJECTS:
      const dir = state.direction === 'asc' ? 'desc' : 'asc'
      return {
        ...state,
        sortBy: action.sortBy,
        direction: dir,
        ...getProjectArrays({ ...state, direction: dir, sortBy: action.sortBy })
      }

    case types.SORT_BOOKMARKED:
      return {
        ...state,
        sortBookmarked: !state.sortBookmarked,
        ...getProjectArrays({ ...state, sortBookmarked: !state.sortBookmarked })
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
