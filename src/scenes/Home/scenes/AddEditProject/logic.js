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
    return await api.addProject({ ...action.project, lastEditedBy: `${currentUser.firstName} ${currentUser.lastName}` })
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
    return { ...action.project, dateLastEdited: new Date() }
  }
})

export default [
  addProjectLogic,
  updateLastEditedBy,
  updateProjectLogic
]