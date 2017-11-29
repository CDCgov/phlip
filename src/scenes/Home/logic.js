import { createLogic } from 'redux-logic'
import * as types from './actionTypes'
import newProjectLogic from './scenes/NewProject/logic'

export const getProjectLogic = createLogic({
  type: types.GET_PROJECTS_REQUEST,
  latest: true,
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_PROJECTS_SUCCESS,
    failType: types.GET_PROJECTS_FAIL
  },
  async process({ api }) {
    return await api.getProjects()
  }
})

export const toggleBookmarkLogic = createLogic({
  type: types.TOGGLE_BOOKMARK,
  transform({ action }, next) {
    const currentProject = action.project
    const project = {
      ...currentProject, 
      bookmarked: !currentProject.bookmarked
    }
    next({ ...action, project })
  }
})

export const updateProjectLogic = createLogic({
  type: [types.UPDATE_PROJECT_REQUEST, types.TOGGLE_BOOKMARK],
  latest: true,
  processOptions: {
    dispatchReturn: true,
    successType: types.UPDATE_PROJECT_SUCCESS,
    failType: types.UPDATE_PROJECT_FAIL
  },
  async process({ action, api }) {
    return await api.updateProject(action.project)
  }
})

export default [
  getProjectLogic,
  updateProjectLogic,
  toggleBookmarkLogic,
  ...newProjectLogic
]