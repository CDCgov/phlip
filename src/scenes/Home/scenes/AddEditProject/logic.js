import { createLogic } from 'redux-logic'
import * as types from '../../actionTypes'

export const addProjectLogic = createLogic({
  type: types.ADD_PROJECT_REQUEST,
  latest: true,
  processOptions: {
    dispatchReturn: true,
    successType: types.ADD_PROJECT_SUCCESS,
    failType: types.ADD_PROJECT_FAIL
  },
  async process({ action, getState, api }) {
    const currentUser = getState().data.user.currentUser
    const user = `${currentUser.firstName} ${currentUser.lastName}`
    return await api.addProject({ ...action.project, lastEditedBy: user, createdBy: user })
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
    return await api.updateProject(action.project)
  }
})

export default [
  addProjectLogic,
  updateLastEditedBy,
  updateProjectLogic
]