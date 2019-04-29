import * as types from './actionTypes'

/** Dispatch when component is mounted, gets the protocol for the project */
export const getProtocolRequest = projectId => ({ type: types.GET_PROTOCOL_REQUEST, projectId })

/** Unlocking and locking the protocol */
export const lockProtocolRequest = projectId => ({ type: types.LOCK_PROTOCOL_REQUEST, projectId })
export const unlockProtocolRequest = (projectId,userId) => ({ type: types.UNLOCK_PROTOCOL_REQUEST, projectId,userId })

/** Update protocol in redux state only */
export const updateProtocol = content => ({ type: types.UPDATE_PROTOCOL, content })

/** Requesting to save protocol content to DB */
export const saveProtocolRequest = (protocol, projectId) => ({ type: types.SAVE_PROTOCOL_REQUEST, protocol, projectId })

/** Updating project lastEditedBy and dateLastEdited fields */
export const updateEditedFields = projectId => ({ type: types.UPDATE_EDITED_FIELDS, projectId })

/** Clearing state and reseting errors */
export const clearState = () => ({ type: types.CLEAR_STATE })
export const resetAlertError = () => ({ type: types.RESET_ALERT_ERROR })
export const resetLockAlert = () => ({ type: types.RESET_LOCK_ALERT_PROTOCOL })