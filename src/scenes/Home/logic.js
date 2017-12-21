import { createLogic } from 'redux-logic'
import * as types from './actionTypes'
import addEditProjectLogic from './scenes/AddEditProject/logic'

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
  processOptions: {
    dispatchReturn: true,
    successType: types.TOGGLE_BOOKMARK_SUCCESS
  },
  async process({ api, getState, action }) {
    const currentUser = getState().data.user.currentUser
    let add = true
    let bookmarkList = [...currentUser.bookmarks]


    if (bookmarkList.includes(action.project.id)) {
      bookmarkList.splice(bookmarkList.indexOf(action.project.id), 1)
      add = false
    } else {
      bookmarkList.push(action.project.id)
    }

    let out
    if (add) {
      out = await api.addUserBookmark(currentUser.id, action.project.id)
    } else {
      out = await api.removeUserBookmark(currentUser.id, action.project.id)
    }

    return { bookmarkList, user: { ...currentUser, bookmarks: bookmarkList } }
  }
})

export const updateLastEditedBy = createLogic({
  type: types.UPDATE_PROJECT_REQUEST,
  transform({ getState, action }, next) {
    const currentUser = getState().data.user.currentUser

    next({
      ...action,
      project: { ...action.project, lastEditedBy: `${currentUser.firstName} ${currentUser.lastName}` }
    })
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
    const out = await api.updateProject(action.project)
    return { ...action.project }
  }
})

export default [
  getProjectLogic,
  updateLastEditedBy,
  updateProjectLogic,
  toggleBookmarkLogic,
  ...addEditProjectLogic
]