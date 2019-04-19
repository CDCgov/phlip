import { types } from '../../actions'

/** Adding a project */
export const addProjectRequest = (project) => ({ type: types.ADD_PROJECT_REQUEST, project })
export const addProjectSuccess = (payload) => ({ type: types.ADD_PROJECT_SUCCESS, payload })
export const addProjectFail = (payload) => ({ type: types.ADD_PROJECT_FAIL, errorValue: payload, error: true })

/** Updating a project */
export const updateProjectRequest = (project) => ({ type: types.UPDATE_PROJECT_REQUEST, project })
export const updateProjectSuccess = (payload) => ({ type: types.UPDATE_PROJECT_SUCCESS, payload })
export const updateProjectFail = (payload) => ({ type: types.UPDATE_PROJECT_FAIL, errorValue: payload, error: true })

/** Reset error */
export const resetFormError = () => ({ type: types.RESET_FORM_ERROR })
