import * as types from './actionTypes'
export { updateEditedFields } from 'scenes/Home/actions'

export const addJurisdiction = (jurisdiction, projectId) => ({ type: types.ADD_PROJECT_JURISDICTION_REQUEST, jurisdiction, projectId })
export const updateJurisdiction = (jurisdiction, projectId) => ({ type: types.UPDATE_PROJECT_JURISDICTION_REQUEST, jurisdiction, projectId })
export const getProjectJurisdictions = projectId => ({ type: types.GET_PROJECT_JURISDICTIONS_REQUEST, projectId })
export const clearJurisdictions = () => ({ type: types.CLEAR_JURISDICTIONS })

