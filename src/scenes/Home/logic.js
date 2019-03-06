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
        projectJurisdictions: commonHelpers.sortListOfObjects(project.projectJurisdictions, 'name', 'asc'),
        createdById: project.createdById,
        users: {
          all: [],
          lastCheck: null
        }
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
  transform({ getState, action }, next) {
    const lastCheck = getState().scenes.home.main.projects.byId[action.projectId].users.lastCheck
    const now = Date.now()
    const oneday = 60 * 60 * 24 * 1000
    next({
      ...action,
      sendRequest: (lastCheck === null || ((now - lastCheck) > oneday))
    })
  },
  async process({ api, getState, action }, dispatch, done) {
    try {
      if (action.sendRequest) {
        const currentProjectUsers = getState().scenes.home.main.projectUsers.allIds
        const createdBy = action.createdBy
        let usersFromDb = await api.getProjectUsers({}, {}, { projectId: action.projectId })
        if (!usersFromDb.some((el) => {
          return el.id === createdBy.id
        })) {
          usersFromDb.unshift(createdBy)
        }
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
                // if (fullUser.avatar === ''){
                //   fullUser.avatar =
                // 'data:image/jpeg;base64,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'
                // }
                newUsers.push(fullUser)
              } catch (err) {
                console.log(err)
                console.log('failed to get user')
              }
            }
            await Promise.all(newUsers)
            resolve(user)
          })
        })
        Promise.all(users).then(() => {
          dispatch({
            type: types.GET_PROJECT_USERS_SUCCESS,
            payload: {
              projectId: action.projectId,
              users: usersFromDb,
              newUsers: newUsers
            }
          })
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
      } else {
        dispatch({
          type: types.GET_PROJECT_USERS_SUCCESS,
          payload: {
            projectId: action.projectId,
            users: getState().scenes.home.main.projects.byId[action.projectId].users.all,
            newUsers: []
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
