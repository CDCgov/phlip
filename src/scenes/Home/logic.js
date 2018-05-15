import { createLogic } from 'redux-logic'
import * as types from './actionTypes'
import addEditProjectLogic from './scenes/AddEditProject/logic'
import addEditJurisdictions from './scenes/AddEditJurisdictions/logic'
import sortList from 'utils/sortList'

export const getProjectLogic = createLogic({
  type: types.GET_PROJECTS_REQUEST,
  latest: true,
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_PROJECTS_SUCCESS,
    failType: types.GET_PROJECTS_FAIL
  },
  async process({ api, getState }) {
    const projects = await api.getProjects({}, {}, {})
    return {
      projects: projects.map(project => ({
        ...project,
        lastEditedBy: project.lastEditedBy.trim(),
        projectJurisdictions: sortList(project.projectJurisdictions, 'name', 'asc')
      })),
      bookmarkList: [...getState().data.user.currentUser.bookmarks],
      error: false, errorContent: '', searchValue: ''
    }
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

    const apiObj = {
      userId: currentUser.id,
      projectId: action.project.id
    }

    let out
    if (add) {
      out = await api.addUserBookmark({}, {}, apiObj)
    } else {
      out = await api.removeUserBookmark({}, {}, apiObj)
    }

    return { bookmarkList, user: { ...currentUser, bookmarks: bookmarkList } }
  }
})

export const updateFieldsLogic = createLogic({
  type: types.UPDATE_EDITED_FIELDS,
  transform({ action, getState }, next) {
    const currentUser = getState().data.user.currentUser
    const user = `${currentUser.firstName} ${currentUser.lastName}`
    next({
      ...action,
      user,
      projectId: action.projectId
    })
  }
})

export const exportDataLogic = createLogic({
  type: types.EXPORT_DATA_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.EXPORT_DATA_SUCCESS,
    failType: types.EXPORT_DATA_FAIL
  },
  async process({ action, getState, api }) {
    return await api.exportData({}, { params: { type: action.exportType } }, { projectId: action.project.id })
  }
})

export default [
  getProjectLogic,
  toggleBookmarkLogic,
  updateFieldsLogic,
  exportDataLogic,
  ...addEditProjectLogic,
  ...addEditJurisdictions
]