import * as types from '../../actionTypes'

export const addProjectRequest = (project) => ({ type: types.ADD_PROJECT_REQUEST, project })
export const addProjectSuccess = (payload) => ({ type: types.ADD_PROJECT_SUCCESS, payload })
export const addProjectFail = (payload) => ({ type: types.ADD_PROJECT_FAIL, errorValue: payload, error: true })

export const updateProjectRequest = (project) => ({ type: types.UPDATE_PROJECT_REQUEST, project })
export const updateProjectSuccess = (payload) => ({ type: types.UPDATE_PROJECT_SUCCESS, payload })
export const updateProjectFail = (payload) => ({ type: types.UPDATE_PROJECT_FAIL, errorValue: payload, error: true })

export const resetFormError = () => ({ type: types.RESET_FORM_ERROR })