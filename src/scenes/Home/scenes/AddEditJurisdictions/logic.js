import { createLogic } from 'redux-logic'
import * as types from './actionTypes'
import { updater } from 'utils'

const addJurisdictionLogic = createLogic({
  type: types.ADD_PROJECT_JURISDICTION_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.ADD_PROJECT_JURISDICTION_SUCCESS
  },
  async process({ action, api }) {
    return await api.addJurisdictionToProject(action.projectId, action.jurisdiction)
  }
})

const updateJurisdictionLogic = createLogic({
  type: types.UPDATE_PROJECT_JURISDICTION_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.UPDATE_PROJECT_JURISDICTION_SUCCESS
  },
  async process({ action, api }) {
    return await api.updateJurisdictionInProject(action.projectId, action.jurisdiction)
  }
})

export default [addJurisdictionLogic, updateJurisdictionLogic]