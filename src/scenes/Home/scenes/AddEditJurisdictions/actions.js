import * as types from './actionTypes'

export const addJurisdiction = (jurisdiction, project) => ({ type: types.ADD_PROJECT_JURISDICTION, jurisdiction, project })
export const updateJurisdiction = (jurisdiction, project) => ({ type: types.UPDATE_PROJECT_JURISDICTION, jurisdiction, project })