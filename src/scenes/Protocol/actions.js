import * as types from './actionTypes'

export const getProtocolRequest = projectId => ({ type: types.GET_PROTOCOL_REQUEST, projectId })
export const updateProtocol = content => ({ type: types.UPDATE_PROTOCOL, content })
export const saveProtocolRequest = (protocol, projectId) => ({ type: types.SAVE_PROTOCOL_REQUEST, protocol, projectId })