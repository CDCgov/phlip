import * as types from './actionTypes'

export const getProtocolRequest = projectId => ({ type: types.GET_PROTOCOL_REQUEST, projectId })
export const lockProtocolRequest = projectId => ({ type: types.LOCK_PROTOCOL_REQUEST, projectId })
export const unlockProtocolRequest = projectId => ({ type: types.UNLOCK_PROTOCOL_REQUEST, projectId })
export const updateProtocol = content => ({ type: types.UPDATE_PROTOCOL, content })
export const saveProtocolRequest = (protocol, projectId) => ({ type: types.SAVE_PROTOCOL_REQUEST, protocol, projectId })
export const updateEditedFields = projectId => ({ type: types.UPDATE_EDITED_FIELDS, projectId })
export const clearState = () => ({ type: types.CLEAR_STATE })
export const resetSaveError = () => ({ type: types.RESET_ALERT_ERROR })
export const resetLockAlert = () => ({ type: types.RESET_LOCK_ALERT_PROTOCOL })