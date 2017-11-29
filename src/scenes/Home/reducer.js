import * as types from './actionTypes'
import { combineReducers } from 'redux'
import newProjectReducer from './scenes/NewProject/reducer'
import { mockUsers } from 'data/mockUsers'

let moreProjData = {
  bookmarked: false,
  dateLastEdited: new Date()
}

const INITIAL_STATE = {
  projects: [],
  rowsPerPage: 10,
  page: 0,
  visibleProjects: [],
  sortBy: 'name',
  direction: 'asc',
  errorContent: '',
  error: false
}

// TODO: Just until the data model is complete
const mockUpProject = (project) => {
  const user = mockUsers[Math.floor(Math.random() * mockUsers.length)]
  return { ...project, ...moreProjData, lastEditedBy: `${user.firstName} ${user.lastName}` }
}

const sliceProjects = (data, page, rowsPerPage) => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

const sortProjects = (projects, sortBy, direction) => {
  return (
    direction === 'asc'
      ? projects.sort((a, b) => (a[sortBy] < b[sortBy] ? -1 : 1))
      : projects.sort((a, b) => (b[sortBy] < a[sortBy] ? -1 : 1))
  )
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
      const projects = sortProjects(action.payload.map(mockUpProject), state.sortBy, state.direction)
      //const projects = sortProjects(action.payload, state.sortBy, state.direction)
      return {
        ...state,
        projects,
        visibleProjects: sliceProjects(projects, state.page, state.rowsPerPage)
      }

    case types.TOGGLE_BOOKMARK:
      return {
        ...state,
        projects: updateProjectById(action.project, [...state.projects]),
        visibleProjects: updateProjectById(action.project, [...state.visibleProjects])
      }

    case types.UPDATE_PROJECT_SUCCESS:
      return {
        ...state,
        projects: updateProjectById(action.payload, [...state.projects]),
        visibleProjects: updateProjectById(action.payload, [...state.visibleProjects])
      }

    case types.ADD_PROJECT_SUCCESS:
      const updatedProjects = [
        mockUpProject(action.payload), // only here until the data model is complete
        ...state.projects
      ]
      return {
        ...state,
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
      const sorted = sortProjects(state.projects, action.sortBy, dir)
      return {
        ...state,
        sortBy: action.sortBy,
        direction: dir,
        projects: sorted,
        visibleProjects: sliceProjects(sorted, state.page, state.rowsPerPage)
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
