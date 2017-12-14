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
  async process({ api, getState }) {
    const projects = await api.getProjects()
    return { projects, bookmarkList: [...getState().data.user.currentUser.bookmarks] }
  }
})

export const toggleBookmarkLogic = createLogic({
  type: types.TOGGLE_BOOKMARK,
  transform({ action, getState }, next) {
    const currentUser = getState().data.user.currentUser
    let bookmarkList = [...currentUser.bookmarks]

    if (bookmarkList.includes(action.project.id)) {
      bookmarkList.splice(bookmarkList.indexOf(action.project.id), 1)
    } else {
      bookmarkList.push(action.project.id)
    }

    next({ ...action, bookmarkList, user: { ...currentUser, bookmarks: bookmarkList } })
  }
})

export const updateProjectLogic = createLogic({
  type: types.UPDATE_PROJECT_REQUEST,
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