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
  async process({ action, api }) {
    return await api.addProject(action.project)
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

export const updateLastEditedBy = createLogic({
  type: [types.UPDATE_PROJECT_REQUEST, types.ADD_PROJECT_REQUEST],
  transform({ getState, action }, next) {
    next({
      ...action,
      project: { ...action.project, userId: getState().data.user.currentUser.id }
    })
  }
})

export default [
  addProjectLogic,
  updateLastEditedBy,
  updateProjectLogic
]