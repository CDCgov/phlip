import { createLogic } from 'redux-logic'
import * as types from './actionTypes'
import { updater } from 'utils'

const getJurisdictionsLogic = createLogic({
  type: types.GET_PROJECT_JURISDICTIONS_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_PROJECT_JURISDICTIONS_SUCCESS
  },
  async process({ action, api }) {
    return await api.getProjectJurisdictions(action.projectId)
  }
})

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

const searchJurisdictionList = createLogic({
  type: types.SEARCH_JURISDICTION_LIST,
  processOptions: {
    dispatchReturn: true,
    successType: types.SET_JURISDICTION_SUGGESTIONS
  },
  async process({ action, api }) {
    return await api.searchJurisdictionList(action.searchString)
  }
})

export default [getJurisdictionsLogic, addJurisdictionLogic, updateJurisdictionLogic, searchJurisdictionList]