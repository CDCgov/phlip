/**
 * This is all of the redux-logic for the Home ("Project List") scene.
 */
import { createLogic } from 'redux-logic'
import { types } from './actions'
import addEditProjectLogic from './scenes/AddEditProject/logic'
import addEditJurisdictions from './scenes/AddEditJurisdictions/logic'
import { types as projectTypes } from 'data/projects/actions'
import { commonHelpers, normalize } from 'utils'

/**
 * Sends a request to the API to get all of the projects
 */
export const getProjectLogic = createLogic({
  type: types.GET_PROJECTS_REQUEST,
  latest: true,
  async process({ api, getState }, dispatch, done) {
    try {
      let projects = await api.getProjects({}, {}, {})
      projects = projects.map(project => {
        const currentProject = getState().scenes.home.main.projects.byId[project.id]
        const proj = {
          ...project,
          lastEditedBy: project.lastEditedBy.trim(),
          projectJurisdictions: commonHelpers.sortListOfObjects(project.projectJurisdictions, 'name', 'asc'),
          createdById: project.createdById,
          lastUsersCheck: currentProject ? currentProject.lastUsersCheck : null,
          projectUsers: normalize.makeDistinct(project.projectUsers, 'userId')
        }
        dispatch({
          type: getState().data.projects.byId.hasOwnProperty(project.id)
            ? projectTypes.UPDATE_PROJECT
            : projectTypes.ADD_PROJECT,
          payload: proj
        })
        return proj
      })
      
      dispatch({
        type: types.GET_PROJECTS_SUCCESS,
        payload: {
          projects,
          error: false,
          errorContent: '',
          searchValue: '',
          bookmarkList: [...getState().data.user.currentUser.bookmarks]
        }
      })
    } catch (err) {
      dispatch({ type: types.GET_PROJECTS_FAIL })
    }
    done()
  }
})

/**
 * Sends a request to the API to get all users associated with a project
 */
export const getProjectUsersLogic = createLogic({
  type: types.GET_PROJECT_USERS_REQUEST,
  transform({ getState, action }, next) {
    const lastCheck = getState().scenes.home.main.projects.byId[action.projectId].lastUsersCheck
    const now = Date.now()
    const oneday = 60 * 60 * 24 * 1000
    next({
      ...action,
      sendRequest: (lastCheck === null || ((now - lastCheck) > oneday))
    })
  },
  async process({ api, getState, action }, dispatch, done) {
    const pUsers = getState().scenes.home.main.projects.byId[action.projectId].projectUsers
    const allUserObjs = getState().data.user.byId
    
    try {
      if (action.sendRequest) {
        await commonHelpers.handleUserImages(pUsers, allUserObjs, dispatch, api)
        dispatch({
          type: types.GET_PROJECT_USERS_SUCCESS,
          payload: {
            projectId: action.projectId,
            newCheck: true
          }
        })
        done()
      } else {
        dispatch({
          type: types.GET_PROJECT_USERS_SUCCESS,
          payload: {
            projectId: action.projectId,
            newCheck: false
          }
        })
        done()
      }
    } catch (e) {
      dispatch({ type: types.GET_PROJECT_USERS_FAIL, payload: 'Failed to get user profiles' })
      done()
    }
  }
})

/**
 * Sends a request to bookmark or un-bookmark a project for a user
 */
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
    
    if (add) {
      await api.addUserBookmark({}, {}, apiObj)
    } else {
      await api.removeUserBookmark({}, {}, apiObj)
    }
    
    return { bookmarkList, user: { ...currentUser, bookmarks: bookmarkList } }
  }
})

/**
 * Updates the dateLastEdited and lastEditedBy fields for a project, based on the action.projectId
 */
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

/**
 * Sends a request to get the export data for a project
 */
export const exportDataLogic = createLogic({
  type: types.EXPORT_DATA_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.EXPORT_DATA_SUCCESS,
    failType: types.EXPORT_DATA_FAIL
  },
  async process({ action, api }) {
    return await api.exportData({}, { params: { type: action.exportType } }, { projectId: action.project.id })
  }
})

export default [
  getProjectLogic,
  getProjectUsersLogic,
  toggleBookmarkLogic,
  updateFieldsLogic,
  exportDataLogic,
  ...addEditProjectLogic,
  ...addEditJurisdictions
]
