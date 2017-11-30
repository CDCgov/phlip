import * as types from './actionTypes'
import { combineReducers } from 'redux'
import newProjectReducer from './scenes/NewProject/reducer'
import { mockUsers } from 'data/mockUsers'
import sortList from '../../utils/sortList'

let moreProjData = {
  bookmarked: false,
  dateLastEdited: new Date()
}

const INITIAL_STATE = {
  projects: [],
  rowsPerPage: 10,
  page: 0,
  visibleProjects: [],
  sortBy: 'dateLastEdited',
  direction: 'desc',
  sortBookmarks: false,
  errorContent: '',
  error: false
}

// TODO: Just until the data model is complete
const mockUpProject = (project) => {
  const user = mockUsers[Math.floor(Math.random() * mockUsers.length)]
  return { ...project, ...moreProjData, lastEditedBy: `${user.firstName} ${user.lastName}` }
}

const sliceProjects = (data, page, rowsPerPage) => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

const sortProjectByType = (projects, sortBy, direction) => {
  return (
    direction === 'asc'
      ? projects.sort((a, b) => (a[sortBy] < b[sortBy] ? -1 : 1))
      : projects.sort((a, b) => (b[sortBy] < a[sortBy] ? -1 : 1))
  )
}

const sortProjects = (projects, sortBy, direction, sortBookmarks) => {
  if (sortBookmarks) {
    const bookmarked = sortProjectByType(projects.filter(project => project.bookmarked), sortBy, direction)
    const nonBookmarked = sortProjectByType(projects.filter(project => !project.bookmarked), sortBy, direction)
    return [...bookmarked, ...nonBookmarked]
  } else {
    return sortProjectByType(projects, sortBy, direction)
  }
}

const updateProjectById = (updatedProject, projectArr) => {
  return projectArr.map(project =>
    (project.id === updatedProject.id)
      ? updatedProject
      : project
  )
}

function homeReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_PROJECTS_SUCCESS:
      const projects = sortList(action.payload.map(mockUpProject), state.sortBy, state.direction)
      //const projects = sortList(action.payload, state.sortBy, state.direction)
      return {
        ...state,
        projects,
        visibleProjects: sliceProjects(projects, state.page, state.rowsPerPage)
      }

    case types.TOGGLE_BOOKMARK:
      let updatedProjs = updateProjectById(action.project, [...state.projects])
      let updatedSorted = sortProjects(updatedProjs, state.sortBy, state.direction, state.sortBookmarks)
      return {
        ...state,
        projects: updatedSorted,
        visibleProjects: sliceProjects(updatedSorted, state.page, state.rowsPerPage)
      }

    case types.UPDATE_PROJECT_SUCCESS:
      return {
        ...state,
        projects: updateProjectById(action.payload, [...state.projects]),
        visibleProjects: updateProjectById(action.payload, [...state.visibleProjects])
      }

    case types.ADD_PROJECT_SUCCESS:
      let updatedProjects = [
        mockUpProject(action.payload), // only here until the data model is complete
        ...sortProjectByType([...state.projects], 'dateLastEdited', 'desc')
      ]
      return {
        ...state,
        sortBy: 'dateLastEdited',
        direction: 'desc',
        sortBookmarks: false,
        projects: updatedProjects,
        visibleProjects: sliceProjects(updatedProjects, state.page, state.rowsPerPage)
      }

    case types.UPDATE_ROWS:
      return {
        ...state,
        rowsPerPage: action.rowsPerPage,
        visibleProjects: sliceProjects(state.projects, state.page, action.rowsPerPage)
      }

    case types.UPDATE_PAGE:
      return {
        ...state,
        page: action.page,
        visibleProjects: sliceProjects(state.projects, action.page, state.rowsPerPage)
      }

    case types.SORT_PROJECTS:
      const dir = state.direction === 'asc' ? 'desc' : 'asc'
      let sorted = sortProjects(state.projects, action.sortBy, dir, state.sortBookmarks)
      return {
        ...state,
        sortBy: action.sortBy,
        direction: dir,
        projects: sorted,
        visibleProjects: sliceProjects(sorted, state.page, state.rowsPerPage)
      }

    case types.SORT_BOOKMARKS:
      let sort = sortProjects(state.projects, state.sortBy, state.direction, !state.sortBookmarks)
      return {
        ...state,
        projects: sort,
        sortBookmarks: !state.sortBookmarks,
        visibleProjects: sliceProjects(sort, state.page, state.rowsPerPage)
      }

    case types.UPDATE_PROJECT_FAIL:
      return {
        ...state,
        errorContent: 'We failed to update that project. Please try again later.',
        error: true
      }

    case types.GET_PROJECTS_FAIL:
      return {
        ...state,
        errorContent: 'We failed to get the list of projects. Please try again later.',
        error: true
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
