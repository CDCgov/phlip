import { createLogic } from 'redux-logic'
import { types } from '../../actions'
import { types as documentTypes} from 'scenes/DocumentManagement/actions'

/**
 * Sends a request to add a project
 */
export const addProjectLogic = createLogic({
  type: types.ADD_PROJECT_REQUEST,
  async process({ action, api }, dispatch, done) {
    try {
      const project = await api.addProject(action.project, {}, {})
      dispatch({
        type: types.ADD_PROJECT_SUCCESS,
        payload: {
          ...project,
          users: { lastCheck: null, all: [] }
        }
      })
    } catch (error) {
      dispatch({
        type: types.ADD_PROJECT_FAIL,
        payload: 'We couldn\'t add the project. Please try again later.',
        error: true
      })
    }
    done()
  }
})

/**
 * Sends a request to update a project
 */
export const updateProjectLogic = createLogic({
  type: types.UPDATE_PROJECT_REQUEST,
  async process({ action, api }, dispatch, done) {
    try {
      const updatedProject = await api.updateProject(action.project, {}, { projectId: action.project.id })
      dispatch({
        type: types.UPDATE_PROJECT_SUCCESS,
        payload: {
          ...updatedProject,
          users: updatedProject.hasOwnProperty('users') ? updatedProject.users : { lastCheck: null, all: [] }
        }
      })
    } catch (error) {
      dispatch({
        type: types.UPDATE_PROJECT_FAIL,
        payload: 'We couldn\'t update the project. Please try again later.',
        error: true
      })
    }
    done()
  }
})

/**
 * Sends a request to delete a project
 */
export const deleteProjectLogic = createLogic({
  type: types.DELETE_PROJECT_REQUEST,
  async process({getState, action, api }, dispatch, done) {
    const projectMeta = getState().data.projects.byId[action.project]
    try {
      await api.deleteProject({}, {}, { projectId: action.project })
      dispatch({
        type: types.DELETE_PROJECT_SUCCESS,
        project: action.project
      })
      // remove project id from all documents' project list and also clean up redux store when completed
      dispatch({
        type: documentTypes.CLEAN_PROJECT_LIST_REQUEST,
        projectMeta : projectMeta
      })
    } catch (error) {
      dispatch({
        type: types.DELETE_PROJECT_FAIL,
        payload: 'We couldn\'t delete the project. Please try again later.',
        error: true
      })
    }
    done()
  }
})

/**
 * Transforms the actions for creating and updating to include the userId of the user currently logged in so the code
 * doesn't have to be repeated in both logic.
 */
export const updateUserId = createLogic({
  type: [types.ADD_PROJECT_REQUEST, types.UPDATE_PROJECT_REQUEST],
  transform({ getState, action }, next) {
    next({
      ...action,
      project: { ...action.project, userId: getState().data.user.currentUser.id }
    })
  }
})

// /**
//  * Transforms the actions for deleting to remove the project's id from associated documents
//  *
//  */
// export const updateDocuments = createLogic({
//   type: [types.DELETE_DOCUMENT_REQUEST],
//   transform({ getState, action }, next) {
//     next({
//       ...action,
//       project: { ...action.project}
//     })
//   }
// })

export default [
  updateUserId,
  addProjectLogic,
  updateProjectLogic,
  deleteProjectLogic
  // updateDocuments
]
