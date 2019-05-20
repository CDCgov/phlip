import { createLogic } from 'redux-logic'
import { types } from './actions'

/**
 * Gets a specific project from the API
 * @type {Logic<object, undefined, undefined, {api?: *, action?: *}, undefined, string>}
 */
const getProjectLogic = createLogic({
  type: types.GET_PROJECT_REQUEST,
  async process({ action, api }, dispatch, done) {
    try {
      const project = await api.getProject({}, {}, { projectId: action.projectId })
      dispatch({
        type: types.GET_PROJECT_SUCCESS, payload: { ...project }
      })
    } catch (err) {
      dispatch({ type: types.GET_PROJECT_FAIL })
    }
    done()
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

export default [
  getProjectLogic,
  updateFieldsLogic
]
