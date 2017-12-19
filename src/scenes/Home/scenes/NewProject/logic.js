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
    //return await api.addProject({ ...action.project, lastEditedBy: currentUser.userId })
    const project = await api.addProject({ ...action.project, lastEditedBy: currentUser.userId })
    return { ...project, lastEditedBy: `${currentUser.firstName} ${currentUser.lastName}` }
  }
})

export default [
  addProjectLogic
]