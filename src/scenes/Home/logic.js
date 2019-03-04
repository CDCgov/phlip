/**
 * This is all of the redux-logic for the Home ("Project List") scene.
 */
import { createLogic } from 'redux-logic'
import * as types from './actionTypes'
import addEditProjectLogic from './scenes/AddEditProject/logic'
import addEditJurisdictions from './scenes/AddEditJurisdictions/logic'
import { commonHelpers } from 'utils'

/**
 * Sends a request to the API to get all of the projects
 */
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
        projectJurisdictions: commonHelpers.sortListOfObjects(project.projectJurisdictions, 'name', 'asc')
      })),
      bookmarkList: [...getState().data.user.currentUser.bookmarks],
      error: false, errorContent: '', searchValue: ''
    }
  }
})

/**
 * Sends a request to the API to get all users associated with a project
 */
export const getProjectUsersLogic = createLogic({
  type: types.GET_PROJECT_USERS_REQUEST,
  async process({ api, getState , action},dispatch, done) {
    try {
      const currentProjectUsers = getState().scenes.home.main.projectUsers.allIds
      console.log('cur user list ',currentProjectUsers)
      const usersFromDb = await api.getProjectUsers({}, {}, {projectId: action.projectId})
      console.log(usersFromDb)
      let newUsers = []
      const users = usersFromDb.map(user => {
        return new Promise(async resolve => {
          let fullUser = null
          if (!currentProjectUsers.includes(user.id)) {
            try {
              fullUser = await api.getUsers({}, {
                params: {
                  email: user.email
                }
              }, {})
              newUsers.push(fullUser)
            } catch (err) {
              console.log('failed to get user')
            }
          }
          await Promise.all(newUsers)
          resolve(user)
        })
      })
      Promise.all(users).then(() => {
        dispatch({type: types.GET_PROJECT_USERS_SUCCESS,payload:{
          projectId: action.projectId,
          users: usersFromDb,
          newUsers : newUsers
        }})
        done()
      })

      // usersFromDb.forEach(async (user) => {
      //   if (!currentProjectUsers.includes(user.id)) {
      //     try {
      //       const fullUser = await api.getUsers({}, {
      //         params: {
      //           email: user.email
      //         }
      //       }, {})
      //       users.push(
      //         fullUser
      //       )
      //     } catch (e) {
      //       console.log(e)
      //     }
      //   }
      // })
    } catch (e) {
      dispatch({type: types.GET_PROJECT_USERS_FAIL, payload: 'Failed to get user profiles'})
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
  async process({ action, getState, api }) {
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