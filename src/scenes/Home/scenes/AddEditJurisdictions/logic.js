import { createLogic } from 'redux-logic'
import * as types from './actionTypes'

export const getJurisdictionsLogic = createLogic({
  type: types.GET_PROJECT_JURISDICTIONS_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_PROJECT_JURISDICTIONS_SUCCESS,
    failType: types.GET_PROJECT_JURISDICTION_FAIL
  },
  async process ({ action, api }) {
    return await api.getProjectJurisdictions(action.projectId)
  }
})

export const addJurisdictionLogic = createLogic({
  type: types.ADD_PROJECT_JURISDICTION_REQUEST,
  async process ({ action, api }, dispatch, done) {
    try {
      const jurisdiction = await api.addJurisdictionToProject(action.projectId, action.jurisdiction)
      dispatch({
        type: types.ADD_PROJECT_JURISDICTION_SUCCESS,
        payload: { ...jurisdiction }
      })
      dispatch({
        type: types.ADD_JURISDICTION_TO_PROJECT,
        payload: { jurisdiction: { ...jurisdiction }, projectId: action.projectId }
      })
      dispatch({
        type: types.UPDATE_EDITED_FIELDS,
        projectId: action.projectId
      })
    } catch (error) {
      dispatch({
        type: types.ADD_PROJECT_JURISDICTION_FAIL,
        payload: 'We couldn\'t add the jurisdiction to project. Please try again later.',
        error: true
      })
    }
    done()
  }
})

export const updateJurisdictionLogic = createLogic({
  type: types.UPDATE_PROJECT_JURISDICTION_REQUEST,
  async process ({ action, api }, dispatch, done) {
    try {
      const updatedJurisdiction = await api.updateJurisdictionInProject(action.projectId, action.jurisdiction)
      dispatch({
        type: types.UPDATE_PROJECT_JURISDICTION_SUCCESS,
        payload: { ...updatedJurisdiction }
      })
      dispatch({
        type: types.UPDATE_JURISDICTION_IN_PROJECT,
        payload: { jurisdiction: { ...updatedJurisdiction }, projectId: action.projectId }
      })
      dispatch({
        type: types.UPDATE_EDITED_FIELDS,
        projectId: action.projectId
      })
    } catch (error) {
      dispatch({
        type: types.UPDATE_PROJECT_JURISDICTION_FAIL,
        payload: 'We couldn\'t update this jurisdiction. Please try again later.',
        error: true
      })
    }
    done()
  }
})

export const addPresetJurisdictionLogic = createLogic({
  type: types.ADD_PRESET_JURISDICTION_REQUEST,
  async process ({ action, api }, dispatch, done) {
    try {
      const presetJurisdictions = await api.addPresetJurisdictionList(action.projectId, action.jurisdiction)
      dispatch({
        type: types.ADD_PRESET_JURISDICTION_SUCCESS,
        payload: [ ...presetJurisdictions ]
      })
      dispatch({
        type: types.ADD_PRESET_JURISDICTION_TO_PROJECT,
        payload: { jurisdictions: [...presetJurisdictions ], projectId: action.projectId }
      })
      dispatch({
        type: types.UPDATE_EDITED_FIELDS,
        projectId: action.projectId
      })
    } catch (error) {
      dispatch({
        type: types.ADD_PRESET_JURISDICTION_FAIL,
        payload: 'We couldn\'t add the preset jurisdiction list. Please try again later.',
        error: true
      })
    }
    done()
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
  type: [types.ADD_PROJECT_JURISDICTION_REQUEST, types.UPDATE_PROJECT_JURISDICTION_REQUEST, types.ADD_PRESET_JURISDICTION_REQUEST],
  transform ({ action, getState }, next) {
    const userId = getState().data.user.currentUser.id
    next({
      ...action,
      jurisdiction: { ...action.jurisdiction, userId }
    })
  }
})

export default [
  updateFieldsLogic,
  getJurisdictionsLogic,
  addJurisdictionLogic,
  updateJurisdictionLogic,
  searchJurisdictionList,
  addPresetJurisdictionLogic
]