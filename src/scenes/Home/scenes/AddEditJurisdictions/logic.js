import { createLogic } from 'redux-logic'
import * as types from './actionTypes'

export const getJurisdictionsLogic = createLogic({
  type: types.GET_PROJECT_JURISDICTIONS_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_PROJECT_JURISDICTIONS_SUCCESS
  },
  async process ({ action, api }) {
    return await api.getProjectJurisdictions(action.projectId)
  }
})

export const addJurisdictionLogic = createLogic({
  type: types.ADD_PROJECT_JURISDICTION_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.ADD_PROJECT_JURISDICTION_SUCCESS
  },
  async process ({ action, api }) {
    return await api.addJurisdictionToProject(action.projectId, { ...action.jurisdiction, lastEditedBy: action.user })
  }
})

export const updateJurisdictionLogic = createLogic({
  type: types.UPDATE_PROJECT_JURISDICTION_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.UPDATE_PROJECT_JURISDICTION_SUCCESS
  },
  async process ({ action, api }) {
    return await api.updateJurisdictionInProject(action.projectId, { ...action.jurisdiction, lastEditedBy: action.user })
  }
})

export const searchJurisdictionList = createLogic({
  type: types.SEARCH_JURISDICTION_LIST,
  processOptions: {
    dispatchReturn: true,
    successType: types.SET_JURISDICTION_SUGGESTIONS
  },
  async process ({ action, api }) {
    return await api.searchJurisdictionList(action.searchString)
  }
})

// This is to add the current user to the action so that lastEditedBy field can be updated. The action is then sent to
// the reducer for each type.
export const updateFieldsLogic = createLogic({
  type: [types.ADD_PROJECT_JURISDICTION_REQUEST, types.UPDATE_PROJECT_JURISDICTION_REQUEST],
  transform ({ action, getState }, next) {
    const currentUser = getState().data.user.currentUser
    const user = `${currentUser.firstName} ${currentUser.lastName}`
    next({
      ...action,
      user
    })
  }
})

export default [
  getJurisdictionsLogic, addJurisdictionLogic, updateJurisdictionLogic, searchJurisdictionList, updateFieldsLogic
]