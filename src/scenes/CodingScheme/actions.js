import * as types from './actionTypes'

export const getSchemeRequest = id => ({ type: types.GET_SCHEME_REQUEST, id })
export const lockCodingSchemeRequest = id => ({ type: types.LOCK_SCHEME_REQUEST, id })
export const unlockCodingSchemeRequest = id => ({ type: types.UNLOCK_SCHEME_REQUEST, id })

export const updateQuestionTree = questions => ({ type: types.HANDLE_QUESTION_TREE_CHANGE, questions })
export const toggleHover = (node, path, hover) => ({ type: types.TOGGLE_HOVER, node, path, hover })

export const disableHover = () => ({ type: types.DISABLE_HOVER })
export const enableHover = () => ({ type: types.ENABLE_HOVER })
export const reorderSchemeRequest = projectId => ({ type: types.REORDER_SCHEME_REQUEST, projectId })

export const clearState = () => ({ type: types.CLEAR_STATE })
export const setEmptyState = () => ({ type: types.SET_EMPTY_STATE })
export const resetAlertError = () => ({ type: types.RESET_ALERT_ERROR })
export const closeLockedAlert = () => ({ type: types.CLOSE_CODING_SCHEME_LOCK_ALERT })